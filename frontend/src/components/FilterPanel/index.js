// ============================================
// src/components/FiltersPanel/index.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { motionVariants } from "../../animations/motionVariants";
import {
  FiltersWrapper,
  FiltersContainer,
  FiltersTitle,
  FiltersSubtitle,
  FilterGroup,
  Label,
  Select,
  Input,
  ButtonGroup,
  Button,
  LocationInfo,
  LocationIcon,
  LocationText,
  FilterIcon,
  ActiveFiltersCount,
} from "./styledComponents";
import { listingsAPI } from "../../services/api";

const FiltersPanel = ({ onResults, autoSearch = false }) => {
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [expiryBefore, setExpiryBefore] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [maxDistance, setMaxDistance] = useState(5000);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const hasSearchedRef = useRef(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
          if (autoSearch && !hasSearchedRef.current) {
            handleSearchWithoutLocation();
          }
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000,
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      if (autoSearch && !hasSearchedRef.current) {
        handleSearchWithoutLocation();
      }
    }
  }, []);

  useEffect(() => {
    if (autoSearch && !hasSearchedRef.current) {
      const timer = setTimeout(() => {
        if (!hasSearchedRef.current) {
          handleSearch();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoSearch]);

  const handleSearch = async () => {
    if (hasSearchedRef.current && isSearching) return;

    hasSearchedRef.current = true;
    setIsSearching(true);

    try {
      const params = {
        sortBy,
        status: "available",
      };

      if (category) params.category = category;
      if (urgency) params.urgency = urgency;
      if (expiryBefore) params.expiryBefore = expiryBefore;

      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.maxDistance = maxDistance;
      }

      const res = await listingsAPI.search(params);
      onResults(res.data.listings || []);
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchWithoutLocation = async () => {
    hasSearchedRef.current = true;
    setIsSearching(true);

    try {
      const params = {
        sortBy,
        status: "available",
      };

      if (category) params.category = category;
      if (urgency) params.urgency = urgency;
      if (expiryBefore) params.expiryBefore = expiryBefore;

      const res = await listingsAPI.search(params);
      onResults(res.data.listings || []);
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setCategory("");
    setUrgency("");
    setExpiryBefore("");
    setSortBy("newest");
    setMaxDistance(5000);
    hasSearchedRef.current = false;
    handleSearch();
  };

  const handleManualSearch = () => {
    hasSearchedRef.current = false;
    handleSearch();
  };

  const activeFiltersCount = [category, urgency, expiryBefore].filter(
    Boolean
  ).length;

  return (
    <FiltersWrapper
      as={motion.div}
      variants={motionVariants.fadeSlideRight}
      initial="hidden"
      animate="show"
    >
      <FiltersContainer
        as={motion.div}
        variants={motionVariants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={motionVariants.fadeSlideUp}>
          <FiltersTitle>
            <FilterIcon>🔍</FilterIcon>
            Find Your Perfect Match
          </FiltersTitle>
          <FiltersSubtitle>
            Filter and search for available food in your area
            {activeFiltersCount > 0 && (
              <ActiveFiltersCount
                as={motion.span}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                active
              </ActiveFiltersCount>
            )}
          </FiltersSubtitle>
        </motion.div>

        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>🏷️</span> Category
          </Label>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="produce">🥕 Fresh Produce</option>
            <option value="canned-goods">🥫 Canned Goods</option>
            <option value="dairy">🥛 Dairy Products</option>
            <option value="bakery">🍞 Bakery Items</option>
            <option value="household-items">🏠 Household Items</option>
            <option value="clothing">👕 Clothing</option>
            <option value="other">📦 Other</option>
          </Select>
        </FilterGroup>

        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>⚡</span> Urgency
          </Label>
          <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">Any Urgency</option>
            <option value="3">🔴 High (Expires Soon)</option>
            <option value="2">🟡 Medium</option>
            <option value="1">🟢 Low</option>
          </Select>
        </FilterGroup>

        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>📅</span> Expiry Before
          </Label>
          <Input
            type="date"
            value={expiryBefore}
            onChange={(e) => setExpiryBefore(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </FilterGroup>

        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>🔄</span> Sort By
          </Label>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">🆕 Newest First</option>
            <option value="oldest">⏰ Oldest First</option>
            <option value="popular">⭐ Most Popular</option>
            <option value="distance">📍 Nearest First</option>
          </Select>
        </FilterGroup>

        {lat && lng && (
          <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
            <Label>
              <span>📏</span> Max Distance (km)
            </Label>
            <Input
              type="number"
              value={maxDistance / 1000}
              onChange={(e) => setMaxDistance(Number(e.target.value) * 1000)}
              min="0.5"
              max="50"
              step="0.5"
              placeholder="5"
            />
            <LocationInfo
              as={motion.div}
              $success
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <LocationIcon>✅</LocationIcon>
              <LocationText>Location detected</LocationText>
            </LocationInfo>
          </FilterGroup>
        )}

        {locationError && !lat && !lng && (
          <LocationInfo
            as={motion.div}
            $error
            variants={motionVariants.fadeSlideUp}
          >
            <LocationIcon>⚠️</LocationIcon>
            <LocationText>{locationError}</LocationText>
          </LocationInfo>
        )}

        <ButtonGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Button
            as={motion.button}
            $primary
            onClick={handleManualSearch}
            disabled={isSearching}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSearching ? "⏳ Searching..." : "🔍 Search"}
          </Button>
          <Button
            as={motion.button}
            $secondary
            onClick={handleReset}
            disabled={isSearching}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 Reset
          </Button>
        </ButtonGroup>
      </FiltersContainer>
    </FiltersWrapper>
  );
};

export default FiltersPanel;
