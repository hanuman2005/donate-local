// src/pages/CreateListing/index.jsx - POLISHED WITH FRAMER MOTION
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { listingsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { motionVariants } from "../../animations/motionVariants";
import {
  CreateListingContainer,
  CreateListingCard,
  Header,
  Title,
  Subtitle,
  Form,
  FormSection,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FileInput,
  FileInputLabel,
  ImagePreview,
  ImageGrid,
  ImageItem,
  RemoveImageButton,
  SubmitButton,
  CancelButton,
  ButtonRow,
  ErrorMessage,
  SuccessMessage,
  BulkModeToggle,
  Switch,
  BulkItemsList,
  BulkItem,
} from "./styledComponents";

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bulkMode, setBulkMode] = useState(false);
  const [bulkItems, setBulkItems] = useState([
    { title: "", quantity: "", unit: "items", category: "produce" },
  ]);
  const [commonFields, setCommonFields] = useState({
    pickupLocation: "",
    expiryDate: "",
    additionalNotes: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "produce",
    quantity: "",
    unit: "items",
    expiryDate: "",
    pickupLocation: "",
    additionalNotes: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    { value: "produce", label: "Fresh Produce" },
    { value: "dairy", label: "Dairy Products" },
    { value: "bakery", label: "Bakery Items" },
    { value: "canned-goods", label: "Canned Goods" },
    { value: "household-items", label: "Household Items" },
    { value: "clothing", label: "Clothing" },
    { value: "other", label: "Other" },
  ];

  const units = [
    { value: "items", label: "Items" },
    { value: "kg", label: "Kilograms" },
    { value: "lbs", label: "Pounds" },
    { value: "bags", label: "Bags" },
    { value: "boxes", label: "Boxes" },
    { value: "servings", label: "Servings" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) return setError("Max 5 images");

    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setImages((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => [
          ...prev,
          { url: e.target.result, name: file.name },
        ]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addBulkItem = () =>
    setBulkItems([
      ...bulkItems,
      { title: "", quantity: "", unit: "items", category: "produce" },
    ]);
    
  const removeBulkItem = (i) =>
    setBulkItems(bulkItems.filter((_, index) => index !== i));
    
  const updateBulkItem = (i, field, value) => {
    const updated = [...bulkItems];
    updated[i][field] = value;
    setBulkItems(updated);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!commonFields.pickupLocation)
      return setError("Pickup location required");
    setLoading(true);
    try {
      const promises = bulkItems.map((item) =>
        listingsAPI.create({
          ...item,
          pickupLocation: commonFields.pickupLocation,
          expiryDate: commonFields.expiryDate,
          additionalNotes: commonFields.additionalNotes,
          donor: user._id,
        })
      );
      await Promise.all(promises);
      setSuccess(`✅ Created ${bulkItems.length} donations successfully!`);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError("Failed to create some donations");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return setError("Title required"), false;
    if (!formData.description.trim())
      return setError("Description required"), false;
    if (!formData.quantity || formData.quantity <= 0)
      return setError("Invalid quantity"), false;
    if (!formData.pickupLocation.trim())
      return setError("Pickup location required"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(
        ([key, val]) => val && formDataToSend.append(key, val)
      );
      formDataToSend.append("donor", user._id);
      images.forEach((img) => formDataToSend.append("images", img));
      await listingsAPI.create(formDataToSend);
      setSuccess("✅ Listing created successfully!");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard");

  return (
    <CreateListingContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <CreateListingCard
        as={motion.div}
        variants={motionVariants.scaleIn}
        initial="hidden"
        animate="show"
      >
        <Header
          as={motion.div}
          variants={motionVariants.fadeSlideDown}
          initial="hidden"
          animate="show"
        >
          <Title>Create New Listing</Title>
          <Subtitle>
            Share your surplus food and resources with the community
          </Subtitle>
        </Header>

        <motion.div
          style={{ padding: "2rem" }}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
        >
          <BulkModeToggle
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Switch>
              <input
                type="checkbox"
                checked={bulkMode}
                onChange={(e) => setBulkMode(e.target.checked)}
              />
              <span></span>
            </Switch>
            <div>
              <strong>Bulk Mode</strong>
              <p style={{ fontSize: "0.9rem", color: "#718096", margin: 0 }}>
                Create multiple donations at once
              </p>
            </div>
          </BulkModeToggle>

          <AnimatePresence mode="wait">
            {error && (
              <ErrorMessage
                as={motion.div}
                variants={motionVariants.dropDownSpring}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {error}
              </ErrorMessage>
            )}
            {success && (
              <SuccessMessage
                as={motion.div}
                variants={motionVariants.dropDownSpring}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {success}
              </SuccessMessage>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!bulkMode ? (
              // Single Listing Form
              <Form
                as={motion.form}
                key="single-form"
                variants={motionVariants.fadeSlide}
                initial="hidden"
                animate="show"
                exit="exit"
                onSubmit={handleSubmit}
              >
                {/* Basic Info */}
                <FormSection
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.1 }}
                >
                  <SectionTitle>Basic Information</SectionTitle>
                  <FormGroup>
                    <Label>Title *</Label>
                    <Input
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Fresh Vegetables"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description *</Label>
                    <TextArea
                      as={motion.textarea}
                      whileFocus={{ scale: 1.01 }}
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your items..."
                      required
                    />
                  </FormGroup>
                  <FormRow>
                    <FormGroup>
                      <Label>Category *</Label>
                      <Select
                        as={motion.select}
                        whileFocus={{ scale: 1.01 }}
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Quantity *</Label>
                      <Input
                        as={motion.input}
                        whileFocus={{ scale: 1.01 }}
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Unit</Label>
                      <Select
                        as={motion.select}
                        whileFocus={{ scale: 1.01 }}
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                      >
                        {units.map((u) => (
                          <option key={u.value} value={u.value}>
                            {u.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                  </FormRow>
                </FormSection>

                {/* Additional Details */}
                <FormSection
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.2 }}
                >
                  <SectionTitle>Additional Details</SectionTitle>
                  <FormRow>
                    <FormGroup>
                      <Label>Best Before Date</Label>
                      <Input
                        as={motion.input}
                        whileFocus={{ scale: 1.01 }}
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <Label>Pickup Location *</Label>
                    <Input
                      as={motion.input}
                      whileFocus={{ scale: 1.01 }}
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., 123 Main St, City"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Additional Notes</Label>
                    <TextArea
                      as={motion.textarea}
                      whileFocus={{ scale: 1.01 }}
                      name="additionalNotes"
                      rows="3"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions..."
                    />
                  </FormGroup>
                </FormSection>

                {/* Images */}
                <FormSection
                  as={motion.div}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.3 }}
                >
                  <SectionTitle>Images (Optional)</SectionTitle>
                  <FormGroup>
                    <Label>Upload Photos (Max 5)</Label>
                    <FileInputLabel
                      as={motion.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      htmlFor="images"
                    >
                      📷 Choose Images
                      <FileInput
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </FileInputLabel>
                  </FormGroup>
                  <AnimatePresence>
                    {imagePreviews.length > 0 && (
                      <ImagePreview
                        as={motion.div}
                        variants={motionVariants.fadeSlideUp}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                      >
                        <ImageGrid
                          as={motion.div}
                          variants={motionVariants.staggerContainerFast}
                          initial="hidden"
                          animate="show"
                        >
                          {imagePreviews.map((preview, i) => (
                            <ImageItem
                              key={i}
                              as={motion.div}
                              variants={motionVariants.scaleIn}
                              whileHover={{ scale: 1.05 }}
                              layout
                            >
                              <img src={preview.url} alt={`Preview ${i + 1}`} />
                              <RemoveImageButton
                                as={motion.button}
                                whileHover={{ scale: 1.2, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeImage(i)}
                              >
                                ×
                              </RemoveImageButton>
                            </ImageItem>
                          ))}
                        </ImageGrid>
                      </ImagePreview>
                    )}
                  </AnimatePresence>
                </FormSection>

                <ButtonRow>
                  <CancelButton
                    as={motion.button}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </CancelButton>
                  <SubmitButton
                    as={motion.button}
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? <LoadingSpinner size="small" /> : "✨ Create Listing"}
                  </SubmitButton>
                </ButtonRow>
              </Form>
            ) : (
              // Bulk Mode Form
              <motion.form
                key="bulk-form"
                variants={motionVariants.fadeSlide}
                initial="hidden"
                animate="show"
                exit="exit"
                onSubmit={handleBulkSubmit}
                style={{ padding: "0 2rem 2rem" }}
              >
                <BulkItemsList
                  as={motion.div}
                  variants={motionVariants.staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {bulkItems.map((item, index) => (
                      <BulkItem
                        key={index}
                        as={motion.div}
                        variants={motionVariants.listItemSlideUp}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                        layout
                        whileHover={{ scale: 1.01 }}
                      >
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          placeholder="Item name"
                          value={item.title}
                          onChange={(e) =>
                            updateBulkItem(index, "title", e.target.value)
                          }
                          required
                        />
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateBulkItem(index, "quantity", e.target.value)
                          }
                          required
                        />
                        <motion.select
                          whileFocus={{ scale: 1.02 }}
                          value={item.category}
                          onChange={(e) =>
                            updateBulkItem(index, "category", e.target.value)
                          }
                        >
                          {categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </motion.select>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeBulkItem(index)}
                          disabled={bulkItems.length === 1}
                        >
                          🗑️
                        </motion.button>
                      </BulkItem>
                    ))}
                  </AnimatePresence>
                </BulkItemsList>

                <motion.button
                  type="button"
                  onClick={addBulkItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#f0f7ff",
                    border: "2px dashed #4facfe",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: "#4facfe",
                  }}
                >
                  ➕ Add Another Item
                </motion.button>

                <motion.div
                  style={{ marginTop: "2rem" }}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.2 }}
                >
                  <h3 style={{ marginBottom: "1rem" }}>
                    Common Details (applies to all items)
                  </h3>
                  <Input
                    as={motion.input}
                    whileFocus={{ scale: 1.01 }}
                    name="pickupLocation"
                    placeholder="Pickup Location *"
                    value={commonFields.pickupLocation}
                    onChange={handleCommonChange}
                    required
                    style={{ marginBottom: "1rem" }}
                  />
                  <Input
                    as={motion.input}
                    whileFocus={{ scale: 1.01 }}
                    type="date"
                    name="expiryDate"
                    value={commonFields.expiryDate}
                    onChange={handleCommonChange}
                    style={{ marginBottom: "1rem" }}
                  />
                  <TextArea
                    as={motion.textarea}
                    whileFocus={{ scale: 1.01 }}
                    name="additionalNotes"
                    placeholder="Additional Notes"
                    rows="3"
                    value={commonFields.additionalNotes}
                    onChange={handleCommonChange}
                  />
                </motion.div>

                <ButtonRow style={{ marginTop: "2rem" }}>
                  <CancelButton
                    as={motion.button}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </CancelButton>
                  <SubmitButton
                    as={motion.button}
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      `✨ Create ${bulkItems.length} Donations`
                    )}
                  </SubmitButton>
                </ButtonRow>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </CreateListingCard>
    </CreateListingContainer>
  );
};

export default CreateListing;