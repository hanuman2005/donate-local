import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI, uploadAPI } from "../../services/api";
import api from "../../services/api";
import { toast } from "react-toastify";

import {
  ProfileContainer,
  ProfileCard,
  CoverPhoto,
  ProfileHeader,
  AvatarWrapper,
  Avatar,
  AvatarUpload,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  ProfileBio,
  ProfileActions,
  ActionButton,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ContentTabs,
  Tab,
  TabContent,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  BadgesSection,
  BadgeCard,
  BadgeIcon,
  BadgeName,
  BadgeDescription,
  RatingsSection,
  RatingCard,
  RatingHeader,
  RaterInfo,
  RaterAvatar,
  RaterName,
  RatingDate,
  Stars,
  RatingComment,
  MessageBox,
  LoadingOverlay,
  Spinner,
} from "./styledComponents";

import {
  HistorySection,
  HistoryItem,
  ItemDetails,
  ItemTitle,
  ItemMeta,
  ReceiptButton,
  ReceiptModal,
  ReceiptHeader,
  ReceiptBody,
  ReceiptRow,
} from "./styledComponents";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    userType: user?.userType || "individual",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const badges = [
    {
      id: 1,
      icon: "🌟",
      name: "First Donation",
      description: "Made your first donation",
      unlocked: (user?.listingsCount || 0) > 0,
    },
    {
      id: 2,
      icon: "🏆",
      name: "Super Donor",
      description: "Made 10+ donations",
      unlocked: (user?.listingsCount || 0) >= 10,
    },
    {
      id: 3,
      icon: "💎",
      name: "Diamond Donor",
      description: "Made 50+ donations",
      unlocked: (user?.listingsCount || 0) >= 50,
    },
    {
      id: 4,
      icon: "⭐",
      name: "Top Rated",
      description: "4.5+ average rating",
      unlocked: (user?.rating || 0) >= 4.5,
    },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        userType: user.userType || "individual",
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "ratings") fetchRatings();
    if (activeTab === "impact") fetchStats();
    if (activeTab === "donations") fetchHistory("donated");
    if (activeTab === "received") fetchHistory("received");
  }, [activeTab]);

  const fetchRatings = async () => {
    try {
      const res = await usersAPI.getRatings(user._id);
      setRatings(res.data.ratings || []);
    } catch {
      toast.error("Failed to fetch ratings");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/analytics/user");
      setStats(res.data.analytics);
    } catch {
      toast.error("Failed to fetch analytics");
    }
  };

  const fetchHistory = async (type) => {
    try {
      const res = await api.get(`/listings/user?type=${type}`);
      setHistory(res.data.listings);
    } catch {
      toast.error("Failed to fetch listings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else toast.error("Invalid image (max 2MB)");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let avatarUrl = user.avatar;

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append("image", avatarFile);
        const uploadRes = await usersAPI.updateProfileImage(uploadData);
        avatarUrl = uploadRes.data.imageUrl || uploadRes.data.url;
      }

      const updated = { ...formData, avatar: avatarUrl };
      const res = await usersAPI.updateProfile(user._id, updated);
      updateUser(res.data.user || res.data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (item) => setSelectedReceipt(item);

  const downloadReceipt = (item) => {
    const data = `
════ DONATION RECEIPT ════

Item: ${item.title}
Quantity: ${item.quantity} ${item.unit}
Category: ${item.category}
Status: ${item.status.toUpperCase()}

Donor: ${item?.donor?.firstName || ""} ${item?.donor?.lastName || ""}
Recipient: ${item?.assignedTo?.firstName || ""} ${
      item?.assignedTo?.lastName || ""
    }

Date: ${new Date(item.completedAt || item.createdAt).toLocaleDateString()}
──────────────────────
Thank you for supporting your community!
    `;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-receipt-${item._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStars = (r) =>
    "⭐".repeat(Math.floor(r)) + "☆".repeat(5 - Math.floor(r));

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
      : 0;

  return (
    <ProfileContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}

      <ProfileCard>
        <CoverPhoto />
        <ProfileHeader>
          <AvatarWrapper>
            <Avatar>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" />
              ) : user.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <span>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </span>
              )}
            </Avatar>
            {isEditing && (
              <AvatarUpload>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                📷
              </AvatarUpload>
            )}
          </AvatarWrapper>

          <ProfileInfo>
            <ProfileName>
              {user.firstName} {user.lastName}
            </ProfileName>
            <ProfileEmail>📧 {user.email}</ProfileEmail>
            {!isEditing && user.bio && <ProfileBio>{user.bio}</ProfileBio>}
            <ProfileActions>
              {isEditing ? (
                <>
                  <ActionButton onClick={() => setIsEditing(false)}>
                    ❌ Cancel
                  </ActionButton>
                  <ActionButton $primary onClick={handleSave}>
                    ✅ Save
                  </ActionButton>
                </>
              ) : (
                <ActionButton $primary onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </ActionButton>
              )}
            </ProfileActions>
          </ProfileInfo>
        </ProfileHeader>

        <StatsContainer>
          <StatCard>
            <StatValue>{user.listingsCount || 0}</StatValue>
            <StatLabel>Total Donations</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageRating.toFixed(1)}</StatValue>
            <StatLabel>Average Rating</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{ratings.length}</StatValue>
            <StatLabel>Reviews</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{badges.filter((b) => b.unlocked).length}</StatValue>
            <StatLabel>Badges</StatLabel>
          </StatCard>
        </StatsContainer>

        <ContentTabs>
          <Tab
            $active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </Tab>
          <Tab
            $active={activeTab === "badges"}
            onClick={() => setActiveTab("badges")}
          >
            🏆 Achievements
          </Tab>
          <Tab
            $active={activeTab === "ratings"}
            onClick={() => setActiveTab("ratings")}
          >
            ⭐ Reviews
          </Tab>
          <Tab
            $active={activeTab === "impact"}
            onClick={() => setActiveTab("impact")}
          >
            📊 My Impact
          </Tab>
          <Tab
            $active={activeTab === "donations"}
            onClick={() => setActiveTab("donations")}
          >
            🎁 My Donations
          </Tab>
          <Tab
            $active={activeTab === "received"}
            onClick={() => setActiveTab("received")}
          >
            📦 Received Items
          </Tab>
        </ContentTabs>

        <TabContent>
          {activeTab === "profile" && (
            <FormGrid>
              {[
                "firstName",
                "lastName",
                "email",
                "phone",
                "address",
                "userType",
                "bio",
              ].map((f) => (
                <FormGroup
                  key={f}
                  style={f === "bio" ? { gridColumn: "1 / -1" } : {}}
                >
                  <Label>{f.charAt(0).toUpperCase() + f.slice(1)}</Label>
                  {f === "bio" ? (
                    <TextArea
                      name={f}
                      value={formData[f]}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  ) : f === "userType" ? (
                    <Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="individual">Individual</option>
                      <option value="business">Business</option>
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      name={f}
                      value={formData[f]}
                      onChange={handleInputChange}
                      disabled={f === "email" || !isEditing}
                    />
                  )}
                </FormGroup>
              ))}
            </FormGrid>
          )}

          {activeTab === "badges" && (
            <BadgesSection>
              {badges.map((b) => (
                <BadgeCard key={b.id} $unlocked={b.unlocked}>
                  <BadgeIcon>{b.icon}</BadgeIcon>
                  <BadgeName>{b.name}</BadgeName>
                  <BadgeDescription>{b.description}</BadgeDescription>
                </BadgeCard>
              ))}
            </BadgesSection>
          )}

          {activeTab === "ratings" && (
            <RatingsSection>
              {ratings.map((r, i) => (
                <RatingCard key={i}>
                  <RatingHeader>
                    <RaterInfo>
                      <RaterAvatar>{r.raterName?.[0] || "?"}</RaterAvatar>
                      <div>
                        <RaterName>{r.raterName || "Anonymous"}</RaterName>
                        <RatingDate>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </RatingDate>
                      </div>
                    </RaterInfo>
                    <Stars>{renderStars(r.rating)}</Stars>
                  </RatingHeader>
                  {r.comment && <RatingComment>"{r.comment}"</RatingComment>}
                </RatingCard>
              ))}
            </RatingsSection>
          )}

          {activeTab === "impact" && stats && (
            <StatsContainer>
              <StatCard>
                <StatValue>{stats.totalListings || 0}</StatValue>
                <StatLabel>Total Donations</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.completedListings || 0}</StatValue>
                <StatLabel>Completed</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{stats.activeListings || 0}</StatValue>
                <StatLabel>Active</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>⭐ 4.8</StatValue>
                <StatLabel>Avg Rating</StatLabel>
              </StatCard>
            </StatsContainer>
          )}

          {(activeTab === "donations" || activeTab === "received") && (
            <HistorySection>
              {history.map((item) => (
                <HistoryItem key={item._id}>
                  <ItemDetails>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemMeta>
                      <span>
                        📅 {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        📦 {item.quantity} {item.unit}
                      </span>
                      <span>📊 {item.status}</span>
                    </ItemMeta>
                  </ItemDetails>
                  <ReceiptButton onClick={() => generateReceipt(item)}>
                    📄 Receipt
                  </ReceiptButton>
                </HistoryItem>
              ))}
            </HistorySection>
          )}
        </TabContent>
      </ProfileCard>

      {selectedReceipt && (
        <ReceiptModal>
          <ReceiptHeader>
            <h2>🎁 DONATION RECEIPT</h2>
            <p>{selectedReceipt.title}</p>
          </ReceiptHeader>
          <ReceiptBody>
            <ReceiptRow>
              <span>Quantity:</span>
              <strong>
                {selectedReceipt.quantity} {selectedReceipt.unit}
              </strong>
            </ReceiptRow>
            <ReceiptRow>
              <span>Status:</span>
              <strong>{selectedReceipt.status}</strong>
            </ReceiptRow>
            <ReceiptRow>
              <span>Date:</span>
              <strong>
                {new Date(selectedReceipt.createdAt).toLocaleDateString()}
              </strong>
            </ReceiptRow>
          </ReceiptBody>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <ReceiptButton onClick={() => downloadReceipt(selectedReceipt)}>
              💾 Download
            </ReceiptButton>
            <ReceiptButton onClick={() => setSelectedReceipt(null)}>
              Close
            </ReceiptButton>
          </div>
        </ReceiptModal>
      )}
    </ProfileContainer>
  );
};

export default Profile;
