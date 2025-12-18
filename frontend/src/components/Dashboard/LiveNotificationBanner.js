// src/components/LiveNotificationBanner/index.jsx - OPTIONAL
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import styled, { keyframes } from "styled-components";

const slideDown = keyframes`
  from { transform: translate(-50%, -120%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const Banner = styled.div`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  animation: ${slideDown} 0.4s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  max-width: 500px;
  width: 90%;
  &:hover {
    transform: translateX(-50%) scale(1.02);
  }
`;

const Icon = styled.div`
  font-size: 2.5rem;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
`;

const Message = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const LiveNotificationBanner = () => {
  const [alert, setAlert] = useState(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleAlert = (data) => {
      setAlert(data);
      setTimeout(() => setAlert(null), 10000);
    };

    socket.on("newListingAlert", handleAlert);
    return () => socket.off("newListingAlert", handleAlert);
  }, [socket]);

  if (!alert) return null;

  return (
    <Banner
      onClick={() => {
        navigate(`/listings/${alert.listing._id}`);
        setAlert(null);
      }}
    >
      <Icon>🎁</Icon>
      <Content>
        <Title>New Donation Available!</Title>
        <Message>
          {alert.donor.name} donated {alert.listing.title}
        </Message>
      </Content>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation();
          setAlert(null);
        }}
      >
        ×
      </CloseButton>
    </Banner>
  );
};

export default LiveNotificationBanner;
