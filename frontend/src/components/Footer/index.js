import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
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
import ContactModal from "../ContactModal";

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <FooterContainer>
        <FooterContent>
          {/* About Section */}
          <FooterColumn>
            <FooterTitle>About FoodShare</FooterTitle>
            <p>
              We're building stronger communities by sharing food and resources.
              Together, we can reduce waste and help those in need.
            </p>
          </FooterColumn>

          {/* Quick Links */}
          <FooterColumn>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink as={Link} to="/">Home</FooterLink>
            <FooterLink as={Link} to="/listings">Listings</FooterLink>
            <FooterLink as={Link} to="/dashboard">Dashboard</FooterLink>
            <FooterLink as={Link} to="/register">Get Started</FooterLink>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn>
            <FooterTitle>Get In Touch</FooterTitle>
            <FooterLink onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>
              📧 Contact Us
            </FooterLink>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              Email: support@sharefood.com<br />
              Phone: +91 98765 43210
            </p>
            <SocialIcons>
              <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp />
              </SocialIcon>
              <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </SocialIcon>
            </SocialIcons>
          </FooterColumn>
        </FooterContent>

        {/* Bottom Bar */}
        <FooterBottom>
          <p>© {new Date().getFullYear()} FoodShare. All rights reserved.</p>
        </FooterBottom>
      </FooterContainer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Footer;