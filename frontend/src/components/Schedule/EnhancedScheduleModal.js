// src/components/Schedule/ScheduleModal.js - Enhanced with Calendar & Time Slots
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { scheduleAPI } from "../../services/api";
import CalendarPicker from "./CalendarPicker";
import TimeSlotPicker from "./TimeSlotPicker";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: var(--bg-secondary);
  border: none;
  color: var(--text-on-primary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: var(--bg-tertiary);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
`;

const StepsIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${(props) => {
    if (props.$active) return "var(--gradient-primary)";
    if (props.$completed) return "var(--bg-success)";
    return "var(--bg-secondary)";
  }};
  color: ${(props) =>
    props.$active
      ? "var(--text-on-primary)"
      : props.$completed
      ? "var(--success)"
      : "var(--text-secondary)"};
  transition: all 0.3s;
`;

const StepNumber = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MapWrapper = styled.div`
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-color);
`;

const AddressInput = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-input);
  color: var(--text-primary);
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: var(--shadow-lg);
`;

const SearchResult = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-primary);
  transition: background 0.2s;

  &:hover {
    background: var(--bg-secondary);
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: var(--gradient-primary);
  color: var(--text-on-primary);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const SecondaryButton = styled(Button)`
  background: var(--bg-secondary);
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background: var(--bg-tertiary);
  }
`;

const RecurringOptions = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.75rem;

  input {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
  }
`;

const RecurringFrequency = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--bg-input);
  color: var(--text-primary);
  margin-top: 0.5rem;
`;

const Summary = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    font-size: 1.25rem;
  }
`;

const SummaryLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const SummaryValue = styled.span`
  color: var(--text-primary);
  font-weight: 600;
  margin-left: auto;
`;

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lng, e.latlng.lat]);
    },
  });
  return null;
};

const STEPS = [
  { id: 1, label: "Date & Time" },
  { id: 2, label: "Location" },
  { id: 3, label: "Review" },
];

