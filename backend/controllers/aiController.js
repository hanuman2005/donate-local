const OpenAI = require("openai");
const UpcycleIdea = require("../models/UpcycleIdea");
const crypto = require("crypto");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateUpcyclingIdeas = async (req, res) => {
  try {
    // ✅ Check API key first
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      });
    }

    const { itemLabel, condition, material } = req.body;
    const userId = req.user._id; // ✅ Get from auth middleware

    // Validate required fields
    if (!itemLabel || !condition || !material) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: itemLabel, condition, material",
      });
    }

    // Create cache key
    const cacheKey = crypto
      .createHash("md5")
      .update(`${itemLabel}-${condition}-${material}`)
      .digest("hex");

    // Check cache
    const cached = await UpcycleIdea.findOne({ cacheKey });
    if (cached) {
      return res.json({ success: true, data: cached.ideas });
    }

    // Generate ideas
    const prompt = `User has an item: "${itemLabel}", condition: "${condition}", material: "${material}". 
    
Provide 3 creative, safe, and simple upcycling ideas for a beginner. 
Output as valid JSON array with this exact structure:
[
  {
    "title": "Idea name",
    "description": "Brief description",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "materials": ["Material 1", "Material 2"],
    "difficulty": "easy",
    "timeMin": 30
  }
]

Only return the JSON array, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    // ✅ Safe JSON parsing
    let ideas;
    try {
      const content = completion.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      ideas = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return res.status(500).json({
        success: false,
        error: "Failed to parse AI response. Please try again.",
      });
    }

    // ✅ Validate response
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return res.status(500).json({
        success: false,
        error: "AI did not return valid ideas",
      });
    }

    // Cache the result
    await UpcycleIdea.create({
      cacheKey,
      itemLabel,
      condition,
      material,
      ideas,
      userId,
    });

    res.json({ success: true, data: ideas });
  } catch (error) {
    console.error("AI Upcycle Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate ideas",
    });
  }
};

module.exports = {
  generateUpcyclingIdeas,
};
