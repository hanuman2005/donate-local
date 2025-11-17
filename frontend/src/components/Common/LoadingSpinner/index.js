// ============================================
// src/components/LoadingSpinner/index.jsx - WITH MOTION
// ============================================
import React from "react";
import { motion } from "framer-motion";
import {
  SpinnerContainer,
  Spinner,
  SpinnerText,
  FullPageSpinner,
} from "./styledComponents";

const LoadingSpinner = ({
  size = "medium",
  text = "Loading...",
  fullPage = false,
  color = "#4facfe",
}) => {
  if (fullPage) {
    return (
      <FullPageSpinner
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Spinner size={size} color={color} />
        <SpinnerText
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </SpinnerText>
      </FullPageSpinner>
    );
  }

  return (
    <SpinnerContainer
      as={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Spinner size={size} color={color} />
      {text && <SpinnerText>{text}</SpinnerText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
