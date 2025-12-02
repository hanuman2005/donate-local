import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { listingsAPI, chatAPI } from "../../services/api";
import QRCodeGenerator from "../../components/QRCode";
import QRScanner from "../../components/QRScanner";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { toast } from "react-toastify";

import AIMatchSuggestions from "../../components/AiMatchSuggestions";
import ScheduleModal from "../../components/ScheduleModal";
import ReportModal from "../../components/ReportModal";
import TrustBadges from "../../components/TrustBadges";
// src/pages/ListingDetails/styledComponents.js - FIXED FOR SIDEBAR LAYOUT
import styled from "styled-components";

export const DetailsContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(-4px);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.6rem 0.8rem;
  }
`;

export const Card = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: var(--radius-lg);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 700;
  background: ${(props) => {
    switch (props.$status) {
      case "available":
        return "var(--success)";
      case "pending":
        return "var(--warning)";
      case "completed":
        return "var(--info)";
      case "expired":
        return "var(--error)";
      default:
        return "#a0aec0";
    }
  }};
  color: white;
  margin-bottom: 1.5rem;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }
`;

export const Label = styled.p`
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Value = styled.p`
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button`
  flex: 1;
  min-width: 150px;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
`;

export const WantButton = styled(ActionButton)`
  background: var(--gradient-success);
  color: white;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
  }
`;

export const ContactButton = styled(ActionButton)`
  background: var(--gradient-info);
  color: white;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
  }
`;

export const EditButton = styled(ActionButton)`
  background: var(--success);
  color: white;

  &:hover:not(:disabled) {
    background: var(--success-light);
  }
`;

export const DeleteButton = styled(ActionButton)`
  background: var(--error);
  color: white;

  &:hover:not(:disabled) {
    background: var(--error-light);
  }
`;

export const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageItem = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--border-color);

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

export const QRSection = styled.div`
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: 2rem;
  color: white;
  margin-top: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    opacity: 0.95;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h3 {
      font-size: 1.3rem;
    }
  }
`;

export const QueueSection = styled(QRSection)`
  margin-top: 2rem;
  text-align: left;

  h3 {
    text-align: center;
  }
`;

export const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const QueueItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-base);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const QueueUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const QueueUserName = styled.div`
  font-weight: 600;
  font-size: 1.05rem;
`;

export const QueueTimestamp = styled.div`
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

export const PositionBadge = styled.span`
  background: ${(props) =>
    props.$isUser
      ? "var(--success)"
      : "rgba(255, 255, 255, 0.25)"};
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: var(--error);
  font-size: 1.3rem;
  font-weight: 600;
  background: var(--error-bg);
  border-radius: var(--radius-xl);
  border: 2px solid var(--error);
  margin: 2rem auto;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    font-size: 1.1rem;
  }
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

export const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
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
  const [showReportModal, setShowReportModal] = useState(false);

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
          {/* ADD THIS: */}
          <TrustBadges
            user={listing.donor}
            showScore={true}
            showVerification={true}
          />
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
          {/* Report Button - visible to everyone except owner */}
          {!isDonor && (
            <ActionButton
              onClick={() => setShowReportModal(true)}
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                flex: "0 1 auto",
              }}
            >
              🚨 Report
            </ActionButton>
          )}
          {/* Schedule Pickup Button - Only for donors with pending listings */}
          {isDonor && listing.status === "pending" && listing.assignedTo && (
            <ActionButton
              onClick={() => {
                setSelectedRecipient(listing.assignedTo);
                setShowScheduleModal(true);
              }}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              📍 Schedule Pickup
            </ActionButton>
          )}
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
      {isDonor && listing.status === "pending" && listing.assignedTo && (
        <QRSection>
          <h2>📱 QR Code for Pickup</h2>
          <QRCodeGenerator
            listingId={listing._id}
            listingTitle={listing.title}
            recipientId={listing.assignedTo._id}
            recipientName={`${listing.assignedTo.firstName} ${listing.assignedTo.lastName}`}
          />
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
        <ScheduleModal
          listing={listing}
          recipient={selectedRecipient}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedRecipient(null);
          }}
          onSuccess={handleScheduleSuccess}
        />
      )}
      {showReportModal && (
        <ReportModal
          type="listing"
          targetId={listing._id}
          targetTitle={listing.title}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            toast.success("Report submitted successfully");
            setShowReportModal(false);
          }}
        />
      )}
    </DetailsContainer>
  );
};

export default ListingDetails;
