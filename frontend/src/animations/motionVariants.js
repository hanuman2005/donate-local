// ===================================
// 📦 INSTALLATION FIRST
// ===================================
// Run this in your terminal:
// cd client
// npm install framer-motion

// ===================================
// 🎨 Motion Variants Library
// client/src/animations/motionVariants.js
// ===================================

// Reusable animation variants for consistent motion across the app
export const motionVariants = {
  // ===== PAGE TRANSITIONS =====
  pageTransition: {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96] // Custom easing
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  },

  // ===== FADE & SLIDE =====
  fadeSlide: {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  fadeSlideUp: {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  },

  fadeSlideDown: {
    hidden: { opacity: 0, y: -30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  fadeSlideLeft: {
    hidden: { opacity: 0, x: -40 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  fadeSlideRight: {
    hidden: { opacity: 0, x: 40 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  // ===== SCALE ANIMATIONS =====
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  },

  scalePop: {
    hidden: { opacity: 0, scale: 0.5 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  },

  // ===== STAGGER CONTAINERS =====
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  staggerContainerFast: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    }
  },

  staggerContainerSlow: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  },

  // ===== LIST ITEM ANIMATIONS =====
  listItem: {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  listItemSlideUp: {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    }
  },

  // ===== HOVER ANIMATIONS =====
  hoverLift: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { scale: 0.98, y: 0 }
  },

  hoverScale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { scale: 0.95 }
  },

  // ===== DROPDOWN =====
  dropDownSpring: {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },

  // ===== MODAL =====
  modalBackdrop: {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.25 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },

  modalContent: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    show: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  },

  // ===== TABS =====
  tabContent: {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  },

  // ===== PULSE (for live updates) =====
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // ===== SHIMMER (loading) =====
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // ===== BOUNCE =====
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // ===== ROTATE =====
  rotate: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
};

// ===================================
// 🎯 Custom Hook for Scroll Animations
// ===================================
export const useScrollAnimation = (threshold = 0.1) => {
  return {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, amount: threshold }
  };
};

// ===================================
// 🎭 Transition Presets
// ===================================
export const transitionPresets = {
  smooth: {
    type: "spring",
    stiffness: 120,
    damping: 18
  },
  
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 25
  },
  
  bouncy: {
    type: "spring",
    stiffness: 200,
    damping: 15
  },
  
  gentle: {
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96]
  },
  
  quick: {
    duration: 0.2,
    ease: "easeOut"
  }
};

// ===================================
// 🎨 Layout Animations
// ===================================
export const layoutTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export default motionVariants;