// src/components/FiltersPanel/styledComponents.js
import styled from "styled-components";

export const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: #374151;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: #fff;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

export const Button = styled.button`
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;
