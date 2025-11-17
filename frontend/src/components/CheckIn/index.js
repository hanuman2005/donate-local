// ============================================
// src/components/CheckIn/index.jsx - WITH MOTION
// ============================================
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import QrScanner from "react-qr-scanner";
import { motionVariants } from "../../animations/motionVariants";
import api from "../../services/api";
import { toast } from "react-toastify";

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

const ModeToggle = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModeButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#f7fafc"};
  color: ${(props) => (props.$active ? "white" : "#4a5568")};
  border: 2px solid ${(props) => (props.$active ? "#667eea" : "#e2e8f0")};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
`;

const InputGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
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

const CheckIn = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const location = useLocation();
  const [mode, setMode] = useState("manual");
  const [listingId, setListingId] = useState(location.state?.listingId || "");
  const handleManualCheckIn = async (e) => {
    e.preventDefault();

    if (!listingId.trim()) {
      toast.error("Please enter a listing ID");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/listings/${listingId}/check-in`);

      setSuccess({
        title: response.data.listing.title,
        time: new Date(),
        id: listingId,
      });

      setCheckInHistory((prev) => [
        { id: listingId, title: response.data.listing.title, time: new Date() },
        ...prev.slice(0, 4),
      ]);

      toast.success("Check-in successful!");
      setListingId("");

      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = async (result, error) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text);
        setListingId(data.listingId);

        const response = await api.post(
          `/listings/${data.listingId}/check-in`,
          {
            qrData: data,
          }
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

        toast.success("QR Check-in successful!");

        setTimeout(() => {
          setMode("manual");
          setSuccess(null);
        }, 3000);
      } catch (err) {
        toast.error("Invalid QR code or check-in failed");
      }
    }

    if (error) {
      console.error("QR scan error:", error);
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
        <Title>📍 Quick Check-In</Title>

        <ModeToggle>
          <ModeButton
            $active={mode === "manual"}
            onClick={() => setMode("manual")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ⌨️ Manual Entry
          </ModeButton>
          <ModeButton
            $active={mode === "qr"}
            onClick={() => setMode("qr")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📷 Scan QR Code
          </ModeButton>
        </ModeToggle>

        <AnimatePresence mode="wait">
          {mode === "manual" ? (
            <motion.form
              key="manual"
              onSubmit={handleManualCheckIn}
              variants={motionVariants.fadeSlide}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <InputGroup>
                <Label>Listing ID</Label>
                <Input
                  type="text"
                  placeholder="Enter listing ID or code"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  autoFocus
                />
              </InputGroup>

              <Button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Checking In..." : "✅ Check In"}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="qr"
              variants={motionVariants.fadeSlide}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <QrScanner
                delay={300}
                onError={(err) => console.error("QR scan error:", err)}
                onScan={(text) => text && handleQrScan(text)}
                style={{ width: "100%", borderRadius: "12px" }}
              />
              <p
                style={{
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "#718096",
                  fontSize: "0.9rem",
                }}
              >
                Point your camera at the QR code
              </p>
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
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Check-in Successful!
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.9,
                  marginTop: "0.5rem",
                }}
              >
                {success.title}
              </div>
            </SuccessMessage>
          )}
        </AnimatePresence>
      </Card>

      {checkInHistory.length > 0 && (
        <CheckInHistory
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
        >
          <h3 style={{ color: "#2d3748", marginBottom: "1rem" }}>
            Recent Check-ins
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
                <div style={{ fontSize: "0.85rem", color: "#718096" }}>
                  {Math.floor((new Date() - item.time) / 1000)}s ago
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
