// src/pages/Home/index.js - Professional Homepage Design
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, impactAPI } from "../../services/api";
import ListingCard from "../../components/Listings/ListingCard";
import Footer from "../../components/Sidebar/Footer";
import { motionVariants } from "../../animations/motionVariants";

import {
  PageWrapper,
  HeroSection,
  HeroContent,
  HeroBadge,
  HeroTitle,
  HeroSubtitle,
  CTAGroup,
  PrimaryButton,
  SecondaryButton,
  HeroStats,
  HeroStat,
  BenefitsSection,
  SectionContent,
  SectionHeader,
  SectionLabel,
  SectionTitle,
  SectionSubtitle,
  BenefitsGrid,
  BenefitCard,
  BenefitIcon,
  BenefitTitle,
  BenefitDescription,
  HowItWorksSection,
  StepsGrid,
  StepCard,
  StepNumber,
  StepTitle,
  StepDescription,
  TestimonialsSection,
  TestimonialsGrid,
  TestimonialCard,
  TestimonialStars,
  TestimonialText,
  TestimonialAuthor,
  AuthorAvatar,
  AuthorInfo,
  SocialProofSection,
  SocialProofContent,
  SocialProofTitle,
  LogoGrid,
  TrustLogo,
  ListingsSection,
  ListingsGrid,
  ViewAllButton,
  EmptyState,
  TrustSection,
  TrustGrid,
  TrustItem,
  FinalCTASection,
  FinalCTAContent,
  FinalCTATitle,
  FinalCTASubtitle,
} from "./styledComponents";

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
