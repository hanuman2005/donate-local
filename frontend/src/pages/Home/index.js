// src/pages/Home/index.js - Professional Homepage Design
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, impactAPI } from "../../services/api";
import ListingCard from "../../components/Listings/ListingCard";
import Footer from "../../components/Sidebar/Footer";
import { motionVariants } from "../../animations/motionVariants";

// ==================== STYLED COMPONENTS ====================

const shouldForwardProp = (prop) =>
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

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
`;

// Hero Section - Above the Fold
const HeroSection = styled.section`
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

const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroBadge = styled(motion.div).withConfig({ shouldForwardProp })`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  border: 1px solid var(--primary-dark);
  color: var(--text-inverse);
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  letter-spacing: 0.5px;
`;

const HeroTitle = styled(motion.h1).withConfig({ shouldForwardProp })`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: var(--text-inverse);
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);

  span {
    background: var(--primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: var(--primary-light);
    font-weight: 900;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }
`;

const HeroSubtitle = styled(motion.p).withConfig({ shouldForwardProp })`
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--text-inverse);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
`;

const CTAGroup = styled(motion.div).withConfig({ shouldForwardProp })`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion.button).withConfig({ shouldForwardProp })`
  background: var(--gradient-primary);
  color: var(--text-inverse);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s;

  &:hover {
    box-shadow: var(--shadow-xl);
  }
`;

const SecondaryButton = styled(motion.button).withConfig({ shouldForwardProp })`
  background: var(--bg-card);
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid var(--primary);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;

  &:hover {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary-dark);
  }
`;

const HeroStats = styled(motion.div).withConfig({ shouldForwardProp })`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 2rem;
  }
`;

const HeroStat = styled.div`
  text-align: center;

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
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }
`;

// Social Proof Section
const SocialProofSection = styled.section`
  background: var(--bg-secondary);
  padding: 4rem 2rem;
  border-bottom: 1px solid var(--border-color);
`;

const SocialProofContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const SocialProofTitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
`;

const LogoGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
  opacity: 0.6;
`;

const TrustLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Benefits Section
const BenefitsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-primary);
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
`;

const SectionLabel = styled.span`
  display: inline-block;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const BenefitCard = styled(motion.div).withConfig({ shouldForwardProp })`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: ${(props) =>
    props.$gradient || "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(
    180deg,
    var(--bg-secondary) 0%,
    var(--bg-primary) 100%
  );
`;

const StepsGrid = styled.div`
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

const StepCard = styled(motion.div).withConfig({ shouldForwardProp })`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 280px;
  margin: 0 auto;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-primary);
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled(motion.div).withConfig({ shouldForwardProp })`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
`;

const TestimonialStars = styled.div`
  color: #fbbf24;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
`;

const AuthorInfo = styled.div`
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
const ListingsSection = styled.section`
  padding: 6rem 2rem;
  background: var(--bg-secondary);
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ViewAllButton = styled(motion.button).withConfig({ shouldForwardProp })`
  display: block;
  margin: 3rem auto 0;
  background: transparent;
  color: var(--primary);
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: 2px solid var(--primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--primary);
    color: white;
  }
`;

// Trust Signals Section
const TrustSection = styled.section`
  padding: 4rem 2rem;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
`;

const TrustGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
`;

const TrustItem = styled.div`
  text-align: center;

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

// Final CTA Section
const FinalCTASection = styled.section`
  padding: 6rem 2rem;
  background: var(--gradient-primary);
  text-align: center;
  color: var(--text-inverse);
`;

const FinalCTAContent = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const FinalCTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--text-inverse);
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
`;

const FinalCTASubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: 20px;
  border: 2px dashed var(--border-color);
  max-width: 500px;
  margin: 0 auto;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
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

// ==================== COMPONENT ====================

