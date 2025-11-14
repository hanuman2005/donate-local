// src/pages/Dashboard/index.jsx - UPDATED WITH NEW COMPONENTS
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, chatAPI } from "../../services/api";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import Chat from "../../components/Chat";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
// ✅ Import new components
import DonationCenterInfo from "../../components/DonationCenterInfo";
import LiveDonationFeed from "../../components/LiveDonationFeed";
import LiveStats from "../../components/LiveStats";

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
  const [userLocation, setUserLocation] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showLiveFeed, setShowLiveFeed] = useState(false); // ✅ Toggle for live feed

  const { user } = useAuth();
  const navigate = useNavigate();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
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

      const uniqueChats = [];
      const seenParticipants = new Set();

      myChats.forEach((chat) => {
        const otherUser = chat.participants?.find((p) => p._id !== user?._id);
        if (otherUser && !seenParticipants.has(otherUser._id)) {
          seenParticipants.add(otherUser._id);
          uniqueChats.push(chat);
        }
      });

      setMyListings(myItems);

      const othersListings = allItems.filter(
        (listing) =>
          listing.donor?._id !== user?._id && listing.donor !== user?._id
      );
      setAvailableListings(othersListings);

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

  const handleCreateListing = () => {
    navigate("/create-listing");
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading your dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  const isDonor = user?.userType === "donor" || user?.userType === "both";
  const isRecipient = user?.userType === "recipient";

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
    <DashboardContainer>
      {/* Header */}
      <DashboardHeader>
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

        <QuickActions>
          {isDonor && (
            <ActionButton $primary onClick={handleCreateListing}>
              ➕ Share Item
            </ActionButton>
          )}
          <ActionButton onClick={() => navigate("/listings")}>
            🔍 Browse All
          </ActionButton>
          <ActionButton onClick={() => setShowLiveFeed(!showLiveFeed)}>
            {showLiveFeed ? "📋 List View" : "⚡ Live Feed"}
          </ActionButton>
        </QuickActions>
      </DashboardHeader>

      {/* ✅ Live Stats Component */}
      <LiveStats />

      {/* Stats Cards */}
      <StatsRow>
        {isDonor ? (
          <>
            <StatCard $variant="purple">
              <StatValue>{stats.myActive}</StatValue>
              <StatLabel>📦 Active Donations</StatLabel>
            </StatCard>

            <StatCard $variant="pink">
              <StatValue>{stats.myPending}</StatValue>
              <StatLabel>⏳ Pending Pickups</StatLabel>
            </StatCard>

            <StatCard $variant="blue">
              <StatValue>{stats.myCompleted}</StatValue>
              <StatLabel>✅ Completed</StatLabel>
            </StatCard>

            <StatCard $variant="green">
              <StatValue>{chats.length}</StatValue>
              <StatLabel>💬 Active Chats</StatLabel>
            </StatCard>
          </>
        ) : (
          <>
            <StatCard $variant="orange">
              <StatValue>{stats.availableNearby}</StatValue>
              <StatLabel>📦 Available Near You</StatLabel>
            </StatCard>

            <StatCard $variant="purple">
              <StatValue>{stats.myRequests}</StatValue>
              <StatLabel>📝 My Requests</StatLabel>
            </StatCard>

            <StatCard $variant="blue">
              <StatValue>{stats.myCompleted}</StatValue>
              <StatLabel>✅ Items Received</StatLabel>
            </StatCard>

            <StatCard $variant="green">
              <StatValue>{chats.length}</StatValue>
              <StatLabel>💬 Conversations</StatLabel>
            </StatCard>
          </>
        )}
      </StatsRow>

      <DashboardContent>
        <MainSection>
          {/* ✅ Live Donation Feed or Regular View */}
          {showLiveFeed ? (
            <Section>
              <SectionHeader>
                <GradientText $variant="green">
                  ⚡ Live Donation Feed
                </GradientText>
                <ActionButton onClick={() => setShowLiveFeed(false)}>
                  📋 Switch to List View
                </ActionButton>
              </SectionHeader>
              <LiveDonationFeed />
            </Section>
          ) : (
            <>
              {/* Donor's Listings Section */}
              {isDonor && (
                <Section>
                  <SectionHeader>
                    <GradientText $variant="purple">
                      📦 Your Donations
                    </GradientText>
                    <TabContainer>
                      <Tab
                        $active={activeTab === "active"}
                        onClick={() => setActiveTab("active")}
                      >
                        Active ({stats.myActive})
                      </Tab>
                      <Tab
                        $active={activeTab === "pending"}
                        onClick={() => setActiveTab("pending")}
                      >
                        Pending ({stats.myPending})
                      </Tab>
                      <Tab
                        $active={activeTab === "completed"}
                        onClick={() => setActiveTab("completed")}
                      >
                        Completed ({stats.myCompleted})
                      </Tab>
                    </TabContainer>
                  </SectionHeader>

                  <TabContent>
                    {myListings.filter((listing) => {
                      if (activeTab === "active")
                        return listing.status === "available";
                      if (activeTab === "pending")
                        return listing.status === "pending";
                      if (activeTab === "completed")
                        return listing.status === "completed";
                      return true;
                    }).length > 0 ? (
                      <ListingsGrid>
                        {myListings
                          .filter((listing) => {
                            if (activeTab === "active")
                              return listing.status === "available";
                            if (activeTab === "pending")
                              return listing.status === "pending";
                            if (activeTab === "completed")
                              return listing.status === "completed";
                            return true;
                          })
                          .slice(0, 6)
                          .map((listing) => (
                            <ListingCard
                              key={listing._id}
                              listing={listing}
                              isOwner={true}
                            />
                          ))}
                      </ListingsGrid>
                    ) : (
                      <EmptyState>
                        <EmptyStateIcon>📦</EmptyStateIcon>
                        <EmptyStateText $large>
                          No {activeTab} donations yet
                        </EmptyStateText>
                        <EmptyStateText>
                          {activeTab === "active" &&
                            "Share items to help your community"}
                          {activeTab === "pending" &&
                            "No pending pickups at the moment"}
                          {activeTab === "completed" &&
                            "Complete donations will appear here"}
                        </EmptyStateText>
                        {activeTab === "active" && (
                          <ActionButton $primary onClick={handleCreateListing}>
                            ➕ Share Your First Item
                          </ActionButton>
                        )}
                      </EmptyState>
                    )}
                  </TabContent>
                </Section>
              )}

              {/* Available Items Section */}
              <Section>
                <SectionHeader>
                  <GradientText $variant="green">
                    {isDonor ? "🌍 Community Items" : "📦 Available Near You"}
                  </GradientText>
                  <TabContainer>
                    <Tab
                      $active={activeTab === "available"}
                      onClick={() => setActiveTab("available")}
                    >
                      📋 List
                    </Tab>
                    <Tab
                      $active={activeTab === "map"}
                      onClick={() => setActiveTab("map")}
                    >
                      🗺️ Map
                    </Tab>
                  </TabContainer>
                </SectionHeader>

                <TabContent>
                  {activeTab === "map" ? (
                    <MapContainer>
                      <Map
                        listings={availableListings}
                        userLocation={userLocation}
                        height="500px"
                      />
                    </MapContainer>
                  ) : availableListings.length > 0 ? (
                    <ListingsGrid>
                      {availableListings.slice(0, 6).map((listing) => (
                        <ListingCard
                          key={listing._id}
                          listing={listing}
                          showQuickClaim={true}
                          showDistance={!!userLocation}
                          userLocation={userLocation}
                        />
                      ))}
                    </ListingsGrid>
                  ) : (
                    <EmptyState>
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

                {availableListings.length > 6 && (
                  <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <ViewAllButton onClick={() => navigate("/listings")}>
                      View All {availableListings.length} Listings →
                    </ViewAllButton>
                  </div>
                )}
              </Section>

              {/* My Requests Section */}
              {interestedListings.length > 0 && (
                <Section>
                  <SectionHeader>
                    <GradientText $variant="pink">📝 My Requests</GradientText>
                  </SectionHeader>
                  <ListingsGrid>
                    {interestedListings.map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        showDistance={!!userLocation}
                        userLocation={userLocation}
                      />
                    ))}
                  </ListingsGrid>
                </Section>
              )}
            </>
          )}
        </MainSection>

        <Sidebar>
          {/* ✅ Donation Center Info */}
          <DonationCenterInfo />

          {/* Messages Section */}
          <Section>
            <SectionHeader>
              <GradientText $variant="purple">
                💬 Messages ({chats.length})
              </GradientText>
              <ViewAllButton onClick={() => navigate("/chat")}>
                View All →
              </ViewAllButton>
            </SectionHeader>

            {chats.length > 0 ? (
              <Chat
                chats={chats}
                selectedChat={selectedChat}
                onChatSelect={handleChatSelect}
                compact={true}
              />
            ) : (
              <EmptyState $compact>
                <EmptyStateIcon>💬</EmptyStateIcon>
                <EmptyStateText>No messages yet</EmptyStateText>
                <EmptyStateText $small>
                  Start conversations with donors
                </EmptyStateText>
              </EmptyState>
            )}
          </Section>

          {/* Impact Card */}
          <Section $impact>
            <SectionTitle>🌟 Your Impact</SectionTitle>
            <div>
              {isDonor ? (
                <>
                  <ImpactStat>
                    <ImpactIcon>✨</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted}</ImpactValue> donations
                      completed
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat>
                    <ImpactIcon>🌱</ImpactIcon>
                    <ImpactText>
                      Approx.{" "}
                      <ImpactValue>{stats.myCompleted * 2}kg</ImpactValue> waste
                      prevented
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat>
                    <ImpactIcon>💚</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted * 3}</ImpactValue> items
                      shared
                    </ImpactText>
                  </ImpactStat>
                </>
              ) : (
                <>
                  <ImpactStat>
                    <ImpactIcon>🙏</ImpactIcon>
                    <ImpactText>
                      <ImpactValue>{stats.myCompleted}</ImpactValue> items
                      received
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat>
                    <ImpactIcon>🌍</ImpactIcon>
                    <ImpactText>
                      Part of <ImpactValue>850+</ImpactValue> member community
                    </ImpactText>
                  </ImpactStat>
                  <ImpactStat>
                    <ImpactIcon>💪</ImpactIcon>
                    <ImpactText>
                      Together we've saved <ImpactValue>1,200+ lbs</ImpactValue>
                    </ImpactText>
                  </ImpactStat>
                </>
              )}
            </div>
          </Section>
        </Sidebar>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
