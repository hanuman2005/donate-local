import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usersAPI, uploadAPI } from "../../services/api";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  ProfileContainer,
  ProfileCard,
  ProfileHeader,
  ProfileAvatar,
  AvatarImage,
  AvatarPlaceholder,
  AvatarUpload,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  ProfileStats,
  StatItem,
  StatValue,
  StatLabel,
  ProfileContent,
  TabContainer,
  Tab,
  TabContent,
  EditProfileSection,
  ProfileForm,
  FormRow,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  SaveButton,
  CancelButton,
  ButtonRow,
  RatingsSection,
  RatingItem,
  RatingHeader,
  RatingUser,
  RatingDate,
  RatingStars,
  RatingComment,
  ErrorMessage,
  SuccessMessage,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getRatings(user._id);
      setRatings(response.data.ratings || []);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    } finally {
      setLoading(false);
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
        // 2MB limit
        setError("Image size should be less than 2MB");
        return;
      }
      setAvatarFile(file);
      setError("");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      let updatedData = { ...formData };

      // Upload avatar if changed
      if (avatarFile) {
        const uploadResponse = await uploadAPI.uploadImage(avatarFile);
        updatedData.avatar = uploadResponse.data.imageUrl;
      }

      const response = await usersAPI.updateProfile(updatedData);

      if (response.data.success) {
        updateUser(response.data.user);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setAvatarFile(null);
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
    return <LoadingSpinner />;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            {avatarFile ? (
              <AvatarImage
                src={URL.createObjectURL(avatarFile)}
                alt="Avatar Preview"
              />
            ) : user.avatar ? (
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
              <AvatarPlaceholder>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarPlaceholder>
            )}

            {isEditing && (
              <AvatarUpload>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload">📷</label>
              </AvatarUpload>
            )}
          </ProfileAvatar>

          <ProfileInfo>
            <ProfileName>
              {user.firstName} {user.lastName}
            </ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
          </ProfileInfo>

          <ProfileStats>
            <StatItem>
              <StatValue>{user.listingsCount || 0}</StatValue>
              <StatLabel>Listings</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{averageRating.toFixed(1)}</StatValue>
              <StatLabel>Rating</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{ratings.length}</StatValue>
              <StatLabel>Reviews</StatLabel>
            </StatItem>
          </ProfileStats>
        </ProfileHeader>

        <ProfileContent>
          <TabContainer>
            <Tab
              $active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </Tab>
            <Tab
              $active={activeTab === "ratings"}
              onClick={() => setActiveTab("ratings")}
            >
              Reviews
            </Tab>
          </TabContainer>

          <TabContent>
            {activeTab === "profile" && (
              <EditProfileSection>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <ProfileForm>
                  <FormRow>
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
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email should not be editable
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
                  </FormRow>

                  <FormGroup>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormGroup>

                  <FormGroup>
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

                  <FormGroup>
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

                  <ButtonRow>
                    {isEditing ? (
                      <>
                        <CancelButton onClick={handleCancel}>
                          Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSave} disabled={loading}>
                          {loading ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            "Save Changes"
                          )}
                        </SaveButton>
                      </>
                    ) : (
                      <SaveButton onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </SaveButton>
                    )}
                  </ButtonRow>
                </ProfileForm>
              </EditProfileSection>
            )}

            {activeTab === "ratings" && (
              <RatingsSection>
                {loading ? (
                  <LoadingSpinner />
                ) : ratings.length > 0 ? (
                  ratings.map((rating, index) => (
                    <RatingItem key={index}>
                      <RatingHeader>
                        <RatingUser>
                          {rating.raterName || "Anonymous User"}
                        </RatingUser>
                        <RatingDate>{formatDate(rating.createdAt)}</RatingDate>
                      </RatingHeader>
                      <RatingStars>{renderStars(rating.rating)}</RatingStars>
                      {rating.comment && (
                        <RatingComment>"{rating.comment}"</RatingComment>
                      )}
                    </RatingItem>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    No reviews yet
                  </div>
                )}
              </RatingsSection>
            )}
          </TabContent>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
