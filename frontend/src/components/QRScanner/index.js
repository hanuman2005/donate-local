import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import styled from 'styled-components';
import api from '../../services/api';

const ScannerContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

const ScanOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 3px solid #f093fb;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: ${props => props.disabled ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  text-align: center;
  background: ${props => props.type === 'error' ? '#fed7d7' : props.type === 'success' ? '#c6f6d5' : '#bee3f8'};
  color: ${props => props.type === 'error' ? '#c53030' : props.type === 'success' ? '#2f855a' : '#2c5282'};
`;

const VerificationCard = styled.div`
  background: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 2px solid #e2e8f0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #4a5568;
`;

const Value = styled.span`
  color: #2d3748;
`;

const QRScanner = ({ onScanComplete }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [confirming, setConfirming] = useState(false);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setMessage({ text: 'Initializing camera...', type: 'info' });
      setScanning(true);

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error('No camera found');
      }

      // Use back camera on mobile, any camera on desktop
      const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;

      setMessage({ text: 'Point camera at QR code...', type: 'info' });

      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScan(result.getText());
          }
          // Ignore errors during scanning (they're normal)
        }
      );

    } catch (error) {
      console.error('Camera error:', error);
      setMessage({ 
        text: error.message === 'No camera found' 
          ? 'No camera found. Please check permissions.' 
          : 'Camera access denied. Please allow camera access.',
        type: 'error' 
      });
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setScanning(false);
    setMessage({ text: '', type: '' });
  };

  const handleScan = async (data) => {
    if (!data || scannedData) return;

    try {
      stopScanning();
      setMessage({ text: 'QR Code detected! Verifying...', type: 'info' });

      const qrData = JSON.parse(data);
      
      if (!qrData.listingId || !qrData.timestamp) {
        throw new Error('Invalid QR code format');
      }

      // Verify listing exists
      const response = await api.get(`/listings/${qrData.listingId}`);
      const listing = response.data;

      setScannedData({
        ...qrData,
        listing
      });
      setMessage({ text: 'QR Code verified! Please confirm pickup.', type: 'success' });

    } catch (error) {
      console.error('Scan error:', error);
      setMessage({ 
        text: error.message === 'Invalid QR code format' 
          ? 'Invalid QR code. Please scan a valid pickup code.'
          : 'Failed to verify QR code. Please try again.',
        type: 'error' 
      });
      setScannedData(null);
    }
  };

  const confirmPickup = async () => {
    if (!scannedData) return;

    setConfirming(true);
    try {
      await api.post(`/listings/${scannedData.listingId}/complete`);
      
      setMessage({ text: 'Pickup confirmed successfully! 🎉', type: 'success' });
      
      if (onScanComplete) {
        onScanComplete(scannedData);
      }

      setTimeout(() => {
        setScannedData(null);
        setMessage({ text: '', type: '' });
      }, 2000);

    } catch (error) {
      console.error('Confirmation error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to confirm pickup',
        type: 'error' 
      });
    } finally {
      setConfirming(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setMessage({ text: '', type: '' });
  };

  return (
    <ScannerContainer>
      {!scanning && !scannedData && (
        <Button onClick={startScanning}>
          📷 Start Scanning
        </Button>
      )}

      {scanning && (
        <>
          <VideoContainer>
            <Video ref={videoRef} autoPlay playsInline />
            <ScanOverlay />
          </VideoContainer>
          <Button onClick={stopScanning}>
            ⏹️ Stop Scanning
          </Button>
        </>
      )}

      {scannedData && (
        <VerificationCard>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>
            ✅ Verify Pickup Details
          </h3>
          
          <DetailRow>
            <Label>Listing:</Label>
            <Value>{scannedData.listing?.title}</Value>
          </DetailRow>
          
          <DetailRow>
            <Label>Quantity:</Label>
            <Value>{scannedData.listing?.quantity}</Value>
          </DetailRow>
          
          <DetailRow>
            <Label>Location:</Label>
            <Value>{scannedData.listing?.pickupLocation}</Value>
          </DetailRow>
          
          <DetailRow>
            <Label>Donor:</Label>
            <Value>{scannedData.listing?.donor?.name || 'Anonymous'}</Value>
          </DetailRow>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={confirmPickup} disabled={confirming}>
              {confirming ? '⏳ Confirming...' : '✅ Confirm Pickup'}
            </Button>
            <Button onClick={resetScanner} disabled={confirming}>
              ❌ Cancel
            </Button>
          </div>
        </VerificationCard>
      )}

      {message.text && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
    </ScannerContainer>
  );
};

export default QRScanner;