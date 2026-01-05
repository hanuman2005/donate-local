// src/pages/Profile/index.jsx - POLISHED WITH FRAMER MOTION
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { usersAPI } from "../../services/api";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motionVariants } from "../../animations/motionVariants";
import TrustBadges from "../../components/Common/TrustBadges";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setTimeout(() => setError(""), 3000);
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
    <ProfileContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <AnimatePresence>
        {loading && (
          <LoadingOverlay
            as={motion.div}
            variants={motionVariants.modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.div
              variants={motionVariants.scalePop}
              initial="hidden"
              animate="show"
            >
              <LoadingSkeleton width="100%" height="8rem" />
              <p aria-live="polite">Loading profile...</p>
            </motion.div>
          </LoadingOverlay>
        )}
      </AnimatePresence>

      <ProfileCard
        as={motion.div}
        variants={motionVariants.scaleIn}
        initial="hidden"
        animate="show"
      >
        <CoverPhoto
          as={motion.div}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <ProfileHeader>
          <AvatarWrapper
            as={motion.div}
            variants={motionVariants.scaleIn}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            <Avatar
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
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
              <AvatarUpload
                as={motion.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                📷
              </AvatarUpload>
            )}
          </AvatarWrapper>

          <ProfileInfo
            as={motion.div}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            <ProfileName>
              {user.firstName} {user.lastName}
            </ProfileName>
            <ProfileEmail>📧 {user.email}</ProfileEmail>
            {!isEditing && user.bio && <ProfileBio>{user.bio}</ProfileBio>}

            <AnimatePresence mode="wait">
              {(success || error) && (
                <MessageBox
                  as={motion.div}
                  variants={motionVariants.dropDownSpring}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  $type={error ? "error" : "success"}
                >
                  {success || error}
                </MessageBox>
              )}
            </AnimatePresence>

            <ProfileActions>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    style={{ display: "flex", gap: "1rem" }}
                    variants={motionVariants.fadeSlide}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <ActionButton
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                    >
                      ❌ Cancel
                    </ActionButton>
                    <ActionButton
                      as={motion.button}
                      $primary
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                    >
                      ✅ Save Changes
                    </ActionButton>
                  </motion.div>
                ) : (
                  <ActionButton
                    key="not-editing"
                    as={motion.button}
                    $primary
                    variants={motionVariants.fadeSlide}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </ActionButton>
                )}
              </AnimatePresence>
            </ProfileActions>
          </ProfileInfo>
        </ProfileHeader>

        <StatsContainer
          as={motion.div}
          variants={motionVariants.staggerContainer}
          initial="hidden"
          animate="show"
        >
          {[
            { value: user.listingsCount || 0, label: "Total Donations" },
            { value: averageRating.toFixed(1), label: "Average Rating" },
            { value: ratings.length, label: "Reviews" },
            { value: badges.filter((b) => b.unlocked).length, label: "Badges" },
          ].map((stat, i) => (
            <StatCard
              key={i}
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>

        <ContentTabs
          as={motion.div}
          variants={motionVariants.fadeSlideDown}
          initial="hidden"
          animate="show"
        >
          {[
            { id: "profile", icon: "👤", label: "Profile" },
            { id: "badges", icon: "🏆", label: "Achievements" },
            { id: "ratings", icon: "⭐", label: "Reviews" },
            { id: "impact", icon: "📊", label: "My Impact" },
            { id: "donations", icon: "🎁", label: "My Donations" },
            { id: "received", icon: "📦", label: "Received Items" },
          ].map((tab) => (
            <Tab
              key={tab.id}
              as={motion.button}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon} {tab.label}
            </Tab>
          ))}
        </ContentTabs>
        <TrustBadges user={user} showScore={true} showVerification={true} />

        <AnimatePresence mode="wait">
          <TabContent
            as={motion.div}
            key={activeTab}
            variants={motionVariants.tabContent}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <FormGrid
                as={motion.div}
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="show"
              >
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
                    as={motion.div}
                    variants={motionVariants.listItemSlideUp}
                    style={f === "bio" ? { gridColumn: "1 / -1" } : {}}
                  >
                    <Label>{f.charAt(0).toUpperCase() + f.slice(1)}</Label>
                    {f === "bio" ? (
                      <TextArea
                        as={motion.textarea}
                        whileFocus={{ scale: 1.01 }}
                        name={f}
                        value={formData[f]}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    ) : f === "userType" ? (
                      <Select
                        as={motion.select}
                        whileFocus={{ scale: 1.01 }}
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
                        as={motion.input}
                        whileFocus={{ scale: 1.01 }}
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

            {/* Badges Tab */}
            {activeTab === "badges" && (
              <BadgesSection
                as={motion.div}
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="show"
              >
                {badges.map((b, i) => (
                  <BadgeCard
                    key={b.id}
                    as={motion.div}
                    variants={motionVariants.scaleIn}
                    custom={i}
                    $unlocked={b.unlocked}
                    whileHover={b.unlocked ? { y: -10, scale: 1.05 } : {}}
                  >
                    <BadgeIcon
                      as={motion.div}
                      animate={
                        b.unlocked
                          ? {
                              rotate: [0, 10, -10, 0],
                              transition: { duration: 2, repeat: Infinity },
                            }
                          : {}
                      }
                    >
                      {b.icon}
                    </BadgeIcon>
                    <BadgeName>{b.name}</BadgeName>
                    <BadgeDescription>{b.description}</BadgeDescription>
                  </BadgeCard>
                ))}
              </BadgesSection>
            )}

            {/* Ratings Tab */}
            {activeTab === "ratings" && (
              <RatingsSection
                as={motion.div}
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="show"
              >
                {ratings.map((r, i) => (
                  <RatingCard
                    key={i}
                    as={motion.div}
                    variants={motionVariants.listItemSlideUp}
                    custom={i}
                    whileHover={{ x: 5, scale: 1.01 }}
                  >
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

            {/* Impact Tab */}
            {activeTab === "impact" && stats && (
              <StatsContainer
                as={motion.div}
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  { value: stats.totalListings || 0, label: "Total Donations" },
                  { value: stats.completedListings || 0, label: "Completed" },
                  { value: stats.activeListings || 0, label: "Active" },
                  { value: "⭐ 4.8", label: "Avg Rating" },
                ].map((stat, i) => (
                  <StatCard
                    key={i}
                    as={motion.div}
                    variants={motionVariants.scaleIn}
                    whileHover={{ y: -8, scale: 1.03 }}
                  >
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatCard>
                ))}
              </StatsContainer>
            )}

            {/* Donations/Received Tabs */}
            {(activeTab === "donations" || activeTab === "received") && (
              <HistorySection
                as={motion.div}
                variants={motionVariants.staggerContainer}
                initial="hidden"
                animate="show"
              >
                {history.map((item, i) => (
                  <HistoryItem
                    key={item._id}
                    as={motion.div}
                    variants={motionVariants.listItem}
                    custom={i}
                    whileHover={{ x: 5, backgroundColor: "#f7fafc" }}
                  >
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
                    <ReceiptButton
                      as={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generateReceipt(item)}
                    >
                      📄 Receipt
                    </ReceiptButton>
                  </HistoryItem>
                ))}
              </HistorySection>
            )}
          </TabContent>
        </AnimatePresence>
      </ProfileCard>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <ReceiptModal
            as={motion.div}
            variants={motionVariants.modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setSelectedReceipt(null)}
          >
            <motion.div
              variants={motionVariants.modalContent}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
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
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <ReceiptButton
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => downloadReceipt(selectedReceipt)}
                >
                  💾 Download
                </ReceiptButton>
                <ReceiptButton
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReceipt(null)}
                >
                  Close
                </ReceiptButton>
              </div>
            </motion.div>
          </ReceiptModal>
        )}
      </AnimatePresence>
    </ProfileContainer>
  );
};

export default Profile;
