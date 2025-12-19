import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { listingsAPI, chatAPI } from "../../services/api";
import QRCodeGenerator from "../../components/QR/QRCode";
// import QRScanner from "../../components/QRScanner";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { toast } from "react-toastify";

import AIMatchSuggestions from "../../components/AI/AiMatchSuggestions";
import ScheduleModal from "../../components/Modals/ScheduleModal";
import ReportModal from "../../components/Modals/ReportModal";
import TrustBadges from "../../components/Common/TrustBadges";
import {
  DetailsContainer,
  BackButton,
  Card,
  Title,
  StatusBadge,
  ImageGallery,
  ImageItem,
  DetailSection,
  Label,
  Value,
  ActionButtons,
  ActionButton,
  EditButton,
  DeleteButton,
  WantButton,
  ContactButton,
  QRSection,
  QueueSection,
  PositionBadge,
  QueueList,
  QueueItem,
  ErrorState,
} from "./styledComponents";

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
                className="interested-recipient-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "10px",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
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
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    color: "#fff",
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
