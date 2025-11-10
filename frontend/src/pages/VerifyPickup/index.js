// src/pages/VerifyPickup/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../../components/QRScanner';
import {
  PageContainer,
  Header,
  Title,
  Subtitle,
  ContentWrapper,
  TabsContainer,
  Tab,
  TabContent,
  HistoryList,
  HistoryItem,
  HistoryIcon,
  HistoryDetails,
  HistoryTitle,
  HistoryDate,
  EmptyState
} from './styledComponents';

const VerifyPickup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'history'
  const [recentScans, setRecentScans] = useState([]);

  const handleScanComplete = (data) => {
    // Add to recent scans
    const newScan = {
      id: data.transaction.id,
      listing: data.transaction.listing.title,
      timestamp: new Date(),
      status: 'completed',
      impact: data.impact
    };

    setRecentScans(prev => [newScan, ...prev].slice(0, 10)); // Keep last 10

    // Optional: Navigate to success page or show details
    // navigate(`/transaction/${data.transaction.id}`);
  };

  return (
    <PageContainer>
      <Header>
        <Title>📷 Verify Pickup</Title>
        <Subtitle>
          Scan QR codes to complete transactions and build trust
        </Subtitle>
      </Header>

      <TabsContainer>
        <Tab 
          $active={activeTab === 'scan'}
          onClick={() => setActiveTab('scan')}
        >
          📱 Scan QR Code
        </Tab>
        <Tab 
          $active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        >
          📋 Recent Scans
        </Tab>
      </TabsContainer>

      <ContentWrapper>
        <TabContent $active={activeTab === 'scan'}>
          <QRScanner onScanComplete={handleScanComplete} />
        </TabContent>

        <TabContent $active={activeTab === 'history'}>
          {recentScans.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <h3>No Recent Scans</h3>
              <p>Your verified pickups will appear here</p>
            </EmptyState>
          ) : (
            <HistoryList>
              {recentScans.map((scan, index) => (
                <HistoryItem 
                  key={scan.id || index}
                  onClick={() => navigate(`/transaction/${scan.id}`)}
                >
                  <HistoryIcon>✅</HistoryIcon>
                  <HistoryDetails>
                    <HistoryTitle>{scan.listing}</HistoryTitle>
                    <HistoryDate>
                      {scan.timestamp.toLocaleString()}
                    </HistoryDate>
                    {scan.impact && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '0.85rem', 
                        color: '#38a169' 
                      }}>
                        ♻️ {scan.impact.wastePreventedKg.toFixed(1)}kg waste prevented
                      </div>
                    )}
                  </HistoryDetails>
                </HistoryItem>
              ))}
            </HistoryList>
          )}
        </TabContent>
      </ContentWrapper>
    </PageContainer>
  );
};

export default VerifyPickup;