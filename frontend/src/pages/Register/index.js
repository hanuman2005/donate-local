import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  RegisterContainer,
  RegisterCard,
  RegisterHeader,
  RegisterTitle,
  RegisterSubtitle,
  RegisterForm,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  RegisterButton,
  ErrorMessage,
  RegisterFooter,
  FooterText,
  FooterLink,
  DividerContainer,
  DividerLine,
  DividerText,
} from "./styledComponents";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "donor",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (clearError) clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error && clearError) clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { confirmPassword, ...rest } = formData;

      // ✅ FIXED: Send firstName and lastName separately
      const payload = {
        firstName: rest.firstName,
        lastName: rest.lastName,
        email: rest.email,
        password: rest.password,
        phoneNumber: rest.phone,
        userType: rest.userType, // "donor", "recipient", or "both"
        address: {
          street: rest.address,
          city: "",
          state: "",
          zipCode: "",
          country: "India",
        },
      };

      const result = await register(payload);

      if (result?.success) {
        navigate("/dashboard", {
          state: {
            message: "Welcome! Your account has been created successfully.",
          },
        });
      } else if (result?.error) {
        if (result.details) {
          const mappedErrors = {};
          for (const key in result.details) {
            mappedErrors[key] = result.details[key].message;
          }
          setValidationErrors(mappedErrors);
        }
        console.error("Registration failed:", result.error);
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    Object.values(formData).every((value) => value.toString().trim()) &&
    formData.password === formData.confirmPassword &&
    formData.password.length >= 6;

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Join Our Community</RegisterTitle>
          <RegisterSubtitle>
            Create your account to start sharing and receiving resources
          </RegisterSubtitle>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                autoComplete="given-name"
              />
              {validationErrors.firstName && (
                <ErrorMessage>{validationErrors.firstName}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                autoComplete="family-name"
              />
              {validationErrors.lastName && (
                <ErrorMessage>{validationErrors.lastName}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            {validationErrors.email && (
              <ErrorMessage>{validationErrors.email}</ErrorMessage>
            )}
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <ErrorMessage>{validationErrors.password}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
              />
              {validationErrors.confirmPassword && (
                <ErrorMessage>{validationErrors.confirmPassword}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              autoComplete="tel"
            />
            {validationErrors.phone && (
              <ErrorMessage>{validationErrors.phone}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="userType">Account Type</Label>
            <Select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="both">Both</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">Street Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your street address"
              required
              autoComplete="street-address"
            />
            {validationErrors.address && (
              <ErrorMessage>{validationErrors.address}</ErrorMessage>
            )}
          </FormGroup>

          <RegisterButton type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="small" /> : "Create Account"}
          </RegisterButton>
        </RegisterForm>

        <DividerContainer>
          <DividerLine />
          <DividerText>or</DividerText>
          <DividerLine />
        </DividerContainer>

        <RegisterFooter>
          <FooterText>
            Already have an account?{" "}
            <FooterLink as={Link} to="/login">
              Sign in here
            </FooterLink>
          </FooterText>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;