const EnhancedScheduleModal = ({
  isOpen,
  onClose,
  listing,
  recipientId,
  onScheduleCreated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [address, setAddress] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provider = new OpenStreetMapProvider();

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setAddress("");
      setCoordinates(null);
      setNotes("");
      setIsRecurring(false);
    }
  }, [isOpen]);

  const handleAddressSearch = useCallback(async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await provider.search({ query });
      setSearchResults(results.slice(0, 5));
    } catch (error) {
      console.error("Search error:", error);
    }
  }, []);

  const handleSelectAddress = (result) => {
    setAddress(result.label);
    setCoordinates([result.x, result.y]);
    setSearchResults([]);
  };

  const handleMapClick = (coords) => {
    setCoordinates(coords);
    // Reverse geocode to get address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.display_name) {
          setAddress(data.display_name);
        }
      })
      .catch(console.error);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return address && coordinates;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !coordinates) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduleData = {
        recipientId,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        pickupLocation: {
          type: "Point",
          coordinates,
        },
        pickupAddress: address,
        donorNotes: notes,
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : null,
      };

      const response = await scheduleAPI.proposeSchedule(
        listing._id,
        scheduleData
      );
      toast.success("Pickup scheduled successfully! 📅");
      onScheduleCreated?.(response.schedule);
      onClose();
    } catch (error) {
      console.error("Schedule error:", error);
      toast.error(error.response?.data?.message || "Failed to create schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = () => {
    if (!selectedDate || !selectedTime) return "";
    const date = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const hour12 = hours % 12 || 12;
    const period = hours < 12 ? "AM" : "PM";
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} at ${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <HeaderTitle>📅 Schedule Pickup</HeaderTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            <StepsIndicator>
              {STEPS.map((step) => (
                <Step
                  key={step.id}
                  $active={currentStep === step.id}
                  $completed={currentStep > step.id}
                >
                  <StepNumber>
                    {currentStep > step.id ? "✓" : step.id}
                  </StepNumber>
                  {step.label}
                </Step>
              ))}
            </StepsIndicator>

            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <ContentGrid>
                <CalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  minDate={new Date()}
                />
                <TimeSlotPicker
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  date={selectedDate}
                />
              </ContentGrid>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Section>
                <SectionTitle>📍 Pickup Location</SectionTitle>
                <MapWrapper>
                  <MapContainer
                    center={
                      coordinates &&
                      Array.isArray(coordinates) &&
                      coordinates.length >= 2 &&
                      !(coordinates[0] === 0 && coordinates[1] === 0)
                        ? [coordinates[1], coordinates[0]]
                        : [20.5937, 78.9629] // India center as default
                    }
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <MapClickHandler onLocationSelect={handleMapClick} />
                    {coordinates &&
                      Array.isArray(coordinates) &&
                      coordinates.length >= 2 &&
                      !(coordinates[0] === 0 && coordinates[1] === 0) && (
                        <Marker position={[coordinates[1], coordinates[0]]} />
                      )}
                  </MapContainer>
                </MapWrapper>

                <AddressInput>
                  <Input
                    type="text"
                    placeholder="Search for address or click on map..."
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      handleAddressSearch(e.target.value);
                    }}
                  />
                  {searchResults.length > 0 && (
                    <SearchResults>
                      {searchResults.map((result, index) => (
                        <SearchResult
                          key={index}
                          onClick={() => handleSelectAddress(result)}
                        >
                          {result.label}
                        </SearchResult>
                      ))}
                    </SearchResults>
                  )}
                </AddressInput>

                <Section style={{ marginTop: "1.5rem" }}>
                  <SectionTitle>📝 Notes for Recipient</SectionTitle>
                  <TextArea
                    placeholder="Any special instructions? (e.g., Ring doorbell, items are heavy, etc.)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                  />
                </Section>

                <RecurringOptions>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    🔄 Make this a recurring pickup
                  </CheckboxLabel>
                  {isRecurring && (
                    <RecurringFrequency
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </RecurringFrequency>
                  )}
                </RecurringOptions>
              </Section>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <Summary>
                <SummaryTitle>📋 Schedule Summary</SummaryTitle>

                <SummaryItem>
                  <span>📦</span>
                  <SummaryLabel>Item</SummaryLabel>
                  <SummaryValue>{listing?.title || "N/A"}</SummaryValue>
                </SummaryItem>

                <SummaryItem>
                  <span>📅</span>
                  <SummaryLabel>Date & Time</SummaryLabel>
                  <SummaryValue>{formatDateTime()}</SummaryValue>
                </SummaryItem>

                <SummaryItem>
                  <span>📍</span>
                  <SummaryLabel>Location</SummaryLabel>
                  <SummaryValue
                    style={{ maxWidth: "300px", textAlign: "right" }}
                  >
                    {address || "Not set"}
                  </SummaryValue>
                </SummaryItem>

                {isRecurring && (
                  <SummaryItem>
                    <span>🔄</span>
                    <SummaryLabel>Recurring</SummaryLabel>
                    <SummaryValue style={{ textTransform: "capitalize" }}>
                      {recurringFrequency}
                    </SummaryValue>
                  </SummaryItem>
                )}

                {notes && (
                  <SummaryItem
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>📝</span>
                      <SummaryLabel>Notes</SummaryLabel>
                    </div>
                    <p
                      style={{
                        margin: "0.5rem 0 0 2rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {notes}
                    </p>
                  </SummaryItem>
                )}
              </Summary>
            )}
          </ModalBody>

          <ModalFooter>
            {currentStep > 1 ? (
              <SecondaryButton onClick={handleBack}>← Back</SecondaryButton>
            ) : (
              <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            )}

            {currentStep < 3 ? (
              <PrimaryButton
                onClick={handleNext}
                disabled={!canProceed()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next →
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? "Scheduling..." : "Confirm Schedule ✓"}
              </PrimaryButton>
            )}
          </ModalFooter>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default EnhancedScheduleModal;
