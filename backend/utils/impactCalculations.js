// backend/utils/impactCalculations.js

/**
 * Calculate environmental impact based on food category and weight
 */
const calculateFoodImpact = (category, weightKg, quantity = 1) => {
  // CO2 emissions saved (kg CO2 per kg food)
  const co2Factors = {
    'fruits': 0.9,
    'vegetables': 0.8,
    'grains': 1.5,
    'dairy': 2.5,
    'meat': 7.0,
    'bakery': 1.2,
    'canned-goods': 1.3,
    'beverages': 0.7,
    'snacks': 1.4,
    'frozen': 1.8,
    'prepared-meals': 2.2,
    'other': 1.5
  };

  // Meals provided (average 0.5kg per meal)
  const mealsPerKg = 2;

  // Get CO2 factor for category
  const co2Factor = co2Factors[category?.toLowerCase()] || co2Factors['other'];

  const totalWeight = weightKg * quantity;
  const co2Saved = totalWeight * co2Factor;
  const meals = Math.floor(totalWeight * mealsPerKg);

  return {
    wastePreventedKg: totalWeight,
    co2SavedKg: parseFloat(co2Saved.toFixed(2)),
    mealsProvided: meals,
    treesEquivalent: parseFloat((co2Saved / 21).toFixed(2)), // 21kg CO2 per tree/year
    waterSavedLiters: parseFloat((totalWeight * 50).toFixed(2)) // Rough estimate
  };
};

/**
 * Calculate impact for non-food items
 */
const calculateNonFoodImpact = (category, quantity = 1) => {
  const impactFactors = {
    'clothing': { co2: 15, water: 2700 },
    'electronics': { co2: 100, water: 500 },
    'furniture': { co2: 50, water: 1000 },
    'books': { co2: 4, water: 100 },
    'toys': { co2: 8, water: 200 },
    'household': { co2: 10, water: 300 },
    'other': { co2: 5, water: 150 }
  };

  const factor = impactFactors[category?.toLowerCase()] || impactFactors['other'];

  return {
    wastePreventedKg: quantity * 2, // Estimated 2kg per item
    co2SavedKg: factor.co2 * quantity,
    waterSavedLiters: factor.water * quantity,
    landfillSpaceSavedM3: parseFloat((quantity * 0.01).toFixed(3))
  };
};

/**
 * Aggregate user's total impact
 */
const aggregateUserImpact = (transactions) => {
  let totalWaste = 0;
  let totalCO2 = 0;
  let totalMeals = 0;
  let totalWater = 0;
  let totalTransactions = transactions.length;

  transactions.forEach(transaction => {
    if (transaction.impact) {
      totalWaste += transaction.impact.wastePreventedKg || 0;
      totalCO2 += transaction.impact.co2SavedKg || 0;
      totalMeals += transaction.impact.mealsProvided || 0;
      totalWater += transaction.impact.waterSavedLiters || 0;
    }
  });

  return {
    totalWastePreventedKg: parseFloat(totalWaste.toFixed(2)),
    totalCO2SavedKg: parseFloat(totalCO2.toFixed(2)),
    totalMealsProvided: totalMeals,
    totalWaterSavedLiters: parseFloat(totalWater.toFixed(2)),
    totalTransactions,
    treesEquivalent: parseFloat((totalCO2 / 21).toFixed(2)),
    carsOffRoadDays: Math.floor(totalCO2 / 4.6) // Average car emits 4.6 metric tons/year
  };
};

/**
 * Calculate community-wide impact
 */
const aggregateCommunityImpact = (allTransactions) => {
  const userImpacts = {};
  let totalImpact = {
    totalWastePreventedKg: 0,
    totalCO2SavedKg: 0,
    totalMealsProvided: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalWaterSavedLiters: 0
  };

  allTransactions.forEach(transaction => {
    // Track per user
    const userId = transaction.donor.toString();
    if (!userImpacts[userId]) {
      userImpacts[userId] = {
        userId,
        wasteKg: 0,
        co2Kg: 0,
        meals: 0,
        count: 0
      };
    }

    if (transaction.impact) {
      userImpacts[userId].wasteKg += transaction.impact.wastePreventedKg || 0;
      userImpacts[userId].co2Kg += transaction.impact.co2SavedKg || 0;
      userImpacts[userId].meals += transaction.impact.mealsProvided || 0;
      userImpacts[userId].count += 1;

      // Aggregate totals
      totalImpact.totalWastePreventedKg += transaction.impact.wastePreventedKg || 0;
      totalImpact.totalCO2SavedKg += transaction.impact.co2SavedKg || 0;
      totalImpact.totalMealsProvided += transaction.impact.mealsProvided || 0;
      totalImpact.totalWaterSavedLiters += transaction.impact.waterSavedLiters || 0;
    }
    totalImpact.totalTransactions += 1;
  });

  totalImpact.totalUsers = Object.keys(userImpacts).length;

  // Calculate rankings
  const topDonors = Object.values(userImpacts)
    .sort((a, b) => b.wasteKg - a.wasteKg)
    .slice(0, 10);

  return {
    totalImpact: {
      ...totalImpact,
      totalWastePreventedKg: parseFloat(totalImpact.totalWastePreventedKg.toFixed(2)),
      totalCO2SavedKg: parseFloat(totalImpact.totalCO2SavedKg.toFixed(2)),
      totalWaterSavedLiters: parseFloat(totalImpact.totalWaterSavedLiters.toFixed(2)),
      treesEquivalent: parseFloat((totalImpact.totalCO2SavedKg / 21).toFixed(2))
    },
    topDonors
  };
};

/**
 * Get impact milestones
 */
const getImpactMilestones = (totalCO2Kg) => {
  const milestones = [
    { threshold: 10, message: "🌱 First Steps!", description: "Saved 10kg CO2" },
    { threshold: 50, message: "🌿 Growing Impact!", description: "Saved 50kg CO2" },
    { threshold: 100, message: "🌳 Forest Friend!", description: "Equivalent to 5 trees" },
    { threshold: 250, message: "💚 Eco Warrior!", description: "Saved 250kg CO2" },
    { threshold: 500, message: "🌍 Planet Protector!", description: "Massive impact!" },
    { threshold: 1000, message: "⭐ Sustainability Star!", description: "1 ton CO2 saved!" }
  ];

  const achieved = milestones.filter(m => totalCO2Kg >= m.threshold);
  const next = milestones.find(m => totalCO2Kg < m.threshold);

  return {
    achieved: achieved.map(m => m.message),
    nextMilestone: next ? {
      ...next,
      progress: (totalCO2Kg / next.threshold) * 100
    } : null
  };
};

module.exports = {
  calculateFoodImpact,
  calculateNonFoodImpact,
  aggregateUserImpact,
  aggregateCommunityImpact,
  getImpactMilestones
};