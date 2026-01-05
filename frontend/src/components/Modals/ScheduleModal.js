// src/components/ScheduleModal/index.js - THEME INTEGRATED
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { scheduleAPI } from "../../services/api";

const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

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

// =====================
// Styled Components
// =====================
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
`;

const Modal = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--border);
`;

const Header = styled.div`
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  padding: 2rem;
  border-radius: 22px 22px 0 0;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    opacity: 0.95;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h2 {
      font-size: 1.3rem;
    }
  }
`;

const Content = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--shadow-input-focus);
    background: var(--bg-card);
  }
`;

const MapContainer2 = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--text-secondary);
`;

const SearchButton = styled.button.withConfig({ shouldForwardProp })`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-button);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MapWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border);
  height: 350px;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    height: 280px;
  }
`;

const SelectedLocation = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  border: 2px solid var(--border);

  p {
    margin: 0 0 0.5rem 0;
    color: var(--text-secondary);
    font-size: 0.9rem;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: var(--text-primary);
      font-weight: 700;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid var(--border);

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
    flex-direction: column-reverse;
  }
`;

const Button = styled(motion.button).withConfig({ shouldForwardProp })`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: var(--gradient-primary);
    color: var(--text-on-primary);
    box-shadow: var(--shadow-button);
    
    &:hover:not(:disabled) {
      box-shadow: var(--shadow-button-hover);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `
      : `
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border);
    
    &:hover {
      background: var(--bg-hover);
      border-color: var(--primary);
    }
  `}
`;

const ErrorText = styled.p`
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
  font-weight: 600;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  font-weight: 600;
`;

const InfoBox = styled.div`
  background: var(--bg-secondary);
  border-left: 4px solid var(--primary);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 2px solid var(--border);

  p {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.9rem;
    line-height: 1.5;

    strong {
      color: var(--primary);
    }
  }
`;

const CurrentLocationButton = styled.button.withConfig({ shouldForwardProp })`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: var(--gradient-primary);
    color: var(--text-on-primary);
    box-shadow: var(--shadow-button);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// =====================
// Map Click Handler Component
// =====================
const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Unknown location");
        })
        .catch(() => {
          setAddress("Unknown location");
        });
    },
  });

  return position ? <Marker position={position} /> : null;
};

// =====================
// Main Component
// =====================
const ScheduleModal = ({ listing, recipient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    donorNotes: "",
  });

  const [markerPosition, setMarkerPosition] = useState(
    listing?.location?.coordinates
      ? [listing.location.coordinates[1], listing.location.coordinates[0]]
      : [16.5449, 81.5212]
  );

  const [selectedAddress, setSelectedAddress] = useState(
    listing?.pickupLocation || "Click on map to select location"
  );

  const provider = useRef(new OpenStreetMapProvider());
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setSearching(true);
    try {
      const results = await provider.current.search({ query: searchQuery });

      if (results.length > 0) {
        const result = results[0];
        const newPos = [result.y, result.x];
        setMarkerPosition(newPos);
        setSelectedAddress(result.label);
        toast.success("Location found!");
      } else {
        toast.error("Location not found. Try a different search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search location");
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos = [position.coords.latitude, position.coords.longitude];
        setMarkerPosition(newPos);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setSelectedAddress(data.display_name || "Current location");
            toast.success("Current location set!");
          })
          .catch(() => {
            setSelectedAddress("Current location");
            toast.success("Current location set!");
          });
      },
      (error) => {
        toast.error("Unable to get your location");
      }
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = "Pickup date is required";
    }

    if (!formData.time) {
      newErrors.time = "Pickup time is required";
    }

    if (!markerPosition) {
      newErrors.location = "Please select a pickup location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const scheduleData = {
        recipientId: recipient._id,
        date: formData.date,
        time: formData.time,
        pickupLocation: {
          address: selectedAddress,
          coordinates: [markerPosition[1], markerPosition[0]],
        },
        donorNotes: formData.donorNotes,
      };

      await scheduleAPI.proposeSchedule(listing._id, scheduleData);

      toast.success("✅ Pickup schedule proposed successfully!");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Schedule error:", error);
      toast.error(
        error.response?.data?.message || "Failed to propose schedule"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Header>
            <h2>📅 Schedule Pickup</h2>
            <p>
              Arrange pickup time and location with {recipient?.firstName}{" "}
              {recipient?.lastName}
            </p>
          </Header>

          <Content>
            <InfoBox>
              <p>
                💡 <strong>Tip:</strong> Click anywhere on the map to set the
                exact pickup location, or search for an address.
              </p>
            </InfoBox>

            <form onSubmit={handleSubmit}>
              <FormSection>
                <Label>📅 Pickup Date *</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
                {errors.date && <ErrorText>{errors.date}</ErrorText>}
              </FormSection>

              <FormSection>
                <Label>🕐 Pickup Time *</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                {errors.time && <ErrorText>{errors.time}</ErrorText>}
              </FormSection>

              <MapContainer2>
                <Label>📍 Pickup Location *</Label>

                <SearchBox>
                  <SearchIcon>🔍</SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Search for a location (e.g., Bhimavaram Railway Station)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleSearch())
                    }
                  />
                  <SearchButton
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                  >
                    {searching ? "Searching..." : "Search"}
                  </SearchButton>
                </SearchBox>

                <CurrentLocationButton
                  type="button"
                  onClick={handleUseCurrentLocation}
                >
                  📍 Use My Current Location
                </CurrentLocationButton>

                <MapWrapper>
                  <MapContainer
                    center={markerPosition}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationMarker
                      position={markerPosition}
                      setPosition={setMarkerPosition}
                      setAddress={setSelectedAddress}
                    />
                  </MapContainer>
                </MapWrapper>

                {errors.location && <ErrorText>{errors.location}</ErrorText>}

                <SelectedLocation>
                  <p>
                    <strong>📍 Selected Location:</strong>
                  </p>
                  <p>{selectedAddress}</p>
                  <p style={{ fontSize: "0.85rem" }}>
                    Coordinates: {markerPosition[0].toFixed(5)},{" "}
                    {markerPosition[1].toFixed(5)}
                  </p>
                </SelectedLocation>
              </MapContainer2>

              <FormSection>
                <Label>📝 Additional Notes (Optional)</Label>
                <TextArea
                  name="donorNotes"
                  value={formData.donorNotes}
                  onChange={handleChange}
                  placeholder="Any special instructions for pickup (e.g., 'Ring doorbell', 'Near parking lot')"
                  maxLength={500}
                />
                <CharCount>{formData.donorNotes.length}/500</CharCount>
              </FormSection>
            </form>
          </Content>

          <ButtonGroup>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              $primary
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Proposing..." : "📅 Propose Schedule"}
            </Button>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default ScheduleModal;
