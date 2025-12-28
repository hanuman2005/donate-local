import styled, { keyframes } from "styled-components";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

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

// =====================
// Animations
// =====================
export const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
`;

export const slideInFromRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
`;

// =====================
// Styled Components
// =====================
export const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    animation: ${float} 20s ease-in-out infinite;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

export const Hero = styled(motion.div)`
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4rem;
  position: relative;
`;

export const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-shadow: none;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-shadow: none;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: 24px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px ${({ theme }) => theme.colors.shadow};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  position: relative;
  overflow: hidden;
`;

export const UploadZone = styled.div`
  border: 3px dashed ${(props) => (props.$isDragging ? "#4299e1" : "#cbd5e0")};
  border-radius: 16px;
  padding: 3rem 1.5rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }

  .icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  h3 {
    font-size: 1.75rem;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

export const ImageCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
`;

export const ImageNumber = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
`;

export const RemoveImageButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(229, 62, 62, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

export const UploadInfo = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.95rem;

  strong {
    color: #667eea;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled(motion.button)`
  flex: 1;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$primary
      ? `
    background: ${({ theme }) => theme.colors.info};
    color: #fff;
    box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
    &:hover {
      background: ${({ theme }) => theme.colors.info};
      box-shadow: 0 4px 16px ${({ theme }) => theme.colors.shadowHover};
      transform: translateY(-2px);
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: #edf2f7;
    color: #2d3748;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    &:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
  `}
`;

export const ResultsCard = styled(Card)`
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.textPrimary};
  animation: ${slideInFromRight} 0.5s ease-out;
`;

export const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  color: ${({ theme }) => theme.colors.textPrimary};
  .confetti-wrapper {
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 200px;
    pointer-events: none;
    overflow: hidden;
  }
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--danger-bg);
    color: var(--text-inverse);
  }
`;

export const SuccessBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const ItemName = styled(motion.h2)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 1rem 0;
  font-weight: 900;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const MaterialTag = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.info};
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`;

export const ConfidenceBar = styled.div`
  margin: 1.5rem auto;
  max-width: 400px;

  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
  }

  .bar-container {
    height: 12px;
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-radius: 50px;
    overflow: hidden;
    position: relative;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.success} 0%,
      ${({ theme }) => theme.colors.info} 100%
    );
    border-radius: 50px;
    transition: width 1s ease-out;
    position: relative;
    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 100%
      );
      animation: ${shimmer} 2s infinite;
    }
  }
`;

export const ImageCarousel = styled.div`
  position: relative;
  margin: 2rem 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const CarouselImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  display: block;
  background: #000;
`;

export const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const CarouselDot = styled.button.withConfig({ shouldForwardProp })`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) => (props.$active ? "#667eea" : "#cbd5e0")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    background: #667eea;
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  backdrop-filter: blur(10px);
`;

export const EnhancedAnalysisBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  margin: 1rem 0;
  font-weight: 700;

  span {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

export const SectionCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .icon {
      font-size: 3rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    h3 {
      font-size: 1.5rem;
      color: #2d3748;
      margin: 0;
      font-weight: 700;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 1rem;
      margin-bottom: 0.75rem;
      color: #4a5568;
      font-size: 1.05rem;
      display: flex;
      align-items: start;
      gap: 1rem;
      background: linear-gradient(135deg, #f7fafc, #edf2f7);
      border-radius: 12px;
      border-left: 4px solid #48bb78;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #edf2f7, #e2e8f0);
        transform: translateX(5px);
      }

      &:before {
        content: "✓";
        color: #48bb78;
        font-weight: bold;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
    }
  }

  .recycling-text {
    color: #4a5568;
    line-height: 1.8;
    font-size: 1.05rem;
    background: linear-gradient(135deg, #f7fafc, #edf2f7);
    padding: 1.5rem;
    border-radius: 16px;
    border-left: 4px solid #667eea;
  }
`;

export const ImpactSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32px;
  padding: 3rem;
  color: white;
  margin: 3rem 0;
  text-align: center;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 30px 30px;
    animation: ${float} 15s ease-in-out infinite;
  }

  h3 {
    font-size: 2.5rem;
    margin: 0 0 2.5rem 0;
    font-weight: 900;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }
`;

export const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

export const ImpactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }

  .value {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  .label {
    font-size: 1.1rem;
    opacity: 0.95;
    font-weight: 600;
  }
`;

export const MotivationBanner = styled(motion.div)`
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
  animation: ${glow} 2s ease-in-out infinite;
`;

export const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const LoadingCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 4rem 3rem;
  text-align: center;
  max-width: 500px;
  margin: 0 1rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);

  .spinner {
    width: 80px;
    height: 80px;
    border: 6px solid #e2e8f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  h3 {
    font-size: 2rem;
    margin: 0 0 0.75rem;
    color: #2d3748;
    font-weight: 700;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin: 0;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;
