// backend/services/contentModerationService.js - Content moderation with profanity filter and spam detection

// Common profanity words (expandable list)
const PROFANITY_LIST = [
  // Basic profanity (examples - in production use a more comprehensive list)
  "fuck",
  "shit",
  "ass",
  "bitch",
  "damn",
  "crap",
  "piss",
  "dick",
  "cock",
  "pussy",
  "bastard",
  "slut",
  "whore",
  "nigger",
  "faggot",
  "retard",
  // Add more as needed
];

// Spam patterns
const SPAM_PATTERNS = [
  /(.)\1{4,}/i, // Repeated characters (e.g., "aaaaaaa")
  /\b(buy|sell|discount|offer|free|click|winner|prize|lottery)\b.*\b(now|today|limited)\b/i,
  /\b(call|text|contact)\s*\d{10,}/i, // Phone number spam
  /\b(www\.|http|\.com|\.net|\.org)\b/i, // External URLs
  /\b(bitcoin|crypto|forex|investment)\b/i, // Financial spam
  /\b(viagra|cialis|pills|medication)\b/i, // Pharma spam
  /[A-Z]{5,}/g, // Excessive caps
  /(.+?)\1{2,}/i, // Repeated phrases
];

// Suspicious content indicators
const SUSPICIOUS_PATTERNS = [
  /\b(scam|fraud|fake|illegal)\b/i,
  /\b(password|credit.?card|bank.?account|ssn|social.?security)\b/i,
  /\b(meet|meetup|private|alone)\b.*\b(night|evening|late)\b/i,
];

/**
 * Check text for profanity
 * @param {string} text - Text to check
 * @returns {object} - { hasProfanity: boolean, flaggedWords: string[] }
 */
const checkProfanity = (text) => {
  if (!text || typeof text !== "string") {
    return { hasProfanity: false, flaggedWords: [] };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const flaggedWords = [];

  for (const word of words) {
    // Clean word of punctuation
    const cleanWord = word.replace(/[^a-z]/g, "");

    for (const profanity of PROFANITY_LIST) {
      // Check exact match
      if (cleanWord === profanity) {
        flaggedWords.push(word);
        break;
      }
      // Check if word contains profanity (for variations like "f**k")
      if (
        cleanWord.includes(profanity) &&
        cleanWord.length <= profanity.length + 2
      ) {
        flaggedWords.push(word);
        break;
      }
    }
  }

  // Also check for leetspeak variations
  const leetText = text
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .toLowerCase();

  for (const profanity of PROFANITY_LIST) {
    if (
      leetText.includes(profanity) &&
      !flaggedWords.some(
        (w) => w.toLowerCase().replace(/[^a-z]/g, "") === profanity
      )
    ) {
      flaggedWords.push(`[leetspeak: ${profanity}]`);
    }
  }

  return {
    hasProfanity: flaggedWords.length > 0,
    flaggedWords: [...new Set(flaggedWords)],
  };
};

/**
 * Check text for spam patterns
 * @param {string} text - Text to check
 * @returns {object} - { isSpam: boolean, spamScore: number, reasons: string[] }
 */
const checkSpam = (text) => {
  if (!text || typeof text !== "string") {
    return { isSpam: false, spamScore: 0, reasons: [] };
  }

  const reasons = [];
  let spamScore = 0;

  // Check against spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      spamScore += 20;
      reasons.push(
        `Matches spam pattern: ${pattern.toString().substring(0, 30)}...`
      );
    }
  }

  // Check for excessive capitalization
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5 && text.length > 20) {
    spamScore += 15;
    reasons.push("Excessive capitalization");
  }

  // Check for repeated characters or words
  if (/(.)\1{4,}/.test(text)) {
    spamScore += 10;
    reasons.push("Repeated characters detected");
  }

  // Check for too many special characters
  const specialCharRatio =
    (text.match(/[!@#$%^&*()]/g) || []).length / text.length;
  if (specialCharRatio > 0.1) {
    spamScore += 10;
    reasons.push("Too many special characters");
  }

  // Very short or very long content (for titles)
  if (text.length < 5) {
    spamScore += 5;
    reasons.push("Content too short");
  }

  return {
    isSpam: spamScore >= 30,
    spamScore,
    reasons,
  };
};

/**
 * Check text for suspicious content
 * @param {string} text - Text to check
 * @returns {object} - { isSuspicious: boolean, flags: string[] }
 */
const checkSuspiciousContent = (text) => {
  if (!text || typeof text !== "string") {
    return { isSuspicious: false, flags: [] };
  }

  const flags = [];

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(text)) {
      flags.push(
        `Matches suspicious pattern: ${pattern.toString().substring(0, 30)}`
      );
    }
  }

  // Check for contact info in description (could be bypassing the system)
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /\b\d{10,}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

  if (emailPattern.test(text)) {
    flags.push("Contains email address");
  }
  if (phonePattern.test(text)) {
    flags.push("Contains phone number");
  }

  return {
    isSuspicious: flags.length > 0,
    flags,
  };
};

