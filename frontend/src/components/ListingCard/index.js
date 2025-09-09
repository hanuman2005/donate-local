import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
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
  const { user } = useAuth();

  const getCategoryEmoji = (category) => {
    const emojis = {
      produce: '🥕',
      dairy: '🥛',
      bakery: '🍞',
      canned: '🥫',
      frozen: '🧊',
      household: '🏠',
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

  const calculateDistance = () => {
    if (!userLocation || !listing.location?.coordinates) return null;
    
    // Simple distance calculation (in reality, use proper geolocation)
    const distance = Math.random() * 10 + 0.5; // Mock distance
    return distance < 1 ? '< 1 km' : `${distance.toFixed(1)} km`;
  };

  const handleContact = async () => {
    if (!user || isOwner) return;
    
    setIsLoading(true);
    try {
      const response = await chatAPI.createChat(listing.donor._id || listing.donor, listing._id);
      if (onContact) {
        onContact(response.data.chat);
      } else {
        // Navigate to chat or show success message
        console.log('Chat created:', response.data.chat);
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
      active: '#48bb78',
      pending: '#ed8936',
      completed: '#4299e1',
      expired: '#e53e3e'
    };
    return colors[status] || colors.active;
  };

  const distance = showDistance ? calculateDistance() : null;
  const expiryDate = formatDate(listing.expiryDate);

  return (
    <CardContainer>
      <ImageContainer>
        {listing.images && listing.images.length > 0 ? (
          <CardImage 
            src={listing.images[0]} 
            alt={listing.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <ImagePlaceholder style={{ 
          display: (listing.images && listing.images.length > 0) ? 'none' : 'flex' 
        }}>
          <span>{getCategoryEmoji(listing.category)}</span>
          <p>No Image</p>
        </ImagePlaceholder>

        <StatusBadge color={getStatusColor(listing.status)}>
          {listing.status || 'active'}
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
            : listing.description
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
              {typeof listing.donor === 'object' 
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