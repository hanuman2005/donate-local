// ============================================
// src/pages/About/index.jsx - WITH MOTION
// ============================================
import styled from "styled-components";
import { motion } from "framer-motion";
import { motionVariants, useScrollAnimation } from "../../animations/motionVariants";

const AboutContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 80px;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled(motion.div)`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;

  h2 {
    color: #2d3748;
    margin: 2rem 0 1rem;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;

const Section = styled(motion.div)``;

const About = () => {
  const scrollAnimation = useScrollAnimation();

  return (
    <AboutContainer
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <Title variants={motionVariants.fadeSlideDown}>
        🍎 About FoodShare
      </Title>
      
      <Content variants={motionVariants.staggerContainer} initial="hidden" animate="show">
        <Section variants={motionVariants.fadeSlideUp}>
          <h2>Our Mission</h2>
          <p>
            FoodShare is a community-driven platform dedicated to reducing food
            waste and fighting hunger. We connect generous food donors with
            individuals and families in need, creating a sustainable cycle of
            sharing and caring.
          </p>
        </Section>

        <Section variants={motionVariants.fadeSlideUp}>
          <h2>How It Works</h2>
          <p>
            <strong>For Donors:</strong> If you have excess food, simply create a
            listing with details about the food item, quantity, and pickup
            location. Recipients in your area can express interest, and you can
            arrange the handover.
          </p>
          <p>
            <strong>For Recipients:</strong> Browse available food donations in
            your area, express interest in items you need, and coordinate pickup
            with the donor.
          </p>
        </Section>

        <Section variants={motionVariants.fadeSlideUp}>
          <h2>Our Impact</h2>
          <p>
            Together, we're making a difference by preventing thousands of pounds
            of food from going to waste while ensuring no one in our community
            goes hungry.
          </p>
        </Section>

        <Section variants={motionVariants.fadeSlideUp}>
          <h2>Join Us</h2>
          <p>
            Whether you have food to share or need assistance, you're welcome
            here. Together, we can build a stronger, more caring community.
          </p>
        </Section>
      </Content>
    </AboutContainer>
  );
};

export default About;
