// src/pages/CreateListing/styledComponents.js - COMPLETE FILE FOR SIDEBAR LAYOUT

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

export const CreateListingContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem 1rem;
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

export const CreateListingCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    border-radius: var(--radius-lg);
  }
`;

export const Header = styled.div`
  background: var(--gradient-primary);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

export const Form = styled.form`
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary);
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 1.15rem;
    margin-bottom: 1.25rem;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: var(--bg-secondary);
  width: 100%;
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px var(--shadow-focus);
  }

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

export const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: var(--bg-secondary);
  resize: vertical;
  font-family: inherit;
  width: 100%;
  min-height: 100px;
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px var(--shadow-focus);
  }

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
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
  width: 100%;
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px var(--shadow-focus);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-weight: 500;
  color: var(--text-secondary);
  width: 100%;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--primary);
    color: var(--primary);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

export const ImagePreview = styled.div`
  margin-top: 1rem;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ImageItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--border-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RemoveImageButton = styled.button.withConfig({
  shouldForwardProp,
})`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: var(--bg-modal);
  color: var(--error);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  &:hover {
    background: var(--error);
    color: white;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

export const SubmitButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 14px 28px;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  white-space: nowrap;
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
  }
`;

export const CancelButton = styled.button.withConfig({ shouldForwardProp })`
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 14px 28px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--text-secondary);
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
  }
`;

export const ErrorMessage = styled.div`
  background: var(--error-bg);
  color: var(--error);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  border: 1px solid var(--error);
  margin-bottom: 1.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const SuccessMessage = styled.div`
  background: var(--success-bg);
  color: var(--success);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  border: 1px solid var(--success);
  margin-bottom: 1.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// === BULK MODE COMPONENTS ===

export const BulkModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: var(--transition-base);
    border-radius: var(--radius-full);

    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: var(--transition-base);
      border-radius: var(--radius-full);
    }
  }

  input:checked + span {
    background-color: var(--primary);
  }

  input:checked + span:before {
    transform: translateX(30px);
  }
`;

export const BulkItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const BulkItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 50px;
  gap: 0.875rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  transition: all var(--transition-base);
  align-items: center;

  &:hover {
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: var(--shadow-md);
  }

  input,
  select {
    padding: 10px 12px;
    border-radius: var(--radius-md);
    border: 2px solid var(--border-color);
    font-size: 0.95rem;
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all var(--transition-base);
    width: 100%;
    min-width: 0;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--shadow-focus);
    }
  }

  button {
    background: var(--error-bg);
    color: var(--error);
    border: none;
    border-radius: var(--radius-md);
    padding: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all var(--transition-base);
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:not(:disabled):hover {
      background: var(--error);
      color: white;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1.5fr 0.8fr 1fr 42px;
    gap: 0.75rem;
    padding: 1rem;

    input,
    select {
      font-size: 0.9rem;
      padding: 9px 10px;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 0.6fr 0.8fr 40px;
    gap: 0.625rem;
    padding: 0.875rem;

    input,
    select {
      font-size: 14px;
      padding: 8px;
    }

    button {
      font-size: 1rem;
      width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "details"
      "remove";
    gap: 0.75rem;

    input:first-child {
      grid-area: title;
    }

    input:nth-child(2),
    select {
      grid-area: details;
    }

    input:nth-child(2) {
      display: inline-block;
      width: calc(40% - 0.375rem);
    }

    select {
      display: inline-block;
      width: calc(60% - 0.375rem);
      margin-left: 0.75rem;
    }

    button {
      grid-area: remove;
      width: 100%;
      height: 40px;
      border-radius: var(--radius-md);
    }
  }
`;
