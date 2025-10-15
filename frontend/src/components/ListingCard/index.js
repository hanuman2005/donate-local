import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { calculateDistance, formatDistance } from '../../utils/helpers';
import {
  CardContainer,
  ImageContainer,
  CardImage,
  ImagePlaceholder,
  StatusBadge,
  CategoryBadge,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
  MetaItem,
  MetaIcon,
  MetaText,
  CardFooter,
  ContactButton,
  ViewButton,
  OwnerActions,
  EditButton,
  DeleteButton,
  LoadingSpinner
} from './styledComponents';

const ListingCard = ({ 
  listing, 
  isOwner = false, 
  showDistance = false, 
  userLocation = null,
  onEdit = null,
  onDelete = null,
  onContact = null 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();

  const getCategoryEmoji = (category) => {
    const emojis = {
      produce: '🥕',
      'canned-goods': '🥫',
      dairy: '🥛',
      bakery: '🍞',
      'household-items': '🏠',
      clothing: '👕',
      other: '📦'
    };
    return emojis[category] || emojis.other;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDistance = () => {
    if (!userLocation || !listing.location?.coordinates) return null;
    
    const coords = listing.location.coordinates;
    // GeoJSON format is [longitude, latitude]
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords[1], // latitude
      coords[0]  // longitude
    );
    
    return formatDistance(distance);
  };

  const handleContact = async () => {
    if (!user || isOwner) return;
    
    setIsLoading(true);
    try {
      // Get donor ID - handle both populated and non-populated cases
      const donorId = typeof listing.donor === 'object' 
        ? listing.donor._id 
        : listing.donor;

      // Use createOrGet to create or retrieve existing chat
      const response = await chatAPI.createOrGet({
        participantId: donorId,
        listingId: listing._id
      });

      if (onContact) {
        onContact(response.data.chat);
      } else {
        // Navigate to chat or show success message
        console.log('Chat created/retrieved:', response.data.chat);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(listing);
    } else {
      // Navigate to edit page
      console.log('Edit listing:', listing._id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(listing);
    } else {
      // Show delete confirmation
      console.log('Delete listing:', listing._id);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: '#48bb78',
      pending: '#ed8936',
      completed: '#4299e1',
      cancelled: '#e53e3e',
      expired: '#e53e3e'
    };
    return colors[status] || colors.available;
  };

  const distance = showDistance ? getDistance() : null;
  const expiryDate = formatDate(listing.expiryDate);
  const hasImage = listing.images && listing.images.length > 0 && !imageError;

  return (
    <CardContainer>
      <ImageContainer>
        {hasImage ? (
          <CardImage 
            src={listing.images[0]} 
            alt={listing.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder>
            <span>{getCategoryEmoji(listing.category)}</span>
            <p>No Image</p>
          </ImagePlaceholder>
        )}

        <StatusBadge color={getStatusColor(listing.status)}>
          {listing.status || 'available'}
        </StatusBadge>

        <CategoryBadge>
          {getCategoryEmoji(listing.category)} {listing.category}
        </CategoryBadge>
      </ImageContainer>

      <CardContent>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>
          {listing.description?.length > 100 
            ? `${listing.description.substring(0, 100)}...`
            : listing.description || 'No description provided'
          }
        </CardDescription>

        <CardMeta>
          <MetaItem>
            <MetaIcon>📦</MetaIcon>
            <MetaText>{listing.quantity} {listing.unit || 'items'}</MetaText>
          </MetaItem>

          {distance && (
            <MetaItem>
              <MetaIcon>📍</MetaIcon>
              <MetaText>{distance}</MetaText>
            </MetaItem>
          )}

          {expiryDate && (
            <MetaItem>
              <MetaIcon>📅</MetaIcon>
              <MetaText>Best before {expiryDate}</MetaText>
            </MetaItem>
          )}

          <MetaItem>
            <MetaIcon>👤</MetaIcon>
            <MetaText>
              {typeof listing.donor === 'object' && listing.donor
                ? `${listing.donor.firstName} ${listing.donor.lastName}`
                : 'Anonymous'
              }
            </MetaText>
          </MetaItem>
        </CardMeta>
      </CardContent>

      <CardFooter>
        {isOwner ? (
          <OwnerActions>
            <EditButton onClick={handleEdit}>
              ✏️ Edit
            </EditButton>
            <DeleteButton onClick={handleDelete}>
              🗑️ Delete
            </DeleteButton>
          </OwnerActions>
        ) : (
          <>
            <ViewButton>
              👁️ View Details
            </ViewButton>
            <ContactButton 
              onClick={handleContact}
              disabled={isLoading || !user}
              title={!user ? 'Please login to contact' : 'Contact donor'}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                '💬 Contact'
              )}
            </ContactButton>
          </>
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default ListingCard;