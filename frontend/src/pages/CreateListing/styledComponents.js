// src/pages/CreateListing/styledComponents.js - FIXED BULK MODE & POLISHED

import styled from "styled-components";

export const CreateListingContainer = styled.div`
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

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
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;

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
  border-bottom: 1px solid #e2e8f0;

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
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4facfe;
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
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

export const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  resize: vertical;
  font-family: inherit;
  width: 100%;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
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
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4facfe;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
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
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #4a5568;
  width: 100%;

  &:hover {
    background: #e2e8f0;
    border-color: #4facfe;
    color: #4facfe;
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.95);
  color: #e53e3e;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #e53e3e;
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
  border-top: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

export const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
  }
`;

export const CancelButton = styled.button`
  background: #f8fafc;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 14px 28px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e0;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
  }
`;

export const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 1px solid #feb2b2;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #2f855a;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  border: 1px solid #9ae6b4;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// === BULK MODE COMPONENTS (FIXED) ===

export const BulkModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;

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
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 30px;

    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #667eea;
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
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.25s ease;
  align-items: center;

  &:hover {
    border-color: #4facfe;
    background: #fff;
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.1);
  }

  input,
  select {
    padding: 10px 12px;
    border-radius: 10px;
    border: 2px solid #cbd5e0;
    font-size: 0.95rem;
    background: #ffffff;
    transition: all 0.25s ease;
    width: 100%;
    min-width: 0; /* Prevent overflow */

    &:focus {
      outline: none;
      border-color: #4facfe;
      box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.15);
    }
  }

  button {
    background: #feb2b2;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.25s ease;
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:not(:disabled):hover {
      background: #e53e3e;
      color: #fff;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  /* RESPONSIVE FIXES */
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
      font-size: 14px; /* Prevents iOS zoom */
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
      border-radius: 10px;
    }
  }
`;