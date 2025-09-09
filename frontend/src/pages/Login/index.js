import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
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
  DividerText
} from './styledComponents';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Clear any existing errors when component mounts
    if (clearError) clearError();
  }, [clearError]);

  useEffect(() => {
    // Show success message if coming from registration
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors/messages on input change
    if (error && clearError) clearError();
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Welcome Back</LoginTitle>
          <LoginSubtitle>Sign in to your account to continue</LoginSubtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          {message && <SuccessMessage>{message}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

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
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
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

          <LoginButton type="submit" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? <LoadingSpinner size="small" /> : 'Sign In'}
          </LoginButton>
        </LoginForm>

        <DividerContainer>
          <DividerLine />
          <DividerText>or</DividerText>
          <DividerLine />
        </DividerContainer>

        <LoginFooter>
          <FooterText>
            Don't have an account?{' '}
            <FooterLink as={Link} to="/register">
              Sign up here
            </FooterLink>
          </FooterText>

          <FooterText style={{ marginTop: '1rem' }}>
            <FooterLink as={Link} to="/forgot-password">
              Forgot your password?
            </FooterLink>
          </FooterText>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
