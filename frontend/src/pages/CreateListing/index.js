import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
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
  SuccessMessage
} from './styledComponents';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'produce',
    quantity: '',
    unit: 'items',
    expiryDate: '',
    pickupLocation: '',
    additionalNotes: ''
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: 'produce', label: 'Fresh Produce' },
    { value: 'dairy', label: 'Dairy Products' },
    { value: 'bakery', label: 'Bakery Items' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'household', label: 'Household Items' },
    { value: 'other', label: 'Other' }
  ];

  const units = [
    { value: 'items', label: 'Items' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'lbs', label: 'Pounds' },
    { value: 'bags', label: 'Bags' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'servings', label: 'Servings' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Each image must be smaller than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      setError('Please enter a valid quantity');
      return false;
    }
    if (!formData.pickupLocation.trim()) {
      setError('Pickup location is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrls = [];

      // Upload images if any
      if (images.length > 0) {
        const uploadResponse = await uploadAPI.uploadMultiple(images);
        imageUrls = uploadResponse.data.imageUrls || [];
      }

      // Create listing data
      const listingData = {
        ...formData,
        images: imageUrls,
        donor: user._id
      };

      const response = await listingsAPI.create(listingData);
      
      if (response.data.success) {
        setSuccess('Listing created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <CreateListingContainer>
      <CreateListingCard>
        <Header>
          <Title>Create New Listing</Title>
          <Subtitle>Share your surplus food and resources with the community</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {/* Basic Information */}
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            
            <FormGroup>
              <Label htmlFor="title">Title *</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Fresh organic vegetables from my garden"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description *</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what you're offering, condition, any special notes..."
                rows="4"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="e.g., 5"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          {/* Additional Details */}
          <FormSection>
            <SectionTitle>Additional Details</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="expiryDate">Best Before Date</Label>
                <Input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main St, Downtown, or general area description"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <TextArea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any special instructions, pickup times, etc..."
                rows="3"
              />
            </FormGroup>
          </FormSection>

          {/* Images */}
          <FormSection>
            <SectionTitle>Images (Optional)</SectionTitle>
            
            <FormGroup>
              <Label>Upload Photos (Max 5 images, 5MB each)</Label>
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
                  {imagePreviews.map((preview, index) => (
                    <ImageItem key={index}>
                      <img src={preview.url} alt={`Preview ${index + 1}`} />
                      <RemoveImageButton 
                        type="button"
                        onClick={() => removeImage(index)}
                      >
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
              {loading ? <LoadingSpinner size="small" /> : 'Create Listing'}
            </SubmitButton>
          </ButtonRow>
        </Form>
      </CreateListingCard>
    </CreateListingContainer>
  );
};

export default CreateListing;