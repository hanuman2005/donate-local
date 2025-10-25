// src/components/QRCode/index.jsx

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-toastify';

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

const QRWrapper = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  color: var(--text-primary);
  font-size: 1.25rem;
  margin: 0;
`;

const Description = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
  max-width: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
    }
  ` : `
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    
    &:hover {
      border-color: #f093fb;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoBox = styled.div`
  background: ${props => props.$type === 'success' ? '#d1fae5' : '#fef3c7'};
  color: ${props => props.$type === 'success' ? '#065f46' : '#92400e'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
  max-width: 300px;
  margin-top: 0.5rem;
`;

const QRCodeGenerator = ({ listing, onPickupComplete }) => {
  const qrRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // Generate pickup data
  const pickupData = {
    listingId: listing._id,
    donorId: listing.donor._id,
    title: listing.title,
    quantity: `${listing.quantity} ${listing.unit}`,
    pickupLocation: listing.pickupLocation,
    expiryDate: listing.expiryDate,
    timestamp: new Date().toISOString(),
  };

  const qrValue = JSON.stringify(pickupData);

  // Download QR Code
  const handleDownload = () => {
    setDownloading(true);
    try {
      const canvas = qrRef.current.querySelector('canvas');
      if (!canvas) {
        throw new Error('QR Code canvas not found');
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR-${listing.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('QR Code downloaded successfully!');
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR Code');
    } finally {
      setDownloading(false);
    }
  };

  // Share QR Code
  const handleShare = async () => {
    try {
      const canvas = qrRef.current.querySelector('canvas');
      if (!canvas) {
        throw new Error('QR Code canvas not found');
      }

      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'pickup-qr-code.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Pickup QR Code - ${listing.title}`,
            text: `Scan this QR code to confirm pickup of "${listing.title}"`,
            files: [file]
          });
          toast.success('Shared successfully!');
        } else {
          // Fallback: Copy to clipboard (if supported)
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            toast.success('QR Code copied to clipboard!');
          } catch (err) {
            toast.info('Sharing not supported. Please download instead.');
          }
        }
      });
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share QR Code');
    }
  };

  // Copy pickup details
  const handleCopyDetails = () => {
    const details = `
Pickup Details:
📦 Item: ${listing.title}
📊 Quantity: ${listing.quantity} ${listing.unit}
📍 Location: ${listing.pickupLocation}
📅 Valid until: ${new Date(listing.expiryDate).toLocaleDateString()}

Show this QR code when picking up the item!
    `.trim();

    navigator.clipboard.writeText(details).then(() => {
      toast.success('Pickup details copied!');
    }).catch(() => {
      toast.error('Failed to copy details');
    });
  };

  return (
    <QRContainer>
      <Title>📱 Pickup QR Code</Title>
      <Description>
        Share this QR code with the recipient. They scan it during pickup to confirm the transaction.
      </Description>

      <QRWrapper ref={qrRef}>
        <QRCodeCanvas
          value={qrValue}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='50' font-size='80' text-anchor='middle' x='50'%3E🍎%3C/text%3E%3C/svg%3E",
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </QRWrapper>

      <ButtonGroup>
        <Button $primary onClick={handleDownload} disabled={downloading}>
          {downloading ? '⏳' : '📥'} Download
        </Button>
        <Button onClick={handleShare}>
          📤 Share
        </Button>
        <Button onClick={handleCopyDetails}>
          📋 Copy Details
        </Button>
      </ButtonGroup>

      <InfoBox $type="warning">
        💡 Tip: Keep this QR code ready for quick verification during pickup
      </InfoBox>
    </QRContainer>
  );
};

export default QRCodeGenerator;