// src/pages/MyPickups/index.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import api from "../../services/api";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";
import { toast } from "react-toastify";
import QRGenerator from "../../components/QR/QRCode";

// Framer Motion props that should not be forwarded to the DOM
const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ListingTitle = styled.h3`
  color: #2d3748;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(props) =>
    props.$status === "pending" ? "#ed8936" : "#48bb78"};
  color: white;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
`;

const Label = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
`;

const Value = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

const Button = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  padding: 0.75rem;
  background: var(--gradient-primary);
  color: var(--text-button);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const SecondaryButton = styled(Button)`
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  border: 2px solid var(--border-color);
`;

const QRSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 2px dashed var(--border-dashed);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);

  h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
`;

const MyPickups = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState({}); // Track which QR codes are shown
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPickups();
  }, []);

  // In fetchPendingPickups function - REPLACE with:

  const fetchPendingPickups = async () => {
    try {
      setLoading(true);

      // Use existing route and filter on frontend
      const response = await api.get("/listings/user");

      // Filter for pending + assigned listings
      const pendingListings = (
        response.data.listings ||
        response.data ||
        []
      ).filter(
        (listing) => listing.status === "pending" && listing.assignedTo != null
      );

      setListings(pendingListings);
    } catch (error) {
      console.error("Error fetching pickups:", error);
      toast.error("Failed to load pending pickups");
      setListings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleQR = (listingId) => {
    setShowQR((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

  if (loading) {
    return (
      <Container>
        <LoadingSkeleton width="100%" height="8rem" />
        <p aria-live="polite">Loading pickups...</p>
      </Container>
    );
  }

  if (listings.length === 0) {
    return (
      <Container>
        <Title>📦 Pending Pickups</Title>
        <EmptyState>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
          <h2>No Pending Pickups</h2>
          <p>You don't have any assigned listings waiting for pickup.</p>
          <Button
            onClick={() => navigate("/listings")}
            style={{ maxWidth: "300px", margin: "2rem auto 0" }}
          >
            Browse Listings
          </Button>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>📦 Pending Pickups ({listings.length})</Title>

      <Grid>
        {listings.map((listing) => (
          <Card
            key={listing._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatusBadge $status={listing.status}>
              {listing.status.toUpperCase()}
            </StatusBadge>

            <ListingTitle>{listing.title}</ListingTitle>

            <DetailRow>
              <Label>📦 Quantity:</Label>
              <Value>
                {listing.quantity} {listing.unit}
              </Value>
            </DetailRow>

            <DetailRow>
              <Label>👤 Recipient:</Label>
              <Value>
                {listing.assignedTo?.firstName} {listing.assignedTo?.lastName}
              </Value>
            </DetailRow>

            {listing.scheduledPickup && (
              <DetailRow>
                <Label>📅 Pickup Time:</Label>
                <Value>
                  {new Date(listing.scheduledPickup.date).toLocaleDateString()}{" "}
                  {listing.scheduledPickup.timeSlot}
                </Value>
              </DetailRow>
            )}

            <DetailRow>
              <Label>📍 Location:</Label>
              <Value>{listing.pickupLocation}</Value>
            </DetailRow>

            {listing.scheduledPickup?.recipientNotes && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "var(--badge-pending-bg)",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                }}
              >
                <strong>💬 Recipient Notes:</strong>
                <p style={{ margin: "0.5rem 0 0 0" }}>
                  {listing.scheduledPickup.recipientNotes}
                </p>
              </div>
            )}

            <Button onClick={() => toggleQR(listing._id)}>
              {showQR[listing._id] ? "🔒 Hide QR Code" : "📱 Show QR Code"}
            </Button>

            <SecondaryButton
              onClick={() => navigate(`/listings/${listing._id}`)}
            >
              📋 View Details
            </SecondaryButton>

            {showQR[listing._id] && (
              <QRSection>
                <h4
                  style={{
                    textAlign: "center",
                    color: "var(--text-primary)",
                    marginBottom: "1rem",
                  }}
                >
                  📱 Pickup QR Code
                </h4>
                <QRGenerator
                  listingId={listing._id}
                  listingTitle={listing.title}
                  recipientId={listing.assignedTo._id}
                  recipientName={`${listing.assignedTo.firstName} ${listing.assignedTo.lastName}`}
                />
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    marginTop: "1rem",
                  }}
                >
                  Show this QR code to {listing.assignedTo.firstName} at pickup
                </p>
              </QRSection>
            )}
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default MyPickups;
