// src/pages/Dashboard/index.jsx - FULLY OPTIMIZED & FIXED
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, chatAPI } from "../../services/api";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import Chat from "../../components/Chat";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import DonationCenterInfo from "../../components/DonationCenterInfo";
import LiveDonationFeed from "../../components/LiveDonationFeed";
import LiveStats from "../../components/LiveStats";
import {
  motionVariants,
  useScrollAnimation,
} from "../../animations/motionVariants";
import {
  DashboardContainer,
  DashboardHeader,
  WelcomeSection,
  WelcomeTitle,
  WelcomeSubtitle,
  QuickActions,
  ActionButton,
  DashboardContent,
  MainSection,
  Sidebar,
  Section,
  SectionHeader,
  SectionTitle,
  ViewAllButton,
  ListingsGrid,
  MapContainer,
  TabContainer,
  Tab,
  TabContent,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  LoadingContainer,
  LoadingText,
  GradientText,
  ImpactStat,
  ImpactIcon,
  ImpactText,
  ImpactValue,
} from "./styledComponents";

const Dashboard = () => {
  const [myListings, setMyListings] = useState([]);
  const [availableListings, setAvailableListings] = useState([]);
  const [interestedListings, setInterestedListings] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [myListingsTab, setMyListingsTab] = useState("active"); // ✅ Separate tab for my listings
  const [userLocation, setUserLocation] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showLiveFeed, setShowLiveFeed] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollAnimation = useScrollAnimation();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  };

  // ✅ Deduplicate chats helper
  const deduplicateChats = (chats) => {
    const seen = new Set();
    return chats.filter((chat) => {
      if (seen.has(chat._id)) {
        return false;
      }
      seen.add(chat._id);
      return true;
    });
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [myListingsRes, allListingsRes, chatsRes] = await Promise.all([
        listingsAPI.getUserListings(),
        listingsAPI.getAll({ limit: 50, status: "available" }),
        chatAPI.getUserChats(),
      ]);

      const myItems =
        myListingsRes.data.listings || myListingsRes.data.data || [];
      const allItems =
        allListingsRes.data.listings || allListingsRes.data.data || [];
      const myChats = chatsRes.data.chats || chatsRes.data.data || [];

      // ✅ Deduplicate chats
      const uniqueChats = deduplicateChats(myChats);

      setMyListings(myItems);

      // ✅ Filter out own listings from available
      const othersListings = allItems.filter(
        (listing) =>
          listing.donor?._id !== user?._id && listing.donor !== user?._id
      );
      setAvailableListings(othersListings);

      // ✅ Get listings assigned to current user
      const interested = allItems.filter(
        (listing) =>
          listing.assignedTo?._id === user?._id ||
          listing.assignedTo === user?._id
      );
      setInterestedListings(interested);

      setChats(uniqueChats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
  }, [fetchDashboardData]);

  const handleCreateListing = () => navigate("/create-listing");
  const handleChatSelect = (chat) => setSelectedChat(chat);

  if (loading) {
    return (
      <LoadingContainer
        as={motion.div}
        variants={motionVariants.fadeSlide}
        initial="hidden"
        animate="show"
      >
        <LoadingSpinner size="large" />
        <LoadingText>Loading your dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  const isDonor = user?.userType === "donor" || user?.userType === "both";

  // ✅ Calculate stats
  const stats = {
    myActive: myListings.filter((l) => l.status === "available").length,
    myPending: myListings.filter((l) => l.status === "pending").length,
    myCompleted: myListings.filter((l) => l.status === "completed").length,
    availableNearby: availableListings.length,
    myRequests: interestedListings.length,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <DashboardContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* ========== HEADER ========== */}
      <DashboardHeader
        as={motion.header}
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <WelcomeSection>
          <WelcomeTitle>
            {getGreeting()}, {user?.firstName}! 👋
          </WelcomeTitle>
          <WelcomeSubtitle>
            {isDonor
              ? `🌟 You're making a difference! ${stats.myCompleted} donations completed`
              : "🍎 Discover fresh items available in your community"}
          </WelcomeSubtitle>
        </WelcomeSection>

        <QuickActions
          as={motion.div}
          variants={motionVariants.staggerContainerFast}
          initial="hidden"
          animate="show"
        >
          {isDonor && (
            <ActionButton
              as={motion.button}
              variants={motionVariants.listItem}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              $primary
              onClick={handleCreateListing}
            >
              ➕ Share Item
            </ActionButton>
          )}
          <ActionButton
            as={motion.button}
            variants={motionVariants.listItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/listings")}
          >
            🔍 Browse All
          </ActionButton>
          <ActionButton
            as={motion.button}
            variants={motionVariants.listItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLiveFeed(!showLiveFeed)}
          >
            {showLiveFeed ? "📋 List View" : "⚡ Live Feed"}
          </ActionButton>
          <ActionButton
            as={motion.button}
            variants={motionVariants.listItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/check-in")}
          >
            📷 Verify Pickup
          </ActionButton>
        </QuickActions>
      </DashboardHeader>

      {/* ========== LIVE STATS ========== */}
      <motion.div
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        animate="show"
      >
        <LiveStats />
      </motion.div>

      {/* ========== STATS CARDS ========== */}
      <StatsRow
        as={motion.div}
        variants={motionVariants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        {isDonor ? (
          <>
            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              $variant="purple"
            >
              <StatValue>{stats.myActive}</StatValue>
              <StatLabel>📦 Active Donations</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              $variant="pink"
            >
              <StatValue>{stats.myPending}</StatValue>
              <StatLabel>⏳ Pending Pickups</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              $variant="blue"
            >
              <StatValue>{stats.myCompleted}</StatValue>
              <StatLabel>✅ Completed</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              $variant="green"
            >
              <StatValue>{chats.length}</StatValue>
              <StatLabel>💬 Active Chats</StatLabel>
            </StatCard>
          </>
        ) : (
          <>
            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              $variant="orange"
            >
              <StatValue>{stats.availableNearby}</StatValue>
              <StatLabel>📦 Available Near You</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              $variant="purple"
            >
              <StatValue>{stats.myRequests}</StatValue>
              <StatLabel>📝 My Requests</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              $variant="blue"
            >
              <StatValue>{stats.myCompleted}</StatValue>
              <StatLabel>✅ Items Received</StatLabel>
            </StatCard>

            <StatCard
              as={motion.div}
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.02 }}
              $variant="green"
            >
              <StatValue>{chats.length}</StatValue>
              <StatLabel>💬 Conversations</StatLabel>
            </StatCard>
          </>
        )}
      </StatsRow>

      {/* ========== MAIN CONTENT ========== */}
      <DashboardContent>
        <MainSection>
          <AnimatePresence mode="wait">
            {showLiveFeed ? (
              /* ========== LIVE FEED VIEW ========== */
              <Section
                as={motion.section}
                key="live-feed"
                variants={motionVariants.fadeSlide}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <SectionHeader>
                  <GradientText $variant="green">
                    ⚡ Live Donation Feed
                  </GradientText>
                  <ActionButton
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLiveFeed(false)}
                  >
                    📋 List View
                  </ActionButton>
                </SectionHeader>
                <LiveDonationFeed />
              </Section>
            ) : (
              /* ========== LIST VIEW ========== */
              <motion.div
                key="list-view"
                variants={motionVariants.fadeSlide}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* ========== MY DONATIONS (Donors Only) ========== */}
                {isDonor && (
                  <Section
                    as={motion.section}
                    variants={motionVariants.fadeSlideUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <SectionHeader>
                      <GradientText $variant="purple">
                        📦 Your Donations
                      </GradientText>
                      <TabContainer>
                        {["active", "pending", "completed"].map((tab) => (
                          <Tab
                            key={tab}
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            $active={myListingsTab === tab}
                            onClick={() => setMyListingsTab(tab)}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                            {tab === "active"
                              ? stats.myActive
                              : tab === "pending"
                              ? stats.myPending
                              : stats.myCompleted}
                            )
                          </Tab>
                        ))}
                      </TabContainer>
                    </SectionHeader>

                    <AnimatePresence mode="wait">
                      <TabContent
                        as={motion.div}
                        key={myListingsTab}
                        variants={motionVariants.tabContent}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        {myListings.filter((listing) => {
                          if (myListingsTab === "active")
                            return listing.status === "available";
                          if (myListingsTab === "pending")
                            return listing.status === "pending";
                          if (myListingsTab === "completed")
                            return listing.status === "completed";
                          return true;
                        }).length > 0 ? (
                          <ListingsGrid
                            as={motion.div}
                            variants={motionVariants.staggerContainer}
                            initial="hidden"
                            animate="show"
                          >
                            {myListings
                              .filter((listing) => {
                                if (myListingsTab === "active")
                                  return listing.status === "available";
                                if (myListingsTab === "pending")
                                  return listing.status === "pending";
                                if (myListingsTab === "completed")
                                  return listing.status === "completed";
                                return true;
                              })
                              .slice(0, 6)
                              .map((listing, index) => (
                                <motion.div
                                  key={listing._id}
                                  variants={motionVariants.listItemSlideUp}
                                  custom={index}
                                >
                                  <ListingCard
                                    listing={listing}
                                    isOwner={true}
                                  />
                                </motion.div>
                              ))}
                          </ListingsGrid>
                        ) : (
                          <EmptyState
                            as={motion.div}
                            variants={motionVariants.scalePop}
                            initial="hidden"
                            animate="show"
                          >
                            <EmptyStateIcon>📦</EmptyStateIcon>
                            <EmptyStateText $large>
                              No {myListingsTab} donations yet
                            </EmptyStateText>
                            <EmptyStateText>
                              {myListingsTab === "active" &&
                                "Share items to help your community"}
                              {myListingsTab === "pending" &&
                                "No pending pickups at the moment"}
                              {myListingsTab === "completed" &&
                                "Complete donations will appear here"}
                            </EmptyStateText>
                            {myListingsTab === "active" && (
                              <ActionButton
                                as={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                $primary
                                onClick={handleCreateListing}
                                style={{ marginTop: "1rem" }}
                              >
                                ➕ Share Your First Item
                              </ActionButton>
                            )}
                          </EmptyState>
                        )}
                      </TabContent>
                    </AnimatePresence>
                  </Section>
                )}

                {/* ========== AVAILABLE ITEMS ========== */}
                <Section
                  as={motion.section}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <SectionHeader>
                    <GradientText $variant="green">
                      {isDonor ? "🌍 Community Items" : "📦 Available Near You"}
                    </GradientText>
                    <TabContainer>
                      <Tab
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        $active={activeTab === "available"}
                        onClick={() => setActiveTab("available")}
                      >
                        📋 List
                      </Tab>
                      <Tab
                        as={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        $active={activeTab === "map"}
                        onClick={() => setActiveTab("map")}
                      >
                        🗺️ Map
                      </Tab>
                    </TabContainer>
                  </SectionHeader>

                  <AnimatePresence mode="wait">
                    <TabContent
                      as={motion.div}
                      key={activeTab}
                      variants={motionVariants.tabContent}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      {activeTab === "map" ? (
                        <MapContainer>
                          <Map
                            listings={availableListings}
                            userLocation={userLocation}
                            height="500px"
                          />
                        </MapContainer>
                      ) : availableListings.length > 0 ? (
                        <ListingsGrid
                          as={motion.div}
                          variants={motionVariants.staggerContainer}
                          initial="hidden"
                          animate="show"
                        >
                          {availableListings
                            .slice(0, 6)
                            .map((listing, index) => (
                              <motion.div
                                key={listing._id}
                                variants={motionVariants.listItemSlideUp}
                                custom={index}
                              >
                                <ListingCard
                                  listing={listing}
                                  showQuickClaim={true}
                                  showDistance={!!userLocation}
                                  userLocation={userLocation}
                                />
                              </motion.div>
                            ))}
                        </ListingsGrid>
                      ) : (
                        <EmptyState
                          as={motion.div}
                          variants={motionVariants.scalePop}
                        >
                          <EmptyStateIcon>🔍</EmptyStateIcon>
                          <EmptyStateText $large>
                            No items available nearby
                          </EmptyStateText>
                          <EmptyStateText>
                            Check back later or expand your search
                          </EmptyStateText>
                        </EmptyState>
                      )}
                    </TabContent>
                  </AnimatePresence>

                  {availableListings.length > 6 && activeTab === "available" && (
                    <motion.div
                      style={{ textAlign: "center", marginTop: "1.5rem" }}
                      variants={motionVariants.fadeSlideUp}
                      initial="hidden"
                      animate="show"
                    >
                      <ViewAllButton
                        as={motion.button}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/listings")}
                      >
                        View All {availableListings.length} Listings →
                      </ViewAllButton>
                    </motion.div>
                  )}
                </Section>

                {/* ========== MY REQUESTS (Recipients) ========== */}
                {interestedListings.length > 0 && (
                  <Section
                    as={motion.section}
                    variants={motionVariants.fadeSlideUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <SectionHeader>
                      <GradientText $variant="pink">
                        📝 My Requests
                      </GradientText>
                    </SectionHeader>
                    <ListingsGrid
                      as={motion.div}
                      variants={motionVariants.staggerContainer}
                      initial="hidden"
                      animate="show"
                    >
                      {interestedListings.map((listing, index) => (
                        <motion.div
                          key={listing._id}
                          variants={motionVariants.listItemSlideUp}
                          custom={index}
                        >
                          <ListingCard
                            listing={listing}
                            showDistance={!!userLocation}
                            userLocation={userLocation}
                          />
                        </motion.div>
                      ))}
                    </ListingsGrid>
                  </Section>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </MainSection>

        {/* ========== SIDEBAR ========== */}
        <Sidebar
          as={motion.aside}
          variants={motionVariants.fadeSlideLeft}
          initial="hidden"
          animate="show"
        >
          {/* Donation Center Info */}
          <motion.div
            variants={motionVariants.scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <DonationCenterInfo />
          </motion.div>

          {/* Messages */}
          <Section
            as={motion.section}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <SectionHeader>
              <GradientText $variant="purple">
                💬 Messages ({chats.length})
              </GradientText>
              {chats.length > 0 && (
                <ViewAllButton
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/chat")}
                >
                  View All →
                </ViewAllButton>
              )}
            </SectionHeader>

            {chats.length > 0 ? (
              <Chat
                chats={chats}
                selectedChat={selectedChat}
                onChatSelect={handleChatSelect}
                compact={true}
              />
            ) : (
              <EmptyState
                as={motion.div}
                variants={motionVariants.scalePop}
                $compact
              >
                <EmptyStateIcon $small>💬</EmptyStateIcon>
                <EmptyStateText>No messages yet</EmptyStateText>
                <EmptyStateText $small>
                  Start conversations with donors
                </EmptyStateText>
              </EmptyState>
            )}
          </Section>

          {/* Impact Card */}
          <Section
            as={motion.section}
            variants={motionVariants.scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            $impact
          >
            <SectionTitle>🌟 Your Impact</SectionTitle>
            <motion.div
              variants={motionVariants.staggerContainer}
              initial="hidden"
              animate="show"
            >
              {isDonor ? (
                <>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>✨</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted}</ImpactValue> donations
                      completed
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>🌱</ImpactIcon>
                    <ImpactText>
                      Approx.{" "}
                      <ImpactValue>{stats.myCompleted * 2}kg</ImpactValue> waste
                      prevented
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>💚</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted * 3}</ImpactValue> items
                      shared
                    </ImpactText>
                  </ImpactStat>
                </>
              ) : (
                <>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>🙏</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted}</ImpactValue> items
                      received
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>🌍</ImpactIcon>
                    <ImpactText>
                      Part of <ImpactValue>850+</ImpactValue> member community
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat
                    as={motion.div}
                    variants={motionVariants.listItem}
                  >
                    <ImpactIcon>💪</ImpactIcon>
                    <ImpactText>
                      Together we've saved <ImpactValue>1,200+ lbs</ImpactValue>
                    </ImpactText>
                  </ImpactStat>
                </>
              )}
            </motion.div>
          </Section>
        </Sidebar>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;