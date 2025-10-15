// src/components/Footer/index.js
import React from "react";
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

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* About Section */}
        <FooterColumn>
          <FooterTitle>About Us</FooterTitle>
          <p>
            We’re building stronger communities by sharing food and resources.  
            Together, we can reduce waste and help those in need.
          </p>
        </FooterColumn>

        {/* Quick Links */}
        <FooterColumn>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/dashboard">Dashboard</FooterLink>
          <FooterLink href="/register">Get Started</FooterLink>
        </FooterColumn>

        {/* Contact */}
        <FooterColumn>
          <FooterTitle>Contact</FooterTitle>
          <p>Email: support@sharefood.com</p>
          <p>Phone: +91 98765 43210</p>
          <SocialIcons>
            <SocialIcon href="https://instagram.com" target="_blank">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://wa.me/919876543210" target="_blank">
              <FaWhatsapp />
            </SocialIcon>
            <SocialIcon href="https://github.com" target="_blank">
              <FaGithub />
            </SocialIcon>
          </SocialIcons>
        </FooterColumn>
      </FooterContent>

      {/* Bottom Bar */}
      <FooterBottom>
        <p>© {new Date().getFullYear()} ShareFood. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
