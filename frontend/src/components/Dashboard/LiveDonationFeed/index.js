// ============================================
// src/components/LiveDonationFeed/index.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { listingsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { motionVariants } from '../../animations/motionVariants';
import ListingCard from '../ListingCard';

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled(motion.div)`
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

const LiveIndicator = styled(motion.div)`
  width: 12px;
  height: 12px;
  background: #48bb78;
  border-radius: 50%;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
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

const FeedContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const NewItemBanner = styled(motion.div)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveDonationFeed = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    fetchListings();
    
    if (socket) {
      socket.on('newListing', (listing) => {
        setListings(prev => [listing, ...prev]);
        setNewItem(listing);
        toast.info(`New donation: ${listing.title}`, {
          position: 'top-right',
          autoClose: 3000,
        });
        
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
    <Container
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
    >
      <Header
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <Title>
          <LiveIndicator
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Live Donation Feed
        </Title>
        <FilterButtons>
          {categories.map((cat, index) => (
            <FilterButton
              key={cat}
              $active={filter === cat}
              onClick={() => setFilter(cat)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </FilterButton>
          ))}
        </FilterButtons>
      </Header>

      <AnimatePresence>
        {newItem && (
          <NewItemBanner
            variants={motionVariants.fadeSlideDown}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            🎉 New donation just added: {newItem.title}
          </NewItemBanner>
        )}
      </AnimatePresence>

      {loading ? (
        <motion.div 
          style={{ textAlign: 'center', padding: '3rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading donations...
        </motion.div>
      ) : (
        <FeedContainer
          variants={motionVariants.staggerContainer}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListingCard 
                  listing={listing}
                  showQuickClaim={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </FeedContainer>
      )}

      {filteredListings.length === 0 && !loading && (
        <motion.div 
          style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
        >
          No donations available in this category
        </motion.div>
      )}
    </Container>
  );
};

export default LiveDonationFeed;