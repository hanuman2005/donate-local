
// ============================================
// src/components/Footer/index.jsx - WITH MOTION
// ============================================
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
import { motionVariants } from "../../../animations/motionVariants";
import {
  FooterContainer,
  FooterContent,
  FooterColumn,
  FooterTitle,
  FooterLink,
  SocialIcons,
  SocialIcon,
  FooterBottom,
} from "./styledComponents";
import ContactModal from "../../Modals/ContactModal";

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <FooterContainer
        as={motion.footer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <FooterContent
          as={motion.div}
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <FooterColumn as={motion.div} variants={motionVariants.fadeSlideUp}>
            <FooterTitle>About FoodShare</FooterTitle>
            <p>
              We're building stronger communities by sharing food and resources.
              Together, we can reduce waste and help those in need.
            </p>
          </FooterColumn>

          <FooterColumn as={motion.div} variants={motionVariants.fadeSlideUp}>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink as={Link} to="/">Home</FooterLink>
            <FooterLink as={Link} to="/listings">Listings</FooterLink>
            <FooterLink as={Link} to="/dashboard">Dashboard</FooterLink>
            <FooterLink as={Link} to="/get-started">Get Started</FooterLink>
          </FooterColumn>

          <FooterColumn as={motion.div} variants={motionVariants.fadeSlideUp}>
            <FooterTitle>Get In Touch</FooterTitle>
            <FooterLink onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>
              📧 Contact Us
            </FooterLink>
            <p>
              Email: support@sharefood.com<br />
              Phone: +91 98765 43210
            </p>

            <SocialIcons>
              <SocialIcon 
                as={motion.a}
                href="https://instagram.com" 
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram />
              </SocialIcon>
              <SocialIcon 
                as={motion.a}
                href="https://wa.me/919876543210" 
                target="_blank"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaWhatsapp />
              </SocialIcon>
              <SocialIcon 
                as={motion.a}
                href="https://github.com" 
                target="_blank"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub />
              </SocialIcon>
            </SocialIcons>
          </FooterColumn>
        </FooterContent>

        <FooterBottom
          as={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p>© {new Date().getFullYear()} FoodShare. All rights reserved.</p>
        </FooterBottom>
      </FooterContainer>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Footer;