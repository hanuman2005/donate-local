import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI, uploadAPI } from "../../services/api";
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

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Badges data
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
    {
      id: 5,
      icon: "🔥",
      name: "On Fire",
      description: "Active 30 days streak",
      unlocked: false,
    },
    {
      id: 6,
      icon: "❤️",
      name: "Community Hero",
      description: "Helped 100+ people",
      unlocked: false,
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
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await usersAPI.getRatings(user._id);
      setRatings(response.data.ratings || []);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      let avatarUrl = user.avatar;

      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", avatarFile);
        const uploadResponse = await usersAPI.updateProfileImage(
          uploadFormData
        );
        avatarUrl = uploadResponse.data.imageUrl || uploadResponse.data.url;
      }

      const updatedData = {
        ...formData,
        avatar: avatarUrl,
      };

      const response = await usersAPI.updateProfile(user._id, updatedData);

      if (response.data) {
        updateUser(response.data.user || response.data);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      userType: user?.userType || "individual",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const renderStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0;

  if (!user) {
    return (
      <LoadingOverlay>
        <Spinner />
      </LoadingOverlay>
    );
  }

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
                <img src={avatarPreview} alt="Avatar Preview" />
              ) : user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                />
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
                  id="avatar-upload"
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
            {user.bio && !isEditing && <ProfileBio>{user.bio}</ProfileBio>}
            <ProfileActions>
              {isEditing ? (
                <>
                  <ActionButton onClick={handleCancel}>❌ Cancel</ActionButton>
                  <ActionButton
                    $primary
                    onClick={handleSave}
                    disabled={loading}
                  >
                    ✅ Save Changes
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
            <StatLabel>📦 Total Donations</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageRating.toFixed(1)}</StatValue>
            <StatLabel>⭐ Average Rating</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{ratings.length}</StatValue>
            <StatLabel>💬 Reviews</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{badges.filter((b) => b.unlocked).length}</StatValue>
            <StatLabel>🏆 Badges Earned</StatLabel>
          </StatCard>
        </StatsContainer>

        <ContentTabs>
          <Tab
            $active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile Info
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
        </ContentTabs>

        <TabContent>
          {error && <MessageBox $type="error">{error}</MessageBox>}
          {success && <MessageBox $type="success">{success}</MessageBox>}

          {activeTab === "profile" && (
            <FormGrid>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </FormGroup>

              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Account Type</Label>
                <Select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business/Organization</option>
                </Select>
              </FormGroup>

              <FormGroup style={{ gridColumn: "1 / -1" }}>
                <Label>Bio</Label>
                <TextArea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell others about yourself..."
                  disabled={!isEditing}
                  rows="4"
                />
              </FormGroup>
            </FormGrid>
          )}

          {activeTab === "badges" && (
            <BadgesSection>
              {badges.map((badge) => (
                <BadgeCard key={badge.id} $unlocked={badge.unlocked}>
                  <BadgeIcon>{badge.icon}</BadgeIcon>
                  <BadgeName>{badge.name}</BadgeName>
                  <BadgeDescription>{badge.description}</BadgeDescription>
                </BadgeCard>
              ))}
            </BadgesSection>
          )}

          {activeTab === "ratings" && (
            <RatingsSection>
              {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                  <RatingCard key={index}>
                    <RatingHeader>
                      <RaterInfo>
                        <RaterAvatar>
                          {rating.raterName?.[0] || "?"}
                        </RaterAvatar>
                        <div>
                          <RaterName>
                            {rating.raterName || "Anonymous User"}
                          </RaterName>
                          <RatingDate>
                            {formatDate(rating.createdAt)}
                          </RatingDate>
                        </div>
                      </RaterInfo>
                      <Stars>{renderStars(rating.rating)}</Stars>
                    </RatingHeader>
                    {rating.comment && (
                      <RatingComment>"{rating.comment}"</RatingComment>
                    )}
                  </RatingCard>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 2rem",
                    color: "#a0aec0",
                  }}
                >
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                    ⭐
                  </div>
                  <h3 style={{ color: "#4a5568", marginBottom: "0.5rem" }}>
                    No reviews yet
                  </h3>
                  <p>Complete donations to receive reviews from recipients</p>
                </div>
              )}
            </RatingsSection>
          )}
        </TabContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
