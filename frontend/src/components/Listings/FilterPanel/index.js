// ============================================
// src/components/FiltersPanel/index.jsx
// ============================================
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionVariants } from "../../../animations/motionVariants";
import { listingsAPI } from "../../../services/api";
import { toast } from "react-toastify";
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
  SearchBar,
  SearchInput,
  SearchButton,
  MultiSelectContainer,
  CategoryTag,
  AdvancedToggle,
  AdvancedFiltersContainer,
  SearchHistoryDropdown,
  HistoryItem,
  ClearHistoryButton,
  DateRangeContainer,
  DateInputGroup,
  DateLabel,
  DateInput,
  SavedSearchesContainer,
  SavedSearchesHeader,
  SavedSearchesTitle,
  SaveSearchButton,
  SavedSearchList,
  SavedSearchItem,
  DeleteSavedSearch,
  AlertToggle,
  AlertCheckbox,
  AlertLabel,
} from "./styledComponents";

const FiltersPanel = ({ onResults, autoSearch = false, userLocation }) => {
  // Basic filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [urgency, setUrgency] = useState("");
  const [condition, setCondition] = useState("");
  const [expiryBefore, setExpiryBefore] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [maxDistance, setMaxDistance] = useState(5000);

  // Quantity range
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  // Date range (when item was posted)
  const [postedAfter, setPostedAfter] = useState("");
  const [postedBefore, setPostedBefore] = useState("");

  // Saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchAlertEnabled, setSearchAlertEnabled] = useState(false);

  // Location
  const [lat, setLat] = useState(userLocation?.lat || null);
  const [lng, setLng] = useState(userLocation?.lng || null);
  const [locationError, setLocationError] = useState(null);

  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const hasSearchedRef = useRef(false);

  const categories = [
    { value: "produce", label: "🥕 Fresh Produce", emoji: "🥕" },
    { value: "canned-goods", label: "🥫 Canned Goods", emoji: "🥫" },
    { value: "dairy", label: "🥛 Dairy Products", emoji: "🥛" },
    { value: "bakery", label: "🍞 Bakery Items", emoji: "🍞" },
    { value: "household-items", label: "🏠 Household Items", emoji: "🏠" },
    { value: "clothing", label: "👕 Clothing", emoji: "👕" },
    { value: "electronics", label: "📱 Electronics", emoji: "📱" },
    { value: "books", label: "📚 Books", emoji: "📚" },
    { value: "toys", label: "🧸 Toys", emoji: "🧸" },
    { value: "furniture", label: "🪑 Furniture", emoji: "🪑" },
    { value: "other", label: "📦 Other", emoji: "📦" },
  ];

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
    // Load saved searches
    const savedSearchesData = localStorage.getItem("savedSearches");
    if (savedSearchesData) {
      setSavedSearches(JSON.parse(savedSearchesData));
    }
  }, []);

  // Save current search to saved searches
  const saveCurrentSearch = () => {
    const currentFilters = {
      id: Date.now(),
      name: searchKeyword || `Search ${new Date().toLocaleDateString()}`,
      keyword: searchKeyword,
      categories: selectedCategories,
      urgency,
      condition,
      expiryBefore,
      postedAfter,
      postedBefore,
      minQuantity,
      maxQuantity,
      sortBy,
      maxDistance,
      alertEnabled: searchAlertEnabled,
      createdAt: new Date().toISOString(),
    };

    const updated = [currentFilters, ...savedSearches.slice(0, 9)]; // Keep max 10
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  // Load a saved search
  const loadSavedSearch = (search) => {
    setSearchKeyword(search.keyword || "");
    setSelectedCategories(search.categories || []);
    setUrgency(search.urgency || "");
    setCondition(search.condition || "");
    setExpiryBefore(search.expiryBefore || "");
    setPostedAfter(search.postedAfter || "");
    setPostedBefore(search.postedBefore || "");
    setMinQuantity(search.minQuantity || "");
    setMaxQuantity(search.maxQuantity || "");
    setSortBy(search.sortBy || "newest");
    setMaxDistance(search.maxDistance || 5000);
    setSearchAlertEnabled(search.alertEnabled || false);
  };

  // Delete a saved search
  const deleteSavedSearch = (id, e) => {
    e.stopPropagation();
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  // Get user location
  useEffect(() => {
    if (userLocation) {
      setLat(userLocation.lat);
      setLng(userLocation.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          setLocationError("Location access denied");
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  // Auto-search on mount
  useEffect(() => {
    if (autoSearch && !hasSearchedRef.current) {
      const timer = setTimeout(() => {
        if (!hasSearchedRef.current) {
          handleSearch();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearch]);

  // Toggle category selection
  const toggleCategory = (categoryValue) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  // Main search function
  const handleSearch = async () => {
    if (hasSearchedRef.current && isSearching) return;

    hasSearchedRef.current = true;
    setIsSearching(true);

    try {
      const params = {
        sortBy,
        status: "available",
      };

      // Keyword search
      if (searchKeyword.trim()) {
        params.search = searchKeyword.trim();
      }

      // Categories (multiple)
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(",");
      }

      // Other filters
      if (urgency) params.urgency = urgency;
      if (condition) params.condition = condition;
      if (expiryBefore) params.expiryBefore = expiryBefore;
      if (minQuantity) params.minQuantity = minQuantity;
      if (maxQuantity) params.maxQuantity = maxQuantity;

      // Date range filters
      if (postedAfter) params.postedAfter = postedAfter;
      if (postedBefore) params.postedBefore = postedBefore;

      // Location-based
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.maxDistance = maxDistance;
      }

      console.log("🔍 Search params:", params);

      const res = await listingsAPI.search(params);
      const results = res.data.listings || [];

      console.log("✅ Search results:", results.length);
      onResults(results, false);

      // Save to search history
      saveToHistory(params);

      toast.success(
        `Found ${results.length} listing${results.length !== 1 ? "s" : ""}!`
      );
    } catch (error) {
      console.error("❌ Search failed:", error);
      onResults([], true);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Search without location
  const handleSearchWithoutLocation = async () => {
    hasSearchedRef.current = true;
    setIsSearching(true);

    try {
      const params = {
        sortBy,
        status: "available",
      };

      if (searchKeyword.trim()) params.search = searchKeyword.trim();
      if (selectedCategories.length > 0)
        params.categories = selectedCategories.join(",");
      if (urgency) params.urgency = urgency;
      if (condition) params.condition = condition;
      if (expiryBefore) params.expiryBefore = expiryBefore;
      if (minQuantity) params.minQuantity = minQuantity;
      if (maxQuantity) params.maxQuantity = maxQuantity;

      const res = await listingsAPI.search(params);
      const results = res.data.listings || [];

      onResults(results, false);
      saveToHistory(params);

      toast.success(
        `Found ${results.length} listing${results.length !== 1 ? "s" : ""}!`
      );
    } catch (error) {
      console.error("Search failed:", error);
      onResults([], true);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Save search to history
  const saveToHistory = (params) => {
    const searchEntry = {
      id: Date.now(),
      keyword: searchKeyword,
      categories: selectedCategories,
      timestamp: new Date().toISOString(),
      params,
    };

    const updated = [searchEntry, ...searchHistory].slice(0, 10); // Keep last 10
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // Load search from history
  const loadFromHistory = (entry) => {
    setSearchKeyword(entry.keyword || "");
    setSelectedCategories(entry.categories || []);
    // Load other params if needed
    setShowHistory(false);
    handleSearch();
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    setShowHistory(false);
    toast.info("Search history cleared");
  };

  // Reset all filters
  const handleReset = () => {
    setSearchKeyword("");
    setSelectedCategories([]);
    setUrgency("");
    setCondition("");
    setExpiryBefore("");
    setSortBy("newest");
    setMaxDistance(5000);
    setMinQuantity("");
    setMaxQuantity("");
    setPostedAfter("");
    setPostedBefore("");
    setSearchAlertEnabled(false);
    hasSearchedRef.current = false;
    handleSearch();
  };

  // Quick search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      hasSearchedRef.current = false;
      handleSearch();
    }
  };

  const activeFiltersCount = [
    searchKeyword && 1,
    selectedCategories.length,
    urgency && 1,
    condition && 1,
    expiryBefore && 1,
    minQuantity && 1,
    maxQuantity && 1,
    postedAfter && 1,
    postedBefore && 1,
  ].filter(Boolean).length;

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
        {/* ========== HEADER ========== */}
        <motion.div variants={motionVariants.fadeSlideUp}>
          <FiltersTitle>
            <FilterIcon>🔍</FilterIcon>
            Advanced Search & Filters
          </FiltersTitle>
          <FiltersSubtitle>
            Find exactly what you need in your community
            {activeFiltersCount > 0 && (
              <ActiveFiltersCount
                as={motion.span}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {activeFiltersCount} active
              </ActiveFiltersCount>
            )}
          </FiltersSubtitle>
        </motion.div>

        {/* ========== KEYWORD SEARCH BAR ========== */}
        <SearchBar as={motion.div} variants={motionVariants.fadeSlideUp}>
          <SearchInput
            type="text"
            placeholder="Search by title, description, or keywords..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowHistory(searchHistory.length > 0)}
          />
          <SearchButton
            as={motion.button}
            onClick={() => {
              hasSearchedRef.current = false;
              handleSearch();
            }}
            disabled={isSearching}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSearching ? "⏳" : "🔍"}
          </SearchButton>

          {/* Search History Dropdown */}
          <AnimatePresence>
            {showHistory && searchHistory.length > 0 && (
              <SearchHistoryDropdown
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                    Recent Searches
                  </span>
                  <ClearHistoryButton onClick={clearHistory}>
                    Clear
                  </ClearHistoryButton>
                </div>
                {searchHistory.map((entry) => (
                  <HistoryItem
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                  >
                    <span>🔍 {entry.keyword || "All items"}</span>
                    <span style={{ fontSize: "0.8rem", color: "#718096" }}>
                      {entry.categories.length > 0 &&
                        `${entry.categories.length} categories`}
                    </span>
                  </HistoryItem>
                ))}
              </SearchHistoryDropdown>
            )}
          </AnimatePresence>
        </SearchBar>

        {/* ========== MULTI-SELECT CATEGORIES ========== */}
        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>🏷️</span> Categories (select multiple)
          </Label>
          <MultiSelectContainer>
            {categories.map((cat) => (
              <CategoryTag
                key={cat.value}
                as={motion.button}
                $selected={selectedCategories.includes(cat.value)}
                onClick={() => toggleCategory(cat.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.emoji} {cat.label.replace(cat.emoji, "").trim()}
              </CategoryTag>
            ))}
          </MultiSelectContainer>
        </FilterGroup>

        {/* ========== ADVANCED FILTERS TOGGLE ========== */}
        <AdvancedToggle
          as={motion.button}
          variants={motionVariants.fadeSlideUp}
          onClick={() => setShowAdvanced(!showAdvanced)}
          whileHover={{ scale: 1.02 }}
        >
          {showAdvanced ? "▼ Hide" : "▶ Show"} Advanced Filters
        </AdvancedToggle>

        {/* ========== ADVANCED FILTERS ========== */}
        <AnimatePresence>
          {showAdvanced && (
            <AdvancedFiltersContainer>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Condition */}
                <FilterGroup
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                >
                  <Label>
                    <span>✨</span> Condition
                  </Label>
                  <Select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="">Any Condition</option>
                    <option value="new">🆕 Brand New</option>
                    <option value="like-new">✨ Like New</option>
                    <option value="good">👍 Good</option>
                    <option value="fair">👌 Fair</option>
                  </Select>
                </FilterGroup>

                {/* Urgency */}
                <FilterGroup
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                >
                  <Label>
                    <span>⚡</span> Urgency
                  </Label>
                  <Select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="">Any Urgency</option>
                    <option value="3">🔴 High (Expires Soon)</option>
                    <option value="2">🟡 Medium</option>
                    <option value="1">🟢 Low</option>
                  </Select>
                </FilterGroup>

                {/* Expiry Date */}
                <FilterGroup
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                >
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

                {/* Quantity Range */}
                <FilterGroup
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                >
                  <Label>
                    <span>📦</span> Quantity Range
                  </Label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minQuantity}
                      onChange={(e) => setMinQuantity(e.target.value)}
                      min="1"
                    />
                    <span style={{ alignSelf: "center" }}>to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxQuantity}
                      onChange={(e) => setMaxQuantity(e.target.value)}
                      min="1"
                    />
                  </div>
                </FilterGroup>

                {/* Date Range - When Posted */}
                <FilterGroup
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                >
                  <Label>
                    <span>🗓️</span> Posted Date Range
                  </Label>
                  <DateRangeContainer>
                    <DateInputGroup>
                      <DateLabel>From</DateLabel>
                      <DateInput
                        type="date"
                        value={postedAfter}
                        onChange={(e) => setPostedAfter(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </DateInputGroup>
                    <DateInputGroup>
                      <DateLabel>To</DateLabel>
                      <DateInput
                        type="date"
                        value={postedBefore}
                        onChange={(e) => setPostedBefore(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </DateInputGroup>
                  </DateRangeContainer>
                </FilterGroup>
              </motion.div>
            </AdvancedFiltersContainer>
          )}
        </AnimatePresence>

        {/* ========== SAVED SEARCHES ========== */}
        <SavedSearchesContainer
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
        >
          <SavedSearchesHeader>
            <SavedSearchesTitle>💾 Saved Searches</SavedSearchesTitle>
            <SaveSearchButton
              onClick={saveCurrentSearch}
              disabled={!searchKeyword && selectedCategories.length === 0}
              title={
                !searchKeyword && selectedCategories.length === 0
                  ? "Add a keyword or select categories to save"
                  : "Save current search"
              }
            >
              + Save Current
            </SaveSearchButton>
          </SavedSearchesHeader>

          {savedSearches.length > 0 ? (
            <SavedSearchList>
              {savedSearches.map((search) => (
                <SavedSearchItem
                  key={search.id}
                  as={motion.div}
                  onClick={() => loadSavedSearch(search)}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{search.name}</strong>
                    {search.categories?.length > 0 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#718096",
                          marginLeft: "0.5rem",
                        }}
                      >
                        ({search.categories.length} categories)
                      </span>
                    )}
                    {search.alertEnabled && (
                      <span style={{ marginLeft: "0.5rem" }}>🔔</span>
                    )}
                  </div>
                  <DeleteSavedSearch
                    onClick={(e) => deleteSavedSearch(search.id, e)}
                    title="Delete saved search"
                  >
                    ✕
                  </DeleteSavedSearch>
                </SavedSearchItem>
              ))}
            </SavedSearchList>
          ) : (
            <p
              style={{
                fontSize: "0.85rem",
                color: "#718096",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              No saved searches yet. Save your first search!
            </p>
          )}

          <AlertToggle>
            <AlertCheckbox
              type="checkbox"
              checked={searchAlertEnabled}
              onChange={(e) => setSearchAlertEnabled(e.target.checked)}
              id="search-alert"
            />
            <AlertLabel htmlFor="search-alert">
              🔔 Alert me when new items match this search
            </AlertLabel>
          </AlertToggle>
        </SavedSearchesContainer>

        {/* ========== SORT BY ========== */}
        <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Label>
            <span>🔄</span> Sort By
          </Label>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">🆕 Newest First</option>
            <option value="oldest">⏰ Oldest First</option>
            <option value="popular">⭐ Most Popular</option>
            <option value="distance">📍 Nearest First</option>
            <option value="expiry">⏱️ Expiring Soon</option>
          </Select>
        </FilterGroup>

        {/* ========== DISTANCE FILTER ========== */}
        {lat && lng && (
          <FilterGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
            <Label>
              <span>📏</span> Max Distance ({maxDistance / 1000} km)
            </Label>
            <Input
              type="range"
              value={maxDistance / 1000}
              onChange={(e) => setMaxDistance(Number(e.target.value) * 1000)}
              min="0.5"
              max="50"
              step="0.5"
            />
            <LocationInfo as={motion.div} $success>
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

        {/* ========== ACTION BUTTONS ========== */}
        <ButtonGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
          <Button
            as={motion.button}
            $primary
            onClick={() => {
              hasSearchedRef.current = false;
              handleSearch();
            }}
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
