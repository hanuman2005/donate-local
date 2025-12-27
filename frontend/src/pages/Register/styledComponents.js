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

export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 2rem 1rem;
  transition: all var(--transition-base);
`;

export const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 3rem;
  width: 100%;
  max-width: 600px;
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

export const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

export const RegisterTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const RegisterSubtitle = styled.p`
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  transition: all var(--transition-base);
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

export const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f093fb;
    background: white;
    box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
  }
`;

export const RegisterButton = styled.button.withConfig({ shouldForwardProp })`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
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
    box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
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
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid #feb2b2;
  margin-top: 0.25rem;
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

export const RegisterFooter = styled.div`
  text-align: center;
`;

export const FooterText = styled.p`
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const FooterLink = styled.span`
  color: #f093fb;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #e879f9;
    text-decoration: underline;
  }
`;
