import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../services/api';
import { toast } from 'react-toastify'; // ✅ ADD THIS
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
  const { user, loading: authLoading } = useAuth(); // ✅ Get loading state
  const navigate = useNavigate();

  // ✅ Add debug log
  useEffect(() => {
    console.log('ListingCard mounted - User:', user);
    console.log('Auth loading:', authLoading);
  }, [user, authLoading]); // ✅ ADD THIS

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

  // ✅ FIXED: View Details handler
  const handleViewDetails = () => {
    navigate(`/listings/${listing._id}`);
  };

  // ✅ FIXED: Contact handler with comprehensive null checks
  const handleContact = async (e) => {
    // ✅ Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🔍 handleContact called');
    console.log('👤 Current user object:', user);
    console.log('📦 Full listing object:', listing);
    console.log('📦 Listing.donor:', listing.donor);
    console.log('🏷️ isOwner:', isOwner);

    // ✅ CRITICAL: Check if user exists and has _id
    if (!user) {
      console.error('❌ User is null');
      toast.error('Please login to contact the donor');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    if (!user._id) {
      console.error('❌ User exists but has no _id:', user);
      toast.error('Session error. Please login again.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    // ✅ FIXED: Better donor ID extraction
    let donorId = null;
    
    if (listing.donor) {
      if (typeof listing.donor === 'object') {
        donorId = listing.donor._id;
      } else if (typeof listing.donor === 'string') {
        donorId = listing.donor;
      }
    }
    
    console.log('🔍 Extracted Donor ID:', donorId);
    console.log('🔍 Donor ID type:', typeof donorId);
    console.log('🔍 Current User ID:', user._id);

    // ✅ Check if donor ID exists
    if (!donorId) {
      console.error('❌ Donor ID is missing from listing');
      console.error('Full listing:', JSON.stringify(listing, null, 2));
      toast.error('Unable to contact donor. Listing information incomplete.');
      return;
    }

    // Check if trying to contact own listing
    if (donorId.toString() === user._id.toString()) {
      console.warn('⚠️ User trying to contact own listing');
      toast.info('This is your own listing');
      return;
    }

    if (isOwner) {
      console.warn('⚠️ isOwner flag is true');
      toast.info('This is your own listing');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🔄 Creating chat with params:', {
        participantId: donorId,
        listingId: listing._id
      });

      // Use createOrGet to create or retrieve existing chat
      const response = await chatAPI.createOrGet({
        participantId: donorId,
        listingId: listing._id
      });

      console.log('✅ Chat API response:', response.data);

      if (onContact) {
        onContact(response.data.chat || response.data.data?.chat);
      } else {
        // Navigate to chat page
        const chatData = response.data.chat || response.data.data?.chat;
        const chatId = chatData?._id;
        
        console.log('📨 Chat data:', chatData);
        console.log('🆔 Chat ID:', chatId);
        
        if (chatId) {
          toast.success('Opening chat...');
          navigate(`/chat/${chatId}`);
        } else {
          console.error('❌ No chat ID in response');
          toast.success('Contact request sent!');
        }
      }
    } catch (error) {
      console.error('❌ Error creating chat:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to contact donor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(listing);
    } else {
      // Navigate to edit page
      navigate(`/listings/${listing._id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(listing);
    } else {
      // Show delete confirmation
      if (window.confirm('Are you sure you want to delete this listing?')) {
        console.log('Delete listing:', listing._id);
        // TODO: Implement delete API call
      }
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
            <ViewButton onClick={handleViewDetails}>
              👁️ View Details
            </ViewButton>
            
            {/* ✅ Only show contact button if not loading auth */}
            {authLoading ? (
              <ContactButton disabled>
                ⏳ Loading...
              </ContactButton>
            ) : !user ? (
              <ContactButton 
                onClick={() => {
                  toast.info('Please login first');
                  navigate('/login');
                }}
              >
                🔒 Login to Contact
              </ContactButton>
            ) : (
              <ContactButton 
                onClick={handleContact}
                disabled={isLoading}
                title="Contact donor"
              >
                {isLoading ? <LoadingSpinner /> : '💬 Contact'}
              </ContactButton>
            )}
          </>
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default ListingCard;