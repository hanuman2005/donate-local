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
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  border: 1px solid var(--border-color);
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
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const RegisterSubtitle = styled.p`
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: var(--bg-secondary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

export const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: var(--bg-secondary);
  cursor: pointer;
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
`;

export const RegisterButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-inverse);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
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
  background: var(--error-bg);
  color: var(--error);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  border: 1px solid var(--error);
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
  background: var(--border-color);
`;

export const DividerText = styled.span`
  padding: 0 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

export const RegisterFooter = styled.div`
  text-align: center;
`;

export const FooterText = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const FooterLink = styled.span`
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast);

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
`;