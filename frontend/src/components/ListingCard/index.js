// ============================================
// src/components/ListingCard/index.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { chatAPI, listingsAPI } from "../../services/api";
import { toast } from "react-toastify";
import { calculateDistance, formatDistance } from "../../utils/helpers";
import { motionVariants } from "../../animations/motionVariants";
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

    if (!user || !user._id) {
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

    if (!donorId) {
      toast.error("Unable to contact donor. Listing information incomplete.");
      return;
    }

    if (donorId.toString() === user._id.toString()) {
      toast.info("This is your own listing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await chatAPI.createOrGet({
        participantId: donorId,
        listingId: listing._id,
      });

      const chatData =
        response.data.chat || response.data.data?.chat || response.data;
      const chatId = chatData._id || chatData.id;

      if (chatId) {
        toast.success("Opening chat...");
        navigate(`/chat/${chatId}`);
      } else {
        toast.error("Failed to create chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
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
    <CardContainer
      as={motion.div}
      variants={motionVariants.scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    >
      <ImageContainer as={motion.div}>
        {hasImage ? (
          <CardImage
            src={listing.images[0]}
            alt={listing.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getCategoryEmoji(listing.category)}
            </motion.span>
            <p>No Image</p>
          </ImagePlaceholder>
        )}

        <StatusBadge
          as={motion.div}
          color={getStatusColor(listing.status)}
          initial={{ scale: 0, x: 20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {listing.status || "available"}
        </StatusBadge>

        <CategoryBadge
          as={motion.div}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {getCategoryEmoji(listing.category)} {listing.category}
        </CategoryBadge>
      </ImageContainer>

      <CardContent
        as={motion.div}
        variants={motionVariants.staggerContainerFast}
        initial="hidden"
        animate="show"
      >
        <CardTitle as={motion.h3} variants={motionVariants.fadeSlideUp}>
          {listing.title}
        </CardTitle>
        <CardDescription as={motion.p} variants={motionVariants.fadeSlideUp}>
          {listing.description?.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description || "No description provided"}
        </CardDescription>

        <CardMeta as={motion.div} variants={motionVariants.fadeSlideUp}>
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

      <CardFooter
        as={motion.div}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        animate="show"
      >
        {isOwner ? (
          <OwnerActions>
            <EditButton
              as={motion.button}
              onClick={handleEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✏️ Edit
            </EditButton>
            <DeleteButton
              as={motion.button}
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Delete
            </DeleteButton>
          </OwnerActions>
        ) : (
          <>
            <ViewButton
              as={motion.button}
              onClick={handleViewDetails}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👁️ View Details
            </ViewButton>

            {showQuickClaim && listing.status === "available" && (
              <QuickClaimButton
                as={motion.button}
                onClick={handleQuickClaim}
                disabled={isClaiming || !user}
                style={{ marginTop: "0.5rem" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
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

            {authLoading ? (
              <ContactButton disabled>⏳ Loading...</ContactButton>
            ) : !user ? (
              <ContactButton
                as={motion.button}
                onClick={() => {
                  toast.info("Please login first");
                  navigate("/login");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔒 Login to Contact
              </ContactButton>
            ) : (
              <ContactButton
                as={motion.button}
                onClick={handleContact}
                disabled={isLoading}
                title="Contact donor"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? <LoadingSpinner /> : "💬 Contact"}
              </ContactButton>
            )}
          </>
        )}

        {/* 📌 QR Scan button: only show when pickup is pending for this user */}
        {listing.status === "pending" &&
          (listing.assignedTo?._id === user?._id ||
            listing.assignedTo === user?._id) && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/verify-pickup", {
                  state: { listingId: listing._id },
                });
              }}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                width: "100%",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📷 Scan Pickup QR
            </motion.button>
          )}
      </CardFooter>
    </CardContainer>
  );
};

export default ListingCard;
