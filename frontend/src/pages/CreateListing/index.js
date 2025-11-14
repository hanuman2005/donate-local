import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listingsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
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

  // === Shared Logic ===
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

  // === Bulk Mode Handlers ===
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
      setSuccess(`Created ${bulkItems.length} donations`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Failed to create some donations");
    } finally {
      setLoading(false);
    }
  };

  // === Single Form Logic ===
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
      setSuccess("Listing created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard");

  // === Render ===
  return (
    <CreateListingContainer>
      <CreateListingCard>
        <Header>
          <Title>Create New Listing</Title>
          <Subtitle>
            Share your surplus food and resources with the community
          </Subtitle>
        </Header>

        <BulkModeToggle>
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

        {!bulkMode ? (
          // Single Listing Form
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {/* Basic Info */}
            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label>Category *</Label>
                  <Select
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
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Unit</Label>
                  <Select
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

            {/* Additional */}
            <FormSection>
              <SectionTitle>Additional Details</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Best Before Date</Label>
                  <Input
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
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Additional Notes</Label>
                <TextArea
                  name="additionalNotes"
                  rows="3"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormSection>

            {/* Images */}
            <FormSection>
              <SectionTitle>Images (Optional)</SectionTitle>
              <FormGroup>
                <Label>Upload Photos (Max 5)</Label>
                <FileInputLabel htmlFor="images">
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
              {imagePreviews.length > 0 && (
                <ImagePreview>
                  <ImageGrid>
                    {imagePreviews.map((preview, i) => (
                      <ImageItem key={i}>
                        <img src={preview.url} alt={`Preview ${i + 1}`} />
                        <RemoveImageButton onClick={() => removeImage(i)}>
                          ×
                        </RemoveImageButton>
                      </ImageItem>
                    ))}
                  </ImageGrid>
                </ImagePreview>
              )}
            </FormSection>

            <ButtonRow>
              <CancelButton type="button" onClick={handleCancel}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : "Create Listing"}
              </SubmitButton>
            </ButtonRow>
          </Form>
        ) : (
          // Bulk Mode Form
          <form onSubmit={handleBulkSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            <BulkItemsList>
              {bulkItems.map((item, index) => (
                <BulkItem key={index}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.title}
                    onChange={(e) =>
                      updateBulkItem(index, "title", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateBulkItem(index, "quantity", e.target.value)
                    }
                    required
                  />
                  <select
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
                  </select>
                  <button
                    type="button"
                    onClick={() => removeBulkItem(index)}
                    disabled={bulkItems.length === 1}
                  >
                    🗑️
                  </button>
                </BulkItem>
              ))}
            </BulkItemsList>

            <button
              type="button"
              onClick={addBulkItem}
              style={{ marginTop: "1rem" }}
            >
              ➕ Add Another Item
            </button>

            <div style={{ marginTop: "2rem" }}>
              <h3>Common Details (applies to all items)</h3>
              <Input
                name="pickupLocation"
                placeholder="Pickup Location *"
                value={commonFields.pickupLocation}
                onChange={handleCommonChange}
                required
              />
              <Input
                type="date"
                name="expiryDate"
                value={commonFields.expiryDate}
                onChange={handleCommonChange}
              />
              <TextArea
                name="additionalNotes"
                placeholder="Additional Notes"
                rows="3"
                value={commonFields.additionalNotes}
                onChange={handleCommonChange}
              />
            </div>

            <ButtonRow style={{ marginTop: "2rem" }}>
              <CancelButton type="button" onClick={handleCancel}>
                Cancel
              </CancelButton>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  `Create ${bulkItems.length} Donations`
                )}
              </SubmitButton>
            </ButtonRow>
          </form>
        )}
      </CreateListingCard>
    </CreateListingContainer>
  );
};

export default CreateListing;
