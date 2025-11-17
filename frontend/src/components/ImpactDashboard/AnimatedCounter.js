// ============================================
// src/components/ImpactDashboard/AnimatedCounter.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const CounterWrapper = styled(motion.div)`
  display: inline-block;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
`;

const AnimatedCounter = ({
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  prefix = "",
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - percentage, 3);

      const currentCount = easeOut * end;
      countRef.current = currentCount;
      setCount(currentCount);

      if (percentage < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration]);

  const formattedValue =
    decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <CounterWrapper
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </CounterWrapper>
  );
};

export default AnimatedCounter;
