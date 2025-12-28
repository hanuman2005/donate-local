// src/pages/Register/index.jsx - POLISHED WITH FRAMER MOTION
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";
import { motionVariants } from "../../animations/motionVariants";
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

      const payload = {
        firstName: rest.firstName,
        lastName: rest.lastName,
        email: rest.email,
        password: rest.password,
        phoneNumber: rest.phone,
        userType: rest.userType,
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
    <RegisterContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <RegisterCard
        as={motion.div}
        variants={motionVariants.scaleIn}
        initial="hidden"
        animate="show"
      >
        <RegisterHeader
          as={motion.div}
          variants={motionVariants.fadeSlideDown}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <RegisterTitle>Join Our Community 🌟</RegisterTitle>
          <RegisterSubtitle>
            Create your account to start sharing and receiving resources
          </RegisterSubtitle>
        </RegisterHeader>

        <RegisterForm
          as={motion.form}
          onSubmit={handleSubmit}
          role="form"
          aria-label="Registration form"
        >
          <AnimatePresence mode="wait">
            {error && (
              <ErrorMessage
                as={motion.div}
                key="global-error"
                variants={motionVariants.dropDownSpring}
                initial="hidden"
                animate="show"
                exit="exit"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <motion.div
            variants={motionVariants.staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Name Row */}
            <FormRow as={motion.div} variants={motionVariants.fadeSlideUp}>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  as={motion.input}
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                  autoComplete="given-name"
                  aria-required="true"
                  aria-invalid={!!validationErrors.firstName}
                  aria-describedby={
                    validationErrors.firstName ? "firstName-error" : undefined
                  }
                />
                <AnimatePresence>
                  {validationErrors.firstName && (
                    <ErrorMessage
                      as={motion.div}
                      variants={motionVariants.dropDownSpring}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      id="firstName-error"
                      role="alert"
                    >
                      {validationErrors.firstName}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  as={motion.input}
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                  autoComplete="family-name"
                  aria-required="true"
                  aria-invalid={!!validationErrors.lastName}
                  aria-describedby={
                    validationErrors.lastName ? "lastName-error" : undefined
                  }
                />
                <AnimatePresence>
                  {validationErrors.lastName && (
                    <ErrorMessage
                      as={motion.div}
                      variants={motionVariants.dropDownSpring}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      id="lastName-error"
                      role="alert"
                    >
                      {validationErrors.lastName}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
              </FormGroup>
            </FormRow>

            {/* Email */}
            <FormGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
              <Label htmlFor="email">Email Address</Label>
              <Input
                as={motion.input}
                whileFocus={{ scale: 1.01 }}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!validationErrors.email}
                aria-describedby={
                  validationErrors.email ? "email-error" : undefined
                }
              />
              <AnimatePresence>
                {validationErrors.email && (
                  <ErrorMessage
                    as={motion.div}
                    variants={motionVariants.dropDownSpring}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    id="email-error"
                    role="alert"
                  >
                    {validationErrors.email}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            {/* Password Row */}
            <FormRow as={motion.div} variants={motionVariants.fadeSlideUp}>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  as={motion.input}
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  autoComplete="new-password"
                />
                <AnimatePresence>
                  {validationErrors.password && (
                    <ErrorMessage
                      as={motion.div}
                      variants={motionVariants.dropDownSpring}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      {validationErrors.password}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  as={motion.input}
                  whileFocus={{ scale: 1.01 }}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                />
                <AnimatePresence>
                  {validationErrors.confirmPassword && (
                    <ErrorMessage
                      as={motion.div}
                      variants={motionVariants.dropDownSpring}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      {validationErrors.confirmPassword}
                    </ErrorMessage>
                  )}
                </AnimatePresence>
              </FormGroup>
            </FormRow>

            {/* Phone */}
            <FormGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                as={motion.input}
                whileFocus={{ scale: 1.01 }}
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                autoComplete="tel"
              />
              <AnimatePresence>
                {validationErrors.phone && (
                  <ErrorMessage
                    as={motion.div}
                    variants={motionVariants.dropDownSpring}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {validationErrors.phone}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            {/* User Type */}
            <FormGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
              <Label htmlFor="userType">Account Type</Label>
              <Select
                as={motion.select}
                whileFocus={{ scale: 1.01 }}
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="donor">🎁 Donor - I want to give</option>
                <option value="recipient">📦 Recipient - I need help</option>
                <option value="both">🤝 Both - Give & Receive</option>
              </Select>
            </FormGroup>

            {/* Address */}
            <FormGroup as={motion.div} variants={motionVariants.fadeSlideUp}>
              <Label htmlFor="address">Street Address</Label>
              <Input
                as={motion.input}
                whileFocus={{ scale: 1.01 }}
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your street address"
                required
                autoComplete="street-address"
              />
              <AnimatePresence>
                {validationErrors.address && (
                  <ErrorMessage
                    as={motion.div}
                    variants={motionVariants.dropDownSpring}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {validationErrors.address}
                  </ErrorMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            {/* Submit Button */}
            <RegisterButton
              as={motion.button}
              variants={motionVariants.fadeSlideUp}
              type="submit"
              disabled={!isFormValid || isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                "Create Account 🚀"
              )}
            </RegisterButton>
          </motion.div>
        </RegisterForm>

        <DividerContainer
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        >
          <DividerLine />
          <DividerText>or</DividerText>
          <DividerLine />
        </DividerContainer>

        <RegisterFooter
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
        >
          <FooterText>
            Already have an account?{" "}
            <FooterLink as={Link} to="/login" style={{ cursor: "pointer" }}>
              Sign in here
            </FooterLink>
          </FooterText>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
