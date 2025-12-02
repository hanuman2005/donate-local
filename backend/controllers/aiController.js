const OpenAI = require('openai');
const UpcycleIdea = require('../models/UpcycleIdea');
const crypto = require('crypto');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateUpcyclingIdeas = async (req, res) => {
  try {
    const { itemLabel, condition, material, userId } = req.body;

    // Create cache key
    const cacheKey = crypto
      .createHash('md5')
      .update(`${itemLabel}-${condition}-${material}`)
      .digest('hex');

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
]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1000
    });

    const ideas = JSON.parse(completion.choices[0].message.content);

    // Cache the result
    await UpcycleIdea.create({
      cacheKey,
      itemLabel,
      condition,
      material,
      ideas,
      userId
    });

    res.json({ success: true, data: ideas });
  } catch (error) {
    console.error('AI Upcycle Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  generateUpcyclingIdeas
};