const Home = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 2500,
    itemsRescued: 8400,
    co2Saved: 12500,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes] = await Promise.all([
        listingsAPI.getAll({
          limit: 6,
          status: "available",
          sort: "-createdAt",
        }),
      ]);

      // API returns { success, listings } or axios wraps it in data
      const responseData = listingsRes.data || listingsRes;
      const listings = responseData?.listings || responseData?.data || [];
      console.log("Fetched listings:", listings.length, listings);
      setRecentListings(listings);

      // Try to get real stats
      try {
        const impactRes = await impactAPI.getCommunityImpact();
        const impactData = impactRes.data || impactRes;
        if (impactData) {
          setStats({
            users: impactData.totalUsers || 2500,
            itemsRescued: impactData.totalItemsRescued || 8400,
            co2Saved: impactData.totalCO2Saved || 12500,
          });
        }
      } catch (e) {
        // Use default stats
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  const benefits = [
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description:
        "Snap a photo and our AI instantly identifies items, suggests upcycling ideas, and finds recycling options.",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },
    {
      icon: "🌍",
      title: "Track Your Impact",
      description:
        "See exactly how much CO₂ you've saved, waste you've prevented, and your contribution to a cleaner planet.",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      icon: "🤝",
      title: "Community Connection",
      description:
        "Connect with neighbors who need what you have. Real-time chat, easy scheduling, and verified pickups.",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      icon: "📍",
      title: "Local First",
      description:
        "Find recycling centers, donation points, and community members within your area. Reduce transport emissions.",
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    },
    {
      icon: "🔒",
      title: "Secure & Verified",
      description:
        "QR code verification, user ratings, and secure messaging. Every transaction is tracked and verified.",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      icon: "📊",
      title: "Smart Scheduling",
      description:
        "Flexible pickup times, route optimization, and calendar integration. Make donating as easy as possible.",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    },
  ];

  const testimonials = [
    {
      text: "I've donated over 50 items that would have gone to landfill. The AI suggestions helped me upcycle old furniture into something amazing!",
      author: "Sarah M.",
      role: "Eco-conscious Mom",
      initial: "S",
    },
    {
      text: "As a small nonprofit, this platform has been a game-changer. We've received donations that directly help families in need.",
      author: "David K.",
      role: "Community Center Director",
      initial: "D",
    },
    {
      text: "The impact tracking feature is incredible. Seeing the real CO₂ savings motivates me to keep reducing waste every day.",
      author: "Priya R.",
      role: "Environmental Advocate",
      initial: "P",
    },
  ];

  return (
    <PageWrapper
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* ========== HERO - Above the Fold ========== */}
      <HeroSection
        as={motion.section}
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <HeroContent>
          <HeroBadge
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
          >
            ♻️ Join {stats.users.toLocaleString()}+ eco-warriors
          </HeroBadge>

          <HeroTitle
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            Turn Unused Items Into <span>Environmental Impact</span>
          </HeroTitle>

          <HeroSubtitle
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            The AI-powered platform that helps you donate, recycle, and upcycle
            items — connecting you with people who need what you have while
            tracking your real environmental impact.
          </HeroSubtitle>

          <CTAGroup
            variants={motionVariants.staggerContainerFast}
            initial="hidden"
            animate="show"
          >
            <PrimaryButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {user ? "Go to Dashboard" : "Start Free Today"} →
            </PrimaryButton>

            <SecondaryButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              onClick={() => navigate("/listings")}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse Items
            </SecondaryButton>
          </CTAGroup>

          <HeroStats
            variants={motionVariants.staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={motionVariants.scaleIn}>
              <HeroStat>
                <span className="number">
                  {stats.itemsRescued.toLocaleString()}+
                </span>
                <span className="label">Items Rescued</span>
              </HeroStat>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <HeroStat>
                <span className="number">
                  {stats.co2Saved.toLocaleString()}kg
                </span>
                <span className="label">CO₂ Prevented</span>
              </HeroStat>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <HeroStat>
                <span className="number">{stats.users.toLocaleString()}+</span>
                <span className="label">Active Users</span>
              </HeroStat>
            </motion.div>
          </HeroStats>
        </HeroContent>
      </HeroSection>

      {/* ========== BENEFITS ========== */}
      <BenefitsSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionContent>
          <SectionHeader
            as={motion.div}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <SectionLabel>Why Choose Us</SectionLabel>
            <SectionTitle>Everything you need to reduce waste</SectionTitle>
            <SectionSubtitle>
              More than a donation platform. We're a complete ecosystem for
              sustainable living.
            </SectionSubtitle>
          </SectionHeader>

          <BenefitsGrid
            as={motion.div}
            variants={motionVariants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                variants={motionVariants.scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BenefitIcon $gradient={benefit.gradient}>
                  {benefit.icon}
                </BenefitIcon>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
              </BenefitCard>
            ))}
          </BenefitsGrid>
        </SectionContent>
      </BenefitsSection>

      {/* ========== HOW IT WORKS ========== */}
      <HowItWorksSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionContent>
          <SectionHeader
            as={motion.div}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <SectionLabel>How It Works</SectionLabel>
            <SectionTitle>Get started in 3 simple steps</SectionTitle>
            <SectionSubtitle>
              From upload to impact in minutes. No complicated processes.
            </SectionSubtitle>
          </SectionHeader>

          <StepsGrid
            as={motion.div}
            variants={motionVariants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <StepCard
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <StepNumber>1</StepNumber>
              <StepTitle>Snap & Upload</StepTitle>
              <StepDescription>
                Take a photo of your item. Our AI instantly analyzes it and
                suggests the best options.
              </StepDescription>
            </StepCard>

            <StepCard
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <StepNumber>2</StepNumber>
              <StepTitle>Choose Your Path</StepTitle>
              <StepDescription>
                Donate to someone in need, find recycling centers, or get
                creative upcycling ideas.
              </StepDescription>
            </StepCard>

            <StepCard
              variants={motionVariants.scaleIn}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <StepNumber>3</StepNumber>
              <StepTitle>Make Impact</StepTitle>
              <StepDescription>
                Schedule a pickup, track your environmental impact, and earn
                recognition for your efforts.
              </StepDescription>
            </StepCard>
          </StepsGrid>
        </SectionContent>
      </HowItWorksSection>

      {/* ========== TESTIMONIALS ========== */}
      <TestimonialsSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionContent>
          <SectionHeader
            as={motion.div}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <SectionLabel>Testimonials</SectionLabel>
            <SectionTitle>Loved by our community</SectionTitle>
            <SectionSubtitle>
              See what others are saying about their experience.
            </SectionSubtitle>
          </SectionHeader>

          <TestimonialsGrid
            as={motion.div}
            variants={motionVariants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                variants={motionVariants.scaleIn}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <TestimonialStars>★★★★★</TestimonialStars>
                <TestimonialText>"{testimonial.text}"</TestimonialText>
                <TestimonialAuthor>
                  <AuthorAvatar>{testimonial.initial}</AuthorAvatar>
                  <AuthorInfo>
                    <div className="name">{testimonial.author}</div>
                    <div className="role">{testimonial.role}</div>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
        </SectionContent>
      </TestimonialsSection>

      {/* ========== SOCIAL PROOF ========== */}
      <SocialProofSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SocialProofContent>
          <SocialProofTitle>Trusted by communities everywhere</SocialProofTitle>
          <LogoGrid
            as={motion.div}
            variants={motionVariants.staggerContainerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={motionVariants.scaleIn}>
              <TrustLogo>🏛️ Local Councils</TrustLogo>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <TrustLogo>🏢 NGOs</TrustLogo>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <TrustLogo>🏫 Schools</TrustLogo>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <TrustLogo>🏪 Local Businesses</TrustLogo>
            </motion.div>
            <motion.div variants={motionVariants.scaleIn}>
              <TrustLogo>🏠 Neighborhoods</TrustLogo>
            </motion.div>
          </LogoGrid>
        </SocialProofContent>
      </SocialProofSection>

      {/* ========== RECENT LISTINGS ========== */}
      <ListingsSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionContent>
          <SectionHeader
            as={motion.div}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <SectionLabel>Available Now</SectionLabel>
            <SectionTitle>Items ready for a new home</SectionTitle>
            <SectionSubtitle>
              Browse items donated by your community. Claim what you need.
            </SectionSubtitle>
          </SectionHeader>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "3rem" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ fontSize: "2rem" }}
                >
                  ⏳
                </motion.div>
              </motion.div>
            ) : recentListings.length > 0 ? (
              <motion.div
                key="listings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ListingsGrid
                  as={motion.div}
                  variants={motionVariants.staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {recentListings.map((listing, index) => (
                    <motion.div
                      key={listing._id}
                      variants={motionVariants.listItemSlideUp}
                      custom={index}
                    >
                      <ListingCard listing={listing} showQuickClaim={!user} />
                    </motion.div>
                  ))}
                </ListingsGrid>
                <motion.div
                  style={{ textAlign: "center", marginTop: "2rem" }}
                  variants={motionVariants.fadeSlideUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <ViewAllButton
                    onClick={() => navigate("/listings")}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Items →
                  </ViewAllButton>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                variants={motionVariants.scalePop}
                initial="hidden"
                animate="show"
              >
                <EmptyState>
                  <div className="icon">🌱</div>
                  <h3>Be the first contributor!</h3>
                  <p>
                    No items available yet. Start the circular economy in your
                    area.
                  </p>
                </EmptyState>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionContent>
      </ListingsSection>

      {/* ========== TRUST SIGNALS ========== */}
      <TrustSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <TrustGrid
          as={motion.div}
          variants={motionVariants.staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={motionVariants.scaleIn}>
            <TrustItem>
              <div className="icon">🔒</div>
              <div className="label">Secure Transactions</div>
            </TrustItem>
          </motion.div>
          <motion.div variants={motionVariants.scaleIn}>
            <TrustItem>
              <div className="icon">✓</div>
              <div className="label">Verified Users</div>
            </TrustItem>
          </motion.div>
          <motion.div variants={motionVariants.scaleIn}>
            <TrustItem>
              <div className="icon">📱</div>
              <div className="label">QR Verification</div>
            </TrustItem>
          </motion.div>
          <motion.div variants={motionVariants.scaleIn}>
            <TrustItem>
              <div className="icon">🌍</div>
              <div className="label">Eco-Certified</div>
            </TrustItem>
          </motion.div>
          <motion.div variants={motionVariants.scaleIn}>
            <TrustItem>
              <div className="icon">💬</div>
              <div className="label">24/7 Support</div>
            </TrustItem>
          </motion.div>
        </TrustGrid>
      </TrustSection>

      {/* ========== FINAL CTA ========== */}
      <FinalCTASection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <FinalCTAContent>
          <motion.div
            variants={motionVariants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={motionVariants.fadeSlideUp}>
              <FinalCTATitle>Ready to make a difference?</FinalCTATitle>
            </motion.div>
            <motion.div variants={motionVariants.fadeSlideUp}>
              <FinalCTASubtitle>
                Join thousands of eco-conscious individuals building a
                waste-free future.
              </FinalCTASubtitle>
            </motion.div>

            <CTAGroup
              as={motion.div}
              variants={motionVariants.staggerContainerFast}
            >
              <PrimaryButton
                as={motion.button}
                variants={motionVariants.scaleIn}
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                {user ? "Go to Dashboard" : "Get Started Free"} →
              </PrimaryButton>

              <SecondaryButton
                as={motion.button}
                variants={motionVariants.scaleIn}
                onClick={() => navigate("/impact/community")}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                See Community Impact
              </SecondaryButton>
            </CTAGroup>
          </motion.div>
        </FinalCTAContent>
      </FinalCTASection>

      {/* ========== FOOTER ========== */}
      <motion.div
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </PageWrapper>
  );
};

export default Home;
