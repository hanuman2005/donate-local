import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSocket } from '../../context/SocketContext';
import { listingsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import ListingCard from '../ListingCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveIndicator = styled.div`
  width: 12px;
  height: 12px;
  background: #48bb78;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
  }
`;

const FeedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const NewItemBanner = styled.div`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const LiveDonationFeed = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    fetchListings();
    
    // Listen for new listings
    if (socket) {
      socket.on('newListing', (listing) => {
        setListings(prev => [listing, ...prev]);
        setNewItem(listing);
        toast.info(`New donation: ${listing.title}`, {
          position: 'top-right',
          autoClose: 3000,
        });
        
        // Play notification sound (optional)
        // const audio = new Audio('/notification.mp3');
        // audio.play();
        
        // Hide banner after 5 seconds
        setTimeout(() => setNewItem(null), 5000);
      });
    }

    return () => {
      if (socket) {
        socket.off('newListing');
      }
    };
  }, [socket]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll({ 
        status: 'available',
        sort: 'newest',
        limit: 20 
      });
      
      if (response.data.success) {
        setListings(response.data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'produce', 'clothing', 'electronics', 'furniture', 'books', 'toys', 'other'];
  
  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(listing => listing.category === filter);

  return (
    <Container>
      <Header>
        <Title>
          <LiveIndicator />
          Live Donation Feed
        </Title>
        <FilterButtons>
          {categories.map(cat => (
            <FilterButton
              key={cat}
              $active={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </FilterButton>
          ))}
        </FilterButtons>
      </Header>

      {newItem && (
        <NewItemBanner>
          🎉 New donation just added: {newItem.title}
        </NewItemBanner>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading donations...
        </div>
      ) : (
        <FeedContainer>
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing._id} 
              listing={listing}
              showQuickClaim={true}
            />
          ))}
        </FeedContainer>
      )}

      {filteredListings.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          No donations available in this category
        </div>
      )}
    </Container>
  );
};

export default LiveDonationFeed;