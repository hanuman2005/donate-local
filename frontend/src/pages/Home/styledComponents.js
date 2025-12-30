import styled from "styled-components";
import { motion } from "framer-motion";

export const shouldForwardProp = (prop) =>
  ![
    "whileHover",
    "whileTap",
    "whileInView",
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "viewport",
  ].includes(prop);

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
`;

// Hero Section - Above the Fold
export const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--gradient-primary);
  overflow: hidden;
  padding: 2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
  }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 2;
`;

export const HeroBadge = styled(motion.div).withConfig({ shouldForwardProp })`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--text-inverse);
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-full);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
`;

export const HeroTitle = styled(motion.h1).withConfig({ shouldForwardProp })`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: var(--text-inverse);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);

  span {
    color: var(--primary-light);
    font-weight: 900;
  }
`;

export const HeroSubtitle = styled(motion.p).withConfig({ shouldForwardProp })`
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--text-inverse);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  opacity: 0.95;
`;

export const CTAGroup = styled(motion.div).withConfig({ shouldForwardProp })`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled(motion.button).withConfig({
  shouldForwardProp,
})`
  background: var(--bg-card);
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid var(--primary-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-xl);
    background: var(--primary);
    color: var(--text-inverse);
    transform: translateY(-2px);
  }
`;

export const SecondaryButton = styled(motion.button).withConfig({
  shouldForwardProp,
})`
  background: transparent;
  color: var(--text-inverse);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid var(--text-inverse);
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-base);
  backdrop-filter: blur(10px);

  &:hover {
    background: var(--text-inverse);
    color: var(--primary);
    transform: translateY(-2px);
  }
`;

export const HeroStats = styled(motion.div).withConfig({ shouldForwardProp })`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 2rem;
  }
`;

export const HeroStat = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-inverse);
    display: block;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }

  .label {
    font-size: 1rem;
    color: var(--text-inverse);
    margin-top: 0.25rem;
    opacity: 0.9;
  }
`;

// Social Proof Section
export const SocialProofSection = styled.section`
  background: var(--bg-secondary);
  padding: 4rem 2rem;
  border-bottom: 1px solid var(--border-color);
`;

export const SocialProofContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

export const SocialProofTitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  font-weight: 600;
`;

export const LogoGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
  opacity: 0.6;
`;

export const TrustLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Benefits Section
export const BenefitsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-primary);
`;

export const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
`;

export const SectionLabel = styled.span`
  display: inline-block;
  background: var(--gradient-subtle);
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const BenefitCard = styled(motion.div).withConfig({ shouldForwardProp })`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-xl);
    transform: translateY(-5px);
  }
`;

export const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-xl);
  background: ${(props) => props.$gradient || "var(--gradient-primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
`;

export const BenefitTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

export const BenefitDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

// How It Works Section
export const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(
    180deg,
    var(--bg-secondary) 0%,
    var(--bg-primary) 100%
  );
`;

export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50px;
    left: 15%;
    right: 15%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--primary),
      transparent
    );
    z-index: 0;

    @media (max-width: 900px) {
      display: none;
    }
  }
`;

export const StepCard = styled(motion.div).withConfig({ shouldForwardProp })`
  text-align: center;
  position: relative;
  z-index: 1;
`;

export const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--text-inverse);
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: var(--shadow-lg);
`;

export const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

export const StepDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 280px;
  margin: 0 auto;
`;

// Testimonials Section
export const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-primary);
`;

export const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const TestimonialCard = styled(motion.div).withConfig({
  shouldForwardProp,
})`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  transition: all var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-5px);
  }
`;

export const TestimonialStars = styled.div`
  color: var(--warning);
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

export const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: var(--shadow-md);
`;

export const AuthorInfo = styled.div`
  .name {
    font-weight: 600;
    color: var(--text-primary);
  }

  .role {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
`;

// Listings Preview Section
export const ListingsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-secondary);
`;

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ViewAllButton = styled(motion.button).withConfig({
  shouldForwardProp,
})`
  display: block;
  margin: 3rem auto 0;
  background: transparent;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid var(--primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--primary);
    color: var(--text-inverse);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

// Trust Signals Section
export const TrustSection = styled.section`
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
`;

export const TrustGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
`;

export const TrustItem = styled.div`
  text-align: center;

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    color: var(--primary);
  }

  .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

// Final CTA Section
export const FinalCTASection = styled.section`
  padding: 6rem 2rem;
  background: var(--gradient-primary);
  text-align: center;
  color: var(--text-inverse);
`;

export const FinalCTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

export const FinalCTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--text-inverse);
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

export const FinalCTASubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-inverse);
  margin-bottom: 2.5rem;
  opacity: 0.95;
  line-height: 1.7;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
  max-width: 500px;
  margin: 0 auto;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
  }
`;