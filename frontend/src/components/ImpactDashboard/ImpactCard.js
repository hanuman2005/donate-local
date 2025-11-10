// src/components/ImpactDashboard/ImpactCard.jsx
import React from 'react';
import styled from 'styled-components';
import AnimatedCounter from './AnimatedCounter';

const Card = styled.div`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const Value = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const Label = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  position: relative;
  z-index: 1;
`;

const ImpactCard = ({ 
  icon, 
  value, 
  label, 
  subtitle, 
  gradient, 
  decimals = 0,
  suffix = '',
  prefix = ''
}) => {
  return (
    <Card $gradient={gradient}>
      <Icon>{icon}</Icon>
      <Value>
        <AnimatedCounter 
          end={value} 
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
        />
      </Value>
      <Label>{label}</Label>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Card>
  );
};

export default ImpactCard;