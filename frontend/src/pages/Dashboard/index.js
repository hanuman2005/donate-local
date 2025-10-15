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
  const [activeTab, setActiveTab] = useState("nearby");
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
          setUserLocation(location);
          fetchNearbyListings(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          fetchNearbyListings();
        }
      );
    } else {
      fetchNearbyListings();
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Change line 49:
      const [userListingsRes, chatsRes] = await Promise.all([
        listingsAPI.getUserListings(),
        chatAPI.getUserChats(), // ✅ Fixed from getChats()
      ]);

      setUserListings(userListingsRes.data.listings || []);
      setChats(chatsRes.data.chats || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyListings = async (location = null) => {
    try {
      let response;
      if (location) {
        response = await listingsAPI.getNearby(location.lat, location.lng, 10); // ✅ ensure getNearby accepts lat, lng, radius
      } else {
        response = await listingsAPI.getAll({ limit: 10 });
      }
      setNearbyListings(response.data.listings || []);
    } catch (error) {
      console.error("Error fetching nearby listings:", error);
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
      (listing) => listing.status === "active"
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
            {" "}
            {/* ✅ changed to $primary */}+ Create Listing
          </ActionButton>
          <ActionButton onClick={handleViewProfile}>View Profile</ActionButton>
        </QuickActions>
      </DashboardHeader>

      <StatsRow>
        <StatCard>
          <StatValue>{stats.activeListings}</StatValue>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalListings}</StatValue>
          <StatLabel>Total Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activeChats}</StatValue>
          <StatLabel>Active Chats</StatLabel>
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
              <SectionTitle>Discover Resources</SectionTitle>
              <TabContainer>
                <Tab
                  $active={activeTab === "nearby"}
                  onClick={() => setActiveTab("nearby")}
                >
                  {" "}
                  {/* ✅ changed to $active */}
                  Map View
                </Tab>
                <Tab
                  $active={activeTab === "list"}
                  onClick={() => setActiveTab("list")}
                >
                  List View
                </Tab>
              </TabContainer>
            </SectionHeader>

            <TabContent>
              {activeTab === "nearby" ? (
                <MapContainer>
                  <Map
                    listings={nearbyListings}
                    userLocation={userLocation}
                    height="500px"
                  />
                </MapContainer>
              ) : (
                <ListingsGrid>
                  {nearbyListings.length > 0 ? (
                    nearbyListings.map((listing) => (
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
                        No listings found in your area
                      </EmptyStateText>
                    </EmptyState>
                  )}
                </ListingsGrid>
              )}
            </TabContent>
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
                    {" "}
                    {/* ✅ changed to $primary */}
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
              <ViewAllButton>View All</ViewAllButton>
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
