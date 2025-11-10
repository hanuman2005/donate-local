// src/components/QRCode/QRGenerator.jsx
import React, { useState, useEffect } from 'react';
import { qrAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  QRContainer,
  QRWrapper,
  QRImage,
  Title,
  Description,
  Button,
  InfoCard,
  InfoRow,
  Label,
  Value,
  LoadingSpinner,
  Actions,
  StatusBadge,
  ExpiryTimer
} from './styledComponents';

const QRGenerator = ({ listingId, recipientId, recipientName, listingTitle }) => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (listingId && recipientId) {
      generateQR();
    }
  }, [listingId, recipientId]);

  // Countdown timer
  useEffect(() => {
    if (qrData?.transaction?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(qrData.transaction.expiresAt).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft('Expired');
          clearInterval(interval);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [qrData]);

  const generateQR = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await qrAPI.generateQR(listingId, recipientId);

      if (response.data.success) {
        setQrData(response.data);
        toast.success('QR Code generated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to generate QR code';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await qrAPI.downloadQR(qrData.transaction.id);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${qrData.transaction.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('QR Code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrData?.qrCodeImage) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrData.qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });

        await navigator.share({
          title: 'Pickup QR Code',
          text: `QR Code for: ${listingTitle}`,
          files: [file]
        });

        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: copy to clipboard
      toast.info('Share not supported. QR code copied to clipboard!');
    }
  };

  const handleRefresh = () => {
    generateQR();
  };

  if (loading) {
    return (
      <QRContainer>
        <LoadingSpinner />
        <Description>Generating your secure QR code...</Description>
      </QRContainer>
    );
  }

  if (error) {
    return (
      <QRContainer>
        <StatusBadge $status="error">❌ Error</StatusBadge>
        <Description>{error}</Description>
        <Button onClick={handleRefresh} $primary>
          🔄 Try Again
        </Button>
      </QRContainer>
    );
  }

  if (!qrData) {
    return (
      <QRContainer>
        <Description>Ready to generate QR code</Description>
        <Button onClick={generateQR} $primary>
          Generate QR Code
        </Button>
      </QRContainer>
    );
  }

  return (
    <QRContainer>
      <Title>✅ QR Code Generated!</Title>
      
      <QRWrapper>
        <QRImage 
          src={qrData.qrCodeImage} 
          alt="Pickup QR Code" 
        />
      </QRWrapper>

      <InfoCard>
        <InfoRow>
          <Label>📦 Item:</Label>
          <Value>{listingTitle}</Value>
        </InfoRow>
        
        <InfoRow>
          <Label>👤 Recipient:</Label>
          <Value>{recipientName}</Value>
        </InfoRow>

        <InfoRow>
          <Label>⏰ Expires in:</Label>
          <ExpiryTimer $expired={timeLeft === 'Expired'}>
            {timeLeft || 'Calculating...'}
          </ExpiryTimer>
        </InfoRow>

        <InfoRow>
          <Label>📍 Status:</Label>
          <StatusBadge $status={qrData.transaction.status}>
            {qrData.transaction.status.toUpperCase()}
          </StatusBadge>
        </InfoRow>
      </InfoCard>

      <Description>
        📱 <strong>Instructions:</strong><br/>
        1. Show this QR code to the recipient<br/>
        2. They scan it with their camera<br/>
        3. Transaction completes automatically!
      </Description>

      <Actions>
        <Button onClick={handleDownload} $secondary>
          💾 Download
        </Button>
        <Button onClick={handleShare} $secondary>
          📤 Share
        </Button>
        <Button onClick={handleRefresh} $primary>
          🔄 Regenerate
        </Button>
      </Actions>
    </QRContainer>
  );
};

export default QRGenerator;