// src/pages/Login/index.jsx - POLISHED WITH FRAMER MOTION
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { motionVariants } from "../../animations/motionVariants";

import {
  LoginContainer,
  LoginCard,
  LoginHeader,
  LoginTitle,
  LoginSubtitle,
  LoginForm,
  FormGroup,
  Label,
  Input,
  LoginButton,
  ErrorMessage,
  SuccessMessage,
  LoginFooter,
  FooterText,
  FooterLink,
  DividerContainer,
  DividerLine,
  DividerText,
} from "./styledComponents";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (clearError) clearError();
  }, [clearError]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (error && clearError) clearError();
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
      console.log("Login result:", result);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <LoginContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <LoginCard
        as={motion.div}
        variants={motionVariants.scaleIn}
        initial="hidden"
        animate="show"
      >
        <LoginHeader
          as={motion.div}
          variants={motionVariants.fadeSlideDown}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
        >
          <LoginTitle>Welcome Back 👋</LoginTitle>
          <LoginSubtitle>Sign in to your account to continue</LoginSubtitle>
        </LoginHeader>

        <LoginForm as={motion.form} onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {message && (
              <SuccessMessage
                as={motion.div}
                key="success"
                variants={motionVariants.dropDownSpring}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {message}
              </SuccessMessage>
            )}
            {error && (
              <ErrorMessage
                as={motion.div}
                key="error"
                variants={motionVariants.dropDownSpring}
                initial="hidden"
                animate="show"
                exit="exit"
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
            <FormGroup
              as={motion.div}
              variants={motionVariants.fadeSlideUp}
            >
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
              />
            </FormGroup>

            <FormGroup
              as={motion.div}
              variants={motionVariants.fadeSlideUp}
            >
              <Label htmlFor="password">Password</Label>
              <Input
                as={motion.input}
                whileFocus={{ scale: 1.01 }}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </FormGroup>

            <LoginButton
              as={motion.button}
              variants={motionVariants.fadeSlideUp}
              type="submit"
              disabled={!isFormValid || isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? <LoadingSpinner size="small" /> : "Sign In 🚀"}
            </LoginButton>
          </motion.div>
        </LoginForm>

        <DividerContainer
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3 }}
        >
          <DividerLine />
          <DividerText>or</DividerText>
          <DividerLine />
        </DividerContainer>

        <LoginFooter
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        >
          <FooterText>
            Don't have an account?{" "}
            <FooterLink
              as={Link}
              to="/register"
              style={{ cursor: "pointer" }}
            >
              Sign up here
            </FooterLink>
          </FooterText>

          <FooterText style={{ marginTop: "1rem" }}>
            <FooterLink
              as={Link}
              to="/forgot-password"
              style={{ cursor: "pointer" }}
            >
              Forgot your password?
            </FooterLink>
          </FooterText>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;