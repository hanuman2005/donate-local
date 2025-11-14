import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { chatAPI, listingsAPI } from "../../services/api";
import { toast } from "react-toastify";
import { calculateDistance, formatDistance } from "../../utils/helpers";
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
  LoadingSpinner,
  QuickClaimButton,
} from "./styledComponents";

const ListingCard = ({
  listing,
  isOwner = false,
  showDistance = false,
  showQuickClaim = false,
  userLocation = null,
  onEdit = null,
  onDelete = null,
  onContact = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ListingCard mounted - User:", user);
    console.log("Auth loading:", authLoading);
  }, [user, authLoading]);

  const getCategoryEmoji = (category) => {
    const emojis = {
      produce: "🥕",
      "canned-goods": "🥫",
      dairy: "🥛",
      bakery: "🍞",
      "household-items": "🏠",
      clothing: "👕",
      electronics: "📱",
      furniture: "🛋️",
      books: "📚",
      toys: "🧸",
      other: "📦",
    };
    return emojis[category] || emojis.other;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDistance = () => {
    if (!userLocation || !listing.location?.coordinates) return null;

    const coords = listing.location.coordinates;
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      coords[1],
      coords[0]
    );

    return formatDistance(distance);
  };

  const handleViewDetails = () => {
    navigate(`/listings/${listing._id}`);
  };

  const handleContact = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("🔍 handleContact called");
    console.log("👤 Current user:", user);
    console.log("📦 Listing:", listing);

    if (!user || !user._id) {
      console.error("❌ User not logged in");
      toast.info("Please login to contact the donor");
      navigate("/login");
      return;
    }

    let donorId = null;
    if (listing.donor) {
      if (typeof listing.donor === "object") {
        donorId = listing.donor._id;
      } else if (typeof listing.donor === "string") {
        donorId = listing.donor;
      }
    }

    console.log("🔍 Donor ID:", donorId);
    console.log("🔍 User ID:", user._id);

    if (!donorId) {
      console.error("❌ Donor ID missing");
      toast.error("Unable to contact donor. Listing information incomplete.");
      return;
    }

    if (donorId.toString() === user._id.toString()) {
      console.warn("⚠️ Cannot contact own listing");
      toast.info("This is your own listing");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Creating/getting chat...");

      const response = await chatAPI.createOrGet({
        participantId: donorId,
        listingId: listing._id,
      });

      console.log("✅ Chat response:", response.data);

      const chatData =
        response.data.chat || response.data.data?.chat || response.data;
      const chatId = chatData._id || chatData.id;

      console.log("📨 Chat ID:", chatId);

      if (chatId) {
        toast.success("Opening chat...");
        navigate(`/chat/${chatId}`);
      } else {
        console.error("❌ No chat ID in response");
        toast.error("Failed to create chat. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error creating chat:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to contact donor. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickClaim = async () => {
    if (!user || !user._id) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    if (listing.status !== "available") {
      toast.info("This item is no longer available");
      return;
    }

    setIsClaiming(true);
    try {
      const response = await listingsAPI.expressInterest(listing._id, {
        message: "I want this item!",
      });

      if (response.data.success) {
        toast.success("Interest expressed! Donor will be notified.");
      } else {
        throw new Error(response.data.message || "Failed to express interest");
      }
    } catch (error) {
      console.error("Error expressing interest:", error);
      toast.error(
        error.response?.data?.message || "Failed to express interest"
      );
    } finally {
      setIsClaiming(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(listing);
    } else {
      navigate(`/listings/${listing._id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(listing);
    } else {
      if (window.confirm("Are you sure you want to delete this listing?")) {
        console.log("Delete listing:", listing._id);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "#48bb78",
      pending: "#ed8936",
      completed: "#4299e1",
      cancelled: "#e53e3e",
      expired: "#e53e3e",
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
          {listing.status || "available"}
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
            : listing.description || "No description provided"}
        </CardDescription>

        <CardMeta>
          <MetaItem>
            <MetaIcon>📦</MetaIcon>
            <MetaText>
              {listing.quantity} {listing.unit || "items"}
            </MetaText>
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
              {typeof listing.donor === "object" && listing.donor
                ? `${listing.donor.firstName} ${listing.donor.lastName}`
                : "Anonymous"}
            </MetaText>
          </MetaItem>
        </CardMeta>
      </CardContent>

      <CardFooter>
        {isOwner ? (
          <OwnerActions>
            <EditButton onClick={handleEdit}>✏️ Edit</EditButton>
            <DeleteButton onClick={handleDelete}>🗑️ Delete</DeleteButton>
          </OwnerActions>
        ) : (
          <>
            {/* Always show View Details */}
            <ViewButton onClick={handleViewDetails}>👁️ View Details</ViewButton>

            {/* Show Quick Claim button if enabled AND available */}
            {showQuickClaim && listing.status === "available" && (
              <QuickClaimButton
                onClick={handleQuickClaim}
                disabled={isClaiming || !user}
                style={{ marginTop: "0.5rem" }}
              >
                {isClaiming ? (
                  <>
                    <LoadingSpinner />
                    Claiming...
                  </>
                ) : (
                  <>🎯 I Want This!</>
                )}
              </QuickClaimButton>
            )}

            {/* Always show Contact button */}
            {authLoading ? (
              <ContactButton disabled>⏳ Loading...</ContactButton>
            ) : !user ? (
              <ContactButton
                onClick={() => {
                  toast.info("Please login first");
                  navigate("/login");
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
                {isLoading ? <LoadingSpinner /> : "💬 Contact"}
              </ContactButton>
            )}
          </>
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default ListingCard;
