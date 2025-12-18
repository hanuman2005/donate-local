// ============================================
// src/components/ImpactDashboard/ImpactCard.jsx - WITH MOTION
// ============================================
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const Card = styled(motion.div)`
  background: ${props => props.$gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

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

const Icon = styled(motion.div)`
  font-size: 3rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const Value = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const Label = styled(motion.div)`
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

const Subtitle = styled(motion.div)`
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
    <Card 
      $gradient={gradient}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
        scale: 1.02 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Icon
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          repeatDelay: 2
        }}
      >
        {icon}
      </Icon>
      <Value
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatedCounter 
          end={value} 
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
        />
      </Value>
      <Label
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {label}
      </Label>
      {subtitle && (
        <Subtitle
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </Subtitle>
      )}
    </Card>
  );
};

export default ImpactCard;