/**
 * Clean text by censoring profanity
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
const censorProfanity = (text) => {
  if (!text || typeof text !== "string") {
    return text;
  }

  let cleanedText = text;

  for (const profanity of PROFANITY_LIST) {
    // Create regex for word boundaries
    const regex = new RegExp(`\\b${profanity}\\b`, "gi");
    cleanedText = cleanedText.replace(regex, "*".repeat(profanity.length));
  }

  return cleanedText;
};

/**
 * Comprehensive content moderation check
 * @param {string} title - Content title
 * @param {string} description - Content description
 * @param {object} options - Additional options
 * @returns {object} - Moderation result
 */
const moderateContent = (title, description, options = {}) => {
  const result = {
    approved: true,
    flagged: false,
    autoRejected: false,
    requiresReview: false,
    issues: [],
    score: 100, // Start with perfect score
    cleanedTitle: title,
    cleanedDescription: description,
  };

  // Check title
  if (title) {
    const titleProfanity = checkProfanity(title);
    const titleSpam = checkSpam(title);
    const titleSuspicious = checkSuspiciousContent(title);

    if (titleProfanity.hasProfanity) {
      result.issues.push({
        field: "title",
        type: "profanity",
        details: titleProfanity.flaggedWords,
      });
      result.score -= 30;
      result.flagged = true;
      result.cleanedTitle = censorProfanity(title);
    }

    if (titleSpam.isSpam) {
      result.issues.push({
        field: "title",
        type: "spam",
        details: titleSpam.reasons,
      });
      result.score -= titleSpam.spamScore;
      result.flagged = true;
    }

    if (titleSuspicious.isSuspicious) {
      result.issues.push({
        field: "title",
        type: "suspicious",
        details: titleSuspicious.flags,
      });
      result.score -= 20;
      result.requiresReview = true;
    }
  }

  // Check description
  if (description) {
    const descProfanity = checkProfanity(description);
    const descSpam = checkSpam(description);
    const descSuspicious = checkSuspiciousContent(description);

    if (descProfanity.hasProfanity) {
      result.issues.push({
        field: "description",
        type: "profanity",
        details: descProfanity.flaggedWords,
      });
      result.score -= 25;
      result.flagged = true;
      result.cleanedDescription = censorProfanity(description);
    }

    if (descSpam.isSpam) {
      result.issues.push({
        field: "description",
        type: "spam",
        details: descSpam.reasons,
      });
      result.score -= descSpam.spamScore;
      result.flagged = true;
    }

    if (descSuspicious.isSuspicious) {
      result.issues.push({
        field: "description",
        type: "suspicious",
        details: descSuspicious.flags,
      });
      result.score -= 15;
      result.requiresReview = true;
    }
  }

  // Determine final status
  if (result.score < 30) {
    result.autoRejected = true;
    result.approved = false;
  } else if (result.score < 70 || result.requiresReview) {
    result.requiresReview = true;
    result.approved = !options.strictMode; // In strict mode, require approval
  }

  return result;
};

/**
 * Check if a user should be flagged based on their content history
 * @param {string} userId - User ID
 * @param {object} Listing - Listing model
 * @returns {object} - User risk assessment
 */
const assessUserRisk = async (userId, Listing) => {
  try {
    // Get user's recent listings
    const recentListings = await Listing.find({
      donor: userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    })
      .select("moderationScore status")
      .lean();

    const flaggedCount = recentListings.filter(
      (l) => l.moderationScore && l.moderationScore < 70
    ).length;
    const totalListings = recentListings.length;

    return {
      userId,
      totalListings,
      flaggedCount,
      riskLevel:
        flaggedCount >= 3 ? "high" : flaggedCount >= 1 ? "medium" : "low",
      requiresExtraModeration: flaggedCount >= 2,
    };
  } catch (error) {
    console.error("User risk assessment error:", error);
    return {
      userId,
      riskLevel: "unknown",
      requiresExtraModeration: false,
    };
  }
};

module.exports = {
  checkProfanity,
  checkSpam,
  checkSuspiciousContent,
  censorProfanity,
  moderateContent,
  assessUserRisk,
};
