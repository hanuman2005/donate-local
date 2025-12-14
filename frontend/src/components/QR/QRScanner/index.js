// src/components/QRScanner/index.js - FIXED
import React, { useEffect, useRef, useState } from "react";
import { readBarcodes, prepareZXingModule, barcodeFormats } from "zxing-wasm";
import { qrAPI } from "../../services/api";
import { toast } from "react-toastify";
import {
  ScannerContainer,
  VideoContainer,
  Video,
  ScanOverlay,
  ScanLine,
  Button,
  Message,
  VerificationCard,
  DetailRow,
  Label,
  Value,
  StatusIcon,
  LoadingDots,
} from "./styledComponents";

const QRScanner = ({ onScanComplete }) => {
  const videoRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setMessage({ text: "Initializing camera...", type: "info" });
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          resolve();
        };
      });

      const zxing = await prepareZXingModule();
      setMessage({ text: "Point your camera at a QR code...", type: "info" });

      // ✅ FIX: Assign interval to ref
      const intervalId = setInterval(async () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;

        if (!width || !height) return;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        let imageData;
        try {
          imageData = ctx.getImageData(0, 0, width, height);
        } catch {
          return;
        }

        if (!imageData || !imageData.data) return;

        const results = await readBarcodes(imageData, {
          tryHarder: true,
          formats: [barcodeFormats.QR_CODE],
        });

        if (results.length > 0) {
          clearInterval(intervalId);
          handleScan(results[0].text);
        }
      }, 600);

      // ✅ FIX: Store interval reference
      scanIntervalRef.current = intervalId;
    } catch (error) {
      console.error("Camera error:", error);
      setMessage({
        text:
          error.message || "Camera access denied. Please allow camera access.",
        type: "error",
      });
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleScan = async (rawData) => {
    if (!rawData || scannedData || verifying) return;

    try {
      stopScanning();
      setVerifying(true);
      setMessage({
        text: "QR Code detected! Verifying with server...",
        type: "info",
      });

      const response = await qrAPI.verifyQR(rawData);

      if (response.data.success) {
        const transaction = response.data.transaction;

        setScannedData({
          listing: transaction.listing,
          donor: transaction.donor,
          recipient: transaction.recipient,
          completedAt: transaction.completedAt,
          impact: transaction.impact,
        });

        setMessage({
          text: "✅ QR Code verified! Pickup completed successfully!",
          type: "success",
        });

        toast.success("🎉 Pickup verified successfully!");

        if (onScanComplete) {
          onScanComplete(response.data);
        }

        setTimeout(() => {
          resetScanner();
        }, 5000);
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Scan error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setMessage({ text: `❌ ${errorMessage}`, type: "error" });
      toast.error(errorMessage);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } finally {
      setVerifying(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setMessage({ text: "", type: "" });
    setVerifying(false);
  };

  return (
    <ScannerContainer>
      {!scanning && !scannedData && (
        <>
          <Message type="info">
            📷 Ready to scan? Point your camera at the donor's QR code to verify
            pickup.
          </Message>
          <Button onClick={startScanning} $primary>
            📷 Start Camera
          </Button>
        </>
      )}

      {scanning && (
        <>
          <VideoContainer>
            <Video ref={videoRef} autoPlay playsInline muted />
            <ScanOverlay>
              <ScanLine />
            </ScanOverlay>
          </VideoContainer>

          {message.text && (
            <Message type={message.type}>{message.text}</Message>
          )}

          <Button onClick={stopScanning}>⏹️ Stop Scanning</Button>
        </>
      )}

      {verifying && (
        <Message type="info">
          ⏳ Verifying with server<LoadingDots>...</LoadingDots>
        </Message>
      )}

      {scannedData && (
        <VerificationCard>
          <StatusIcon>✅</StatusIcon>
          <h3>Pickup Completed!</h3>

          <DetailRow>
            <Label>Item:</Label>
            <Value>{scannedData.listing?.title}</Value>
          </DetailRow>

          <DetailRow>
            <Label>Quantity:</Label>
            <Value>{scannedData.listing?.quantity}</Value>
          </DetailRow>

          <DetailRow>
            <Label>Donor:</Label>
            <Value>
              {scannedData.donor?.firstName} {scannedData.donor?.lastName}
            </Value>
          </DetailRow>

          <DetailRow>
            <Label>Completed:</Label>
            <Value>{new Date(scannedData.completedAt).toLocaleString()}</Value>
          </DetailRow>

          {scannedData.impact && (
            <>
              <h4
                style={{
                  marginTop: "1.5rem",
                  marginBottom: "0.75rem",
                  color: "#2d3748",
                }}
              >
                🌱 Environmental Impact
              </h4>

              <DetailRow>
                <Label>♻️ Waste Prevented:</Label>
                <Value>
                  {scannedData.impact.wastePreventedKg.toFixed(2)} kg
                </Value>
              </DetailRow>

              <DetailRow>
                <Label>🌍 CO2 Saved:</Label>
                <Value>{scannedData.impact.co2SavedKg.toFixed(2)} kg</Value>
              </DetailRow>

              <DetailRow>
                <Label>🍽️ Meals Provided:</Label>
                <Value>{scannedData.impact.mealsProvided}</Value>
              </DetailRow>
            </>
          )}

          <Button
            onClick={resetScanner}
            $primary
            style={{ marginTop: "1.5rem" }}
          >
            ✨ Scan Another
          </Button>
        </VerificationCard>
      )}

      {message.text && !scanning && !scannedData && (
        <Message type={message.type}>{message.text}</Message>
      )}
    </ScannerContainer>
  );
};

export default QRScanner;
