import React, { useState, useEffect } from "react";
import {
  FiltersWrapper,
  FilterGroup,
  Label,
  Select,
  Input,
  Button,
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

  // Get user location once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError(error.message);
          // Continue without location
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  }, []); // Run once on mount

  // Auto-search when location is ready (optional)
  useEffect(() => {
    if (autoSearch && lat !== null && lng !== null) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, autoSearch]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const params = {
        sortBy,
      };

      // Add optional filters only if they have values
      if (category) params.category = category;
      if (urgency) params.urgency = urgency;
      if (expiryBefore) params.expiryBefore = expiryBefore;

      // Add location-based search if available
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.maxDistance = maxDistance;
      }

      console.log("Search params:", params);
      const res = await listingsAPI.search(params);
      console.log("Search response:", res.data);
      
      onResults(res.data.listings || []); // matches backend format
    } catch (error) {
      console.error("Search failed:", error);
      onResults([]); // fallback to empty array
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
    handleSearch();
  };

  return (
    <FiltersWrapper>
      <FilterGroup>
        <Label>Category</Label>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="produce">Fresh Produce</option>
          <option value="canned-goods">Canned Goods</option>
          <option value="dairy">Dairy Products</option>
          <option value="bakery">Bakery Items</option>
          <option value="household-items">Household Items</option>
          <option value="clothing">Clothing</option>
          <option value="other">Other</option>
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Urgency</Label>
        <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="">Any Urgency</option>
          <option value="3">High (Expires Soon)</option>
          <option value="2">Medium</option>
          <option value="1">Low</option>
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Expiry Before</Label>
        <Input
          type="date"
          value={expiryBefore}
          onChange={(e) => setExpiryBefore(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </FilterGroup>

      <FilterGroup>
        <Label>Sort By</Label>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="distance">Nearest First</option>
        </Select>
      </FilterGroup>

      {(lat && lng) && (
        <FilterGroup>
          <Label>
            Max Distance (km)
            {locationError && (
              <span style={{ 
                color: '#e53e3e', 
                fontSize: '0.75rem',
                marginLeft: '0.5rem' 
              }}>
                ⚠️ {locationError}
              </span>
            )}
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
        </FilterGroup>
      )}

      <FilterGroup style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: '0.5rem' }}>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? '⏳ Searching...' : '🔍 Search'}
        </Button>
        <Button 
          onClick={handleReset} 
          disabled={isSearching}
          style={{ 
            background: '#6b7280', 
            color: 'white' 
          }}
        >
          🔄 Reset
        </Button>
      </FilterGroup>
    </FiltersWrapper>
  );
};

export default FiltersPanel;