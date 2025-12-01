// src/components/CheckIn/index.jsx - CLEANED UP
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // ← Removed unused useLocation
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import QrScanner from "react-qr-scanner";
import { motionVariants } from "../../animations/motionVariants";
import api from "../../services/api";
import { toast } from "react-toastify";

// ============================================
// STYLED COMPONENTS (Only Used Ones)
// ============================================

const CheckInContainer = styled(motion.div)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background: #48bb78;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 1rem;
`;

const CheckInHistory = styled(motion.div)`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
`;

const HistoryItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

// ============================================
// COMPONENT
// ============================================

const CheckIn = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleQrScan = async (result, error) => {
    if (result?.text) {
      try {
        // Parse QR data safely
        let data;
        try {
          data = JSON.parse(result.text);
        } catch {
          data = { listingId: result.text };
        }

        if (!data.listingId) {
          toast.error("Invalid QR code format");
          return;
        }

        setScanning(false);
        setLoading(true);

        const response = await api.post(
          `/listings/${data.listingId}/check-in`,
          { qrData: data }
        );

        setSuccess({
          title: response.data.listing.title,
          time: new Date(),
          id: data.listingId,
        });

        setCheckInHistory((prev) => [
          {
            id: data.listingId,
            title: response.data.listing.title,
            time: new Date(),
          },
          ...prev.slice(0, 4),
        ]);

        toast.success("✅ Check-in successful!");

        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } catch (err) {
        console.error("QR Scan Error:", err);
        toast.error(err.response?.data?.message || "Check-in failed");
        setScanning(false);
      } finally {
        setLoading(false);
      }
    }

    if (error) {
      console.error("QR camera error:", error);
    }
  };

  return (
    <CheckInContainer
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <Card variants={motionVariants.scaleIn}>
        <Title>📷 QR Code Check-In</Title>

        {!scanning && !success && (
          <>
            <motion.div
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                padding: '1.5rem',
                background: '#f7fafc',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>
                Ready to Verify Pickup?
              </h3>
              <p style={{ color: '#718096', marginBottom: 0 }}>
                Ask the donor to show their QR code, then tap the button below to scan.
              </p>
            </motion.div>

            <Button
              onClick={() => setScanning(true)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              📷 Start Camera
            </Button>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#92400e'
              }}
            >
              <strong>💡 Tip:</strong> The donor will generate a QR code from their listing. 
              Just scan it to complete the pickup instantly!
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {scanning && !success && (
            <motion.div
              key="scanner"
              variants={motionVariants.fadeSlide}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <QrScanner
                delay={300}
                onError={(err) => console.error("QR scan error:", err)}
                onScan={handleQrScan}
                style={{ 
                  width: "100%", 
                  borderRadius: "12px",
                  maxHeight: '400px'
                }}
                constraints={{
                  video: { facingMode: "environment" }
                }}
              />
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#718096",
                  fontSize: "0.9rem",
                }}
              >
                {loading ? "⏳ Verifying..." : "📸 Point camera at QR code"}
              </p>

              {!loading && (
                <Button
                  onClick={() => setScanning(false)}
                  style={{ background: '#e53e3e', marginTop: '1rem' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ❌ Cancel
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <SuccessMessage
              variants={motionVariants.scalePop}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "700" }}>
                Pickup Verified!
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  opacity: 0.95,
                  marginTop: "0.75rem",
                  fontWeight: '500'
                }}
              >
                {success.title}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  marginTop: "1rem"
                }}
              >
                Transaction completed successfully!
              </div>

              <Button
                onClick={() => {
                  setSuccess(null);
                  navigate('/dashboard');
                }}
                style={{ 
                  marginTop: '1.5rem',
                  background: 'white',
                  color: '#48bb78',
                  border: '2px solid white'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 Go to Dashboard
              </Button>
            </SuccessMessage>
          )}
        </AnimatePresence>
      </Card>

      {checkInHistory.length > 0 && !success && (
        <CheckInHistory
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
        >
          <h3 style={{ color: "#2d3748", marginBottom: "1rem" }}>
            ✅ Recent Check-ins
          </h3>
          <AnimatePresence>
            {checkInHistory.map((item, index) => (
              <HistoryItem
                key={item.id + index}
                variants={motionVariants.listItemSlideUp}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ delay: index * 0.05 }}
              >
                <div>
                  <div style={{ fontWeight: "600", color: "#2d3748" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                    ID: {item.id.slice(-8)}
                  </div>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#48bb78", fontWeight: '600' }}>
                  ✓ Verified
                </div>
              </HistoryItem>
            ))}
          </AnimatePresence>
        </CheckInHistory>
      )}
    </CheckInContainer>
  );
};

export default CheckIn;