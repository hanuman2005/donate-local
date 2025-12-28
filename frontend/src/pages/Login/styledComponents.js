import styled from "styled-components";

// Framer Motion props that should not be forwarded to the DOM
const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

export const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 2rem 1rem;
  margin-top: 80px; /* Match header height */
  min-height: calc(100vh - 80px);
  transition: all var(--transition-base);
`;

export const LoginCard = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const LoginTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const LoginSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  transition: all var(--transition-base);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-input);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.08);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

export const LoginButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-button);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #feb2b2;
  margin-bottom: 0.5rem;
`;

export const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #2f855a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #9ae6b4;
  margin-bottom: 0.5rem;
`;

export const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e2e8f0;
`;

export const DividerText = styled.span`
  padding: 0 1rem;
  color: #a0aec0;
  font-size: 0.9rem;
`;

export const LoginFooter = styled.div`
  text-align: center;
`;

export const FooterText = styled.p`
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const FooterLink = styled.span`
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;
