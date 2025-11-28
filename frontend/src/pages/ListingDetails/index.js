import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { listingsAPI, chatAPI } from "../../services/api";
import QRCodeGenerator from "../../components/QRCode";
import QRScanner from "../../components/QRScanner";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { toast } from "react-toastify";

import AIMatchSuggestions from "../../components/AiMatchSuggestions";
import ProposeScheduleModal from "../../components/ScheduleModal/ProposeScheduleModal";

// =======================
// Styled Components
// =======================
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
  background: ${(props) => {
    switch (props.$status) {
      case "available":
        return "#48bb78";
      case "pending":
        return "#ed8936";
      case "completed":
        return "#4299e1";
      case "expired":
        return "#e53e3e";
      default:
        return "#a0aec0";
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 150px;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WantButton = styled(ActionButton)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
`;

const ContactButton = styled(ActionButton)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
`;

const EditButton = styled(ActionButton)`
  background: #48bb78;
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background: #e53e3e;
  color: white;
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ImageItem = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const QRSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-top: 2rem;
`;

const QueueSection = styled(QRSection)`
  margin-top: 2rem;
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const QueueItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PositionBadge = styled.span`
  background: ${(props) =>
    props.$isUser ? "#48bb78" : "rgba(255, 255, 255, 0.2)"};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #e53e3e;
  font-size: 1.2rem;
`;

// =======================
// Component Logic
// =======================
const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const isDonor =
    listing?.donor?._id === user?._id || listing?.donor === user?._id;
  const isRecipient =
    listing?.assignedTo?._id === user?._id || listing?.assignedTo === user?._id;

  useEffect(() => {
    fetchListing();
    if (user) fetchQueueStatus();
  }, [id, user]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${id}`);
      const data = response.data.listing || response.data;
      setListing(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueStatus = async () => {
    try {
      const response = await api.get(`/listings/${id}/queue/status`);
      setQueueStatus(response.data);
    } catch (error) {
      console.error("Queue fetch error:", error);
    }
  };

  const handleJoinQueue = async () => {
    if (!user) {
      toast.info("Please login to join queue");
      navigate("/login");
      return;
    }
    setLoadingQueue(true);
    try {
      const response = await api.post(`/listings/${id}/queue/join`);
      toast.success(response.data.message);
      fetchQueueStatus();
      fetchListing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join queue");
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleAssignClick = (recipient) => {
    setSelectedRecipient(recipient);
    setShowScheduleModal(true);
  };

  const handleScheduleSuccess = (schedule) => {
    toast.success("Listing assigned with pickup schedule!");
    fetchListing();
  };

  const handleLeaveQueue = async () => {
    setLoadingQueue(true);
    try {
      await api.delete(`/listings/${id}/queue/leave`);
      toast.success("Left the queue");
      fetchQueueStatus();
      fetchListing();
    } catch (error) {
      toast.error("Failed to leave queue");
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleWantThis = async () => {
    if (!user) return navigate("/login");
    if (listing.status !== "available")
      return toast.info("No longer available");

    setIsClaiming(true);
    try {
      const response = await listingsAPI.expressInterest(id, {
        message: "I want this item!",
      });
      if (response.data.success) {
        toast.success("Interest expressed!");
        fetchListing();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to claim");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleContact = async () => {
    if (!user) return navigate("/login");

    const donorId =
      typeof listing.donor === "object" ? listing.donor._id : listing.donor;
    if (!donorId || donorId === user._id) return;

    setIsContacting(true);
    try {
      const response = await chatAPI.createOrGet({
        participantId: donorId,
        listingId: id,
      });
      const chatId = response.data.chat?._id || response.data.data?.chat?._id;
      if (chatId) navigate(`/chat/${chatId}`);
    } catch (error) {
      toast.error("Failed to contact donor");
    } finally {
      setIsContacting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await listingsAPI.delete(id);
        toast.success("Deleted");
        navigate("/listings");
      } catch {
        toast.error("Failed to delete");
      }
    }
  };

  if (loading)
    return (
      <DetailsContainer>
        <LoadingSpinner />
      </DetailsContainer>
    );
  if (error || !listing)
    return (
      <DetailsContainer>
        <ErrorState>{error}</ErrorState>
      </DetailsContainer>
    );

  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate("/listings")}>
        ← Back to Listings
      </BackButton>
      <Card>
        <Title>{listing.title}</Title>
        <StatusBadge $status={listing.status}>
          {listing.status?.toUpperCase()}
        </StatusBadge>

        {listing.images?.length > 0 && (
          <ImageGallery>
            {listing.images.map((img, i) => (
              <ImageItem key={i} src={img} onClick={() => window.open(img)} />
            ))}
          </ImageGallery>
        )}

        {/* Detail Sections */}
        <DetailSection>
          <Label>📝 Description</Label>
          <Value>{listing.description}</Value>
        </DetailSection>
        <DetailSection>
          <Label>📦 Quantity</Label>
          <Value>
            {listing.quantity} {listing.unit}
          </Value>
        </DetailSection>
        <DetailSection>
          <Label>🏷️ Category</Label>
          <Value>{listing.category}</Value>
        </DetailSection>
        <DetailSection>
          <Label>📍 Pickup Location</Label>
          <Value>{listing.pickupLocation}</Value>
        </DetailSection>
        {listing.expiryDate && (
          <DetailSection>
            <Label>⏰ Expires</Label>
            <Value>{new Date(listing.expiryDate).toLocaleDateString()}</Value>
          </DetailSection>
        )}
        <DetailSection>
          <Label>👤 Donor</Label>
          <Value>
            {listing.donor?.firstName} {listing.donor?.lastName}
          </Value>
        </DetailSection>
        {listing.assignedTo && (
          <DetailSection>
            <Label>🎯 Assigned To</Label>
            <Value>
              {listing.assignedTo?.firstName} {listing.assignedTo?.lastName}
            </Value>
          </DetailSection>
        )}

        {/* Interested Users Section */}
        {isDonor && listing.interestedUsers?.length > 0 && (
          <DetailSection>
            <h3>Interested Recipients ({listing.interestedUsers.length})</h3>

            {listing.interestedUsers.map((interest) => (
              <div
                key={interest.user._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  padding: "1rem",
                  background: "#f7fafc",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <strong>
                    {interest.user.firstName} {interest.user.lastName}
                  </strong>
                  {interest.message && (
                    <p style={{ margin: 0 }}>💬 {interest.message}</p>
                  )}
                </div>

                <button
                  onClick={() => handleAssignClick(interest.user)}
                  style={{
                    background: "#4299e1",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  📅 Assign & Schedule Pickup
                </button>
              </div>
            ))}
          </DetailSection>
        )}

        {/* Actions */}
        <ActionButtons>
          {isDonor ? (
            <>
              <EditButton onClick={() => navigate(`/listings/${id}/edit`)}>
                ✏️ Edit
              </EditButton>
              <DeleteButton onClick={handleDelete}>🗑️ Delete</DeleteButton>
            </>
          ) : listing.status === "available" ? (
            <>
              <WantButton onClick={handleWantThis} disabled={isClaiming}>
                {isClaiming ? "Claiming..." : "🎯 I Want This"}
              </WantButton>
              <ContactButton onClick={handleContact} disabled={isContacting}>
                💬 Contact Donor
              </ContactButton>
            </>
          ) : (
            <Value style={{ fontStyle: "italic", color: "#718096" }}>
              Not Available
            </Value>
          )}
        </ActionButtons>
      </Card>
      {isDonor && listing.status === "available" && (
        <AIMatchSuggestions listingId={listing._id} onAssign={fetchListing} />
      )}
      {/* QR for Donor */}
      {isDonor && listing.status === "pending" && (
        <QRSection>
          <h2>📱 QR Code for Pickup</h2>
          <QRCodeGenerator listing={listing} onPickupComplete={fetchListing} />
        </QRSection>
      )}
      {/* QR Scanner for Recipient */}
      {isRecipient && listing.status === "pending" && (
        <QRSection>
          <h2>📷 Scan QR Code</h2>
          <QRScanner onScanComplete={fetchListing} />
        </QRSection>
      )}
      {/* Queue Section */}
      {listing.status === "pending" && !isDonor && !isRecipient && (
        <QueueSection>
          <h2>📋 Waiting List</h2>

          {queueStatus?.userPosition ? (
            <>
              <PositionBadge $isUser={true}>
                Your Position: #{queueStatus.userPosition}
              </PositionBadge>
              <p>
                {queueStatus.userPosition === 1
                  ? "You're next in line!"
                  : `${queueStatus.userPosition - 1} ahead of you`}
              </p>
              <button onClick={handleLeaveQueue} disabled={loadingQueue}>
                Leave Queue
              </button>
            </>
          ) : (
            <>
              <p>{queueStatus?.queueLength || 0} people waiting</p>
              <button
                onClick={handleJoinQueue}
                disabled={
                  loadingQueue ||
                  queueStatus?.queueLength >= queueStatus?.queueLimit
                }
              >
                {loadingQueue ? "Joining..." : "Join Waiting List"}
              </button>
            </>
          )}

          {isDonor && queueStatus?.queue?.length > 0 && (
            <QueueList>
              <h3>People Waiting:</h3>
              {queueStatus.queue.map((q) => (
                <QueueItem key={q.user._id}>
                  <div>
                    #{q.position} - {q.user.firstName} {q.user.lastName}
                  </div>
                  <PositionBadge>{q.status}</PositionBadge>
                  <button
                    onClick={() => handleAssignClick(q.user)}
                    style={{
                      background: "#fff",
                      color: "#000",
                      borderRadius: "8px",
                      padding: "0.4rem 0.7rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      border: "none",
                    }}
                  >
                    📅 Assign
                  </button>
                </QueueItem>
              ))}
            </QueueList>
          )}
        </QueueSection>
      )}
      {/* Schedule Modal */}
      {showScheduleModal && selectedRecipient && (
        <ProposeScheduleModal
          listing={listing}
          recipient={selectedRecipient}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedRecipient(null);
          }}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </DetailsContainer>
  );
};

export default ListingDetails;
