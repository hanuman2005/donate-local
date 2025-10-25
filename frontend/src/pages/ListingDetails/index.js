import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import QRCodeGenerator from "../../components/QRCode";
import QRScanner from "../../components/QRScanner";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

const DetailsContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  margin-top: 100px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #f093fb;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {  // ✅ FIXED: Use $status (transient prop)
      case 'available': return '#48bb78';
      case 'pending': return '#ed8936';
      case 'completed': return '#4299e1';
      case 'expired': return '#e53e3e';
      default: return '#a0aec0';
    }
  }};
  color: white;
  margin-bottom: 1.5rem;
`;

const DetailSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.p`
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Value = styled.p`
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const QRSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-top: 2rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e53e3e;
  font-size: 1.2rem;
`;

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching listing:", id);
      
      const response = await api.get(`/listings/${id}`);
      console.log("📥 Full response:", response.data);
      
      // Extract listing from response
      const listingData = response.data.listing || response.data;
      console.log("📦 Listing data:", listingData);
      
      setListing(listingData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching listing:", err);
      setError(err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DetailsContainer>
        <LoadingSpinner />
      </DetailsContainer>
    );
  }

  if (error || !listing) {
    return (
      <DetailsContainer>
        <ErrorState>
          ❌ {error || "Listing not found"}
          <br />
          <button
            onClick={() => navigate("/listings")}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#f093fb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back to Listings
          </button>
        </ErrorState>
      </DetailsContainer>
    );
  }

  const isDonor = listing?.donor?._id === user?._id;
  const isRecipient = listing?.assignedTo?._id === user?._id;

  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate("/listings")}>
        ← Back to Listings
      </BackButton>

      <Card>
        <Title>{listing.title}</Title>
        <StatusBadge $status={listing.status}>  {/* ✅ FIXED: Use $status */}
          {listing.status?.toUpperCase() || 'AVAILABLE'}
        </StatusBadge>

        <DetailSection>
          <Label>📝 Description</Label>
          <Value>{listing.description}</Value>
        </DetailSection>

        <DetailSection>
          <Label>📦 Quantity</Label>
          <Value>{listing.quantity} {listing.unit || 'items'}</Value>
        </DetailSection>

        <DetailSection>
          <Label>📍 Pickup Location</Label>
          <Value>{listing.pickupLocation}</Value>
        </DetailSection>

        {listing.pickupTime && (
          <DetailSection>
            <Label>🕐 Pickup Time</Label>
            <Value>{new Date(listing.pickupTime).toLocaleString()}</Value>
          </DetailSection>
        )}

        {listing.expiryDate && (
          <DetailSection>
            <Label>⏰ Expires On</Label>
            <Value>{new Date(listing.expiryDate).toLocaleDateString()}</Value>
          </DetailSection>
        )}

        <DetailSection>
          <Label>👤 Donor</Label>
          <Value>
            {listing.donor?.firstName && listing.donor?.lastName
              ? `${listing.donor.firstName} ${listing.donor.lastName}`
              : listing.donor?.name || "Anonymous"}
          </Value>
        </DetailSection>

        {listing.assignedTo && (
          <DetailSection>
            <Label>🎯 Assigned To</Label>
            <Value>
              {listing.assignedTo?.firstName && listing.assignedTo?.lastName
                ? `${listing.assignedTo.firstName} ${listing.assignedTo.lastName}`
                : listing.assignedTo?.name || "Unknown"}
            </Value>
          </DetailSection>
        )}
      </Card>

      {/* QR Code Section for Donor */}
      {isDonor && listing.status === 'pending' && (
        <QRSection>
          <h2 style={{ marginBottom: '1rem' }}>📱 QR Code for Pickup</h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Share this QR code with the recipient for pickup verification
          </p>
          <QRCodeGenerator 
            listing={listing}
            onPickupComplete={() => {
              fetchListing();
              alert('✅ Pickup completed successfully!');
            }}
          />
        </QRSection>
      )}

      {/* QR Scanner Section for Recipient */}
      {isRecipient && listing.status === 'pending' && (
        <QRSection>
          <h2 style={{ marginBottom: '1rem' }}>📷 Scan QR Code</h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Scan the donor's QR code to confirm pickup
          </p>
          <QRScanner
            onScanComplete={(data) => {
              console.log('✅ Pickup confirmed:', data);
              fetchListing();
              alert('🎉 Thank you! Pickup confirmed.');
            }}
          />
        </QRSection>
      )}
    </DetailsContainer>
  );
};

export default ListingDetails;