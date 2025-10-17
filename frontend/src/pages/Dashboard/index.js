import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, chatAPI } from "../../services/api";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import Chat from "../../components/Chat";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
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
} from "./styledComponents";

const Dashboard = () => {
  const [userListings, setUserListings] = useState([]);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list"); // ✅ Changed default to "list"
  const [userLocation, setUserLocation] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('📍 User location:', location);
          setUserLocation(location);
          // Don't refetch - we already have all listings
        },
        (error) => {
          console.error("⚠️ Error getting location:", error);
        }
      );
    } else {
      console.warn("⚠️ Geolocation not supported");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching dashboard data...');
      
      const [userListingsRes, nearbyRes, chatsRes] = await Promise.all([
        listingsAPI.getUserListings(),
        listingsAPI.getAll({ limit: 20, status: 'available' }), // ✅ Get all listings
        chatAPI.getUserChats(),
      ]);

      // ✅ Handle both response formats
      const myListings = userListingsRes.data.listings || userListingsRes.data.data || [];
      const allListings = nearbyRes.data.listings || nearbyRes.data.data || [];
      const myChats = chatsRes.data.chats || chatsRes.data.data || [];
      
      console.log('✅ My listings:', myListings.length);
      console.log('✅ All listings:', allListings.length);
      console.log('✅ My chats:', myChats.length);
      
      setUserListings(myListings);
      setNearbyListings(allListings);
      setChats(myChats);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = () => {
    navigate("/create-listing");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = {
    activeListings: userListings.filter(
      (listing) => listing.status === "available"
    ).length,
    totalListings: userListings.length,
    activeChats: chats.length,
    completedDeals: userListings.filter(
      (listing) => listing.status === "completed"
    ).length,
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <WelcomeSection>
          <WelcomeTitle>Welcome back, {user?.firstName}! 👋</WelcomeTitle>
          <WelcomeSubtitle>
            Here's what's happening in your community today
          </WelcomeSubtitle>
        </WelcomeSection>

        <QuickActions>
          <ActionButton $primary onClick={handleCreateListing}>
            + Create Listing
          </ActionButton>
          <ActionButton onClick={handleViewProfile}>View Profile</ActionButton>
        </QuickActions>
      </DashboardHeader>

      <StatsRow>
        <StatCard>
          <StatValue>{stats.activeListings}</StatValue>
          <StatLabel>My Active Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalListings}</StatValue>
          <StatLabel>My Total Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{nearbyListings.length}</StatValue>
          <StatLabel>Available Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completedDeals}</StatValue>
          <StatLabel>Completed Deals</StatLabel>
        </StatCard>
      </StatsRow>

      <DashboardContent>
        <MainSection>
          <Section>
            <SectionHeader>
              <SectionTitle>Discover Resources ({nearbyListings.length} available)</SectionTitle>
              <TabContainer>
                <Tab
                  $active={activeTab === "list"}
                  onClick={() => setActiveTab("list")}
                >
                  List View
                </Tab>
                <Tab
                  $active={activeTab === "nearby"}
                  onClick={() => setActiveTab("nearby")}
                >
                  Map View
                </Tab>
              </TabContainer>
            </SectionHeader>

            <TabContent>
              {activeTab === "list" ? (
                <ListingsGrid>
                  {nearbyListings.length > 0 ? (
                    nearbyListings.slice(0, 6).map((listing) => (
                      <ListingCard
                        key={listing._id}
                        listing={listing}
                        showDistance={!!userLocation}
                        userLocation={userLocation}
                      />
                    ))
                  ) : (
                    <EmptyState>
                      <EmptyStateIcon>📍</EmptyStateIcon>
                      <EmptyStateText>
                        No listings available at the moment
                      </EmptyStateText>
                    </EmptyState>
                  )}
                </ListingsGrid>
              ) : (
                <MapContainer>
                  <Map
                    listings={nearbyListings}
                    userLocation={userLocation}
                    height="500px"
                  />
                </MapContainer>
              )}
            </TabContent>

            {nearbyListings.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <ViewAllButton onClick={() => navigate('/listings')}>
                  View All {nearbyListings.length} Listings →
                </ViewAllButton>
              </div>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Your Listings</SectionTitle>
              <ViewAllButton onClick={handleCreateListing}>
                + Add New
              </ViewAllButton>
            </SectionHeader>

            <ListingsGrid>
              {userListings.length > 0 ? (
                userListings
                  .slice(0, 4)
                  .map((listing) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                      isOwner={true}
                    />
                  ))
              ) : (
                <EmptyState>
                  <EmptyStateIcon>📦</EmptyStateIcon>
                  <EmptyStateText>
                    You haven't created any listings yet
                  </EmptyStateText>
                  <ActionButton $primary onClick={handleCreateListing}>
                    Create Your First Listing
                  </ActionButton>
                </EmptyState>
              )}
            </ListingsGrid>
          </Section>
        </MainSection>

        <Sidebar>
          <Section>
            <SectionHeader>
              <SectionTitle>Messages</SectionTitle>
              <ViewAllButton onClick={() => navigate('/chat')}>
                View All
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
              <EmptyState>
                <EmptyStateIcon>💬</EmptyStateIcon>
                <EmptyStateText>No conversations yet</EmptyStateText>
              </EmptyState>
            )}
          </Section>
        </Sidebar>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;