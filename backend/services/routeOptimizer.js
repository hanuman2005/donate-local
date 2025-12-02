// backend/services/routeOptimizer.js
// 🚀 HYPER-LOCAL RESOURCE OPTIMIZER WITH AI ROUTE PLANNING

/**
 * ADVANCED ROUTE OPTIMIZATION SERVICE
 * - K-Means Clustering for pickup grouping
 * - Traveling Salesman Problem (TSP) solver
 * - Real-time CO2 emissions calculation
 * - Multi-vehicle fleet management
 */

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * K-Means Clustering Algorithm
 * Groups nearby pickups into clusters for efficient routing
 */
class KMeansClustering {
  constructor(k, maxIterations = 50) {
    this.k = k;
    this.maxIterations = maxIterations;
  }

  /**
   * Cluster pickups based on geographic proximity
   * @param {Array} pickups - Array of pickup objects with lat/lon
   * @returns {Array} Clustered pickups
   */
  cluster(pickups) {
    if (pickups.length <= this.k) {
      // If fewer pickups than clusters, each pickup is its own cluster
      return pickups.map((pickup, index) => ({
        ...pickup,
        cluster: index
      }));
    }

    // Initialize centroids randomly
    let centroids = this.initializeCentroids(pickups);
    let iterations = 0;
    let converged = false;

    while (!converged && iterations < this.maxIterations) {
      // Assign each pickup to nearest centroid
      const clusters = this.assignToClusters(pickups, centroids);
      
      // Calculate new centroids
      const newCentroids = this.calculateCentroids(clusters);
      
      // Check convergence
      converged = this.hasConverged(centroids, newCentroids);
      
      centroids = newCentroids;
      iterations++;
    }

    // Final assignment
    return this.assignToClusters(pickups, centroids);
  }

  initializeCentroids(pickups) {
    // Use K-Means++ initialization for better convergence
    const centroids = [];
    
    // First centroid: random pickup
    centroids.push({
      lat: pickups[Math.floor(Math.random() * pickups.length)].lat,
      lon: pickups[Math.floor(Math.random() * pickups.length)].lon
    });

    // Subsequent centroids: weighted by distance
    while (centroids.length < this.k) {
      const distances = pickups.map(pickup => {
        const minDist = Math.min(...centroids.map(c => 
          haversineDistance(pickup.lat, pickup.lon, c.lat, c.lon)
        ));
        return minDist * minDist; // Square for weighted probability
      });

      const totalDist = distances.reduce((sum, d) => sum + d, 0);
      const rand = Math.random() * totalDist;
      
      let cumulative = 0;
      for (let i = 0; i < pickups.length; i++) {
        cumulative += distances[i];
        if (cumulative >= rand) {
          centroids.push({
            lat: pickups[i].lat,
            lon: pickups[i].lon
          });
          break;
        }
      }
    }

    return centroids;
  }

  assignToClusters(pickups, centroids) {
    return pickups.map(pickup => {
      let minDist = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, index) => {
        const dist = haversineDistance(
          pickup.lat, pickup.lon,
          centroid.lat, centroid.lon
        );
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = index;
        }
      });

      return {
        ...pickup,
        cluster: clusterIndex,
        distanceToClusterCenter: minDist
      };
    });
  }

  calculateCentroids(clusters) {
    const centroids = [];
    
    for (let i = 0; i < this.k; i++) {
      const clusterPickups = clusters.filter(p => p.cluster === i);
      
      if (clusterPickups.length === 0) {
        // Empty cluster: re-initialize randomly
        centroids.push({
          lat: clusters[Math.floor(Math.random() * clusters.length)].lat,
          lon: clusters[Math.floor(Math.random() * clusters.length)].lon
        });
      } else {
        const avgLat = clusterPickups.reduce((sum, p) => sum + p.lat, 0) / clusterPickups.length;
        const avgLon = clusterPickups.reduce((sum, p) => sum + p.lon, 0) / clusterPickups.length;
        centroids.push({ lat: avgLat, lon: avgLon });
      }
    }

    return centroids;
  }

  hasConverged(oldCentroids, newCentroids, threshold = 0.001) {
    return oldCentroids.every((old, i) => {
      const dist = haversineDistance(old.lat, old.lon, newCentroids[i].lat, newCentroids[i].lon);
      return dist < threshold;
    });
  }
}

/**
 * Traveling Salesman Problem (TSP) Solver
 * Finds optimal route through all pickup points
 */
class TSPSolver {
  /**
   * Solve TSP using nearest neighbor heuristic with 2-opt improvement
   * @param {Array} points - Array of pickup points with lat/lon
   * @param {Object} start - Starting point (NGO depot)
   * @returns {Object} Optimized route
   */
  solve(points, start) {
    if (points.length === 0) {
      return { route: [start], totalDistance: 0 };
    }

    // Phase 1: Nearest Neighbor Construction
    const route = this.nearestNeighborRoute(points, start);
    
    // Phase 2: 2-Opt Local Search Improvement
    const optimizedRoute = this.twoOptImprovement(route);
    
    // Calculate final metrics
    const totalDistance = this.calculateRouteDistance(optimizedRoute);
    
    return {
      route: optimizedRoute,
      totalDistance,
      stops: optimizedRoute.length,
      estimatedTime: this.estimateTime(totalDistance, optimizedRoute.length)
    };
  }

  nearestNeighborRoute(points, start) {
    const unvisited = [...points];
    const route = [start];
    let current = start;

    while (unvisited.length > 0) {
      let nearest = null;
      let minDist = Infinity;

      unvisited.forEach((point, index) => {
        const dist = haversineDistance(current.lat, current.lon, point.lat, point.lon);
        if (dist < minDist) {
          minDist = dist;
          nearest = index;
        }
      });

      current = unvisited[nearest];
      route.push(current);
      unvisited.splice(nearest, 1);
    }

    // Return to start
    route.push(start);
    
    return route;
  }

  twoOptImprovement(route) {
    let improved = true;
    let bestRoute = [...route];
    
    while (improved) {
      improved = false;
      
      for (let i = 1; i < bestRoute.length - 2; i++) {
        for (let j = i + 1; j < bestRoute.length - 1; j++) {
          const newRoute = this.twoOptSwap(bestRoute, i, j);
          
          if (this.calculateRouteDistance(newRoute) < this.calculateRouteDistance(bestRoute)) {
            bestRoute = newRoute;
            improved = true;
          }
        }
      }
    }
    
    return bestRoute;
  }

  twoOptSwap(route, i, j) {
    const newRoute = [
      ...route.slice(0, i),
      ...route.slice(i, j + 1).reverse(),
      ...route.slice(j + 1)
    ];
    return newRoute;
  }

  calculateRouteDistance(route) {
    let total = 0;
    for (let i = 0; i < route.length - 1; i++) {
      total += haversineDistance(
        route[i].lat, route[i].lon,
        route[i + 1].lat, route[i + 1].lon
      );
    }
    return total;
  }

  estimateTime(distanceKm, stops) {
    // Average speed: 30 km/h in urban areas
    // Add 5 minutes per stop for pickup
    const driveTime = (distanceKm / 30) * 60; // minutes
    const stopTime = stops * 5; // minutes
    return Math.ceil(driveTime + stopTime);
  }
}

/**
 * CO2 Emissions Calculator
 */
class EmissionsCalculator {
  constructor() {
    // CO2 emissions in kg per km for different vehicle types
    this.emissionFactors = {
      'small_car': 0.12,
      'medium_car': 0.15,
      'large_car': 0.20,
      'van': 0.25,
      'truck': 0.35,
      'electric': 0.05
    };
  }

  calculate(distanceKm, vehicleType = 'medium_car') {
    const factor = this.emissionFactors[vehicleType] || this.emissionFactors['medium_car'];
    return {
      co2EmittedKg: (distanceKm * factor).toFixed(2),
      vehicleType,
      distanceKm: distanceKm.toFixed(2)
    };
  }

  calculateSavings(unoptimizedDistance, optimizedDistance, vehicleType = 'medium_car') {
    const factor = this.emissionFactors[vehicleType] || this.emissionFactors['medium_car'];
    const saved = (unoptimizedDistance - optimizedDistance) * factor;
    const savedPercentage = ((saved / (unoptimizedDistance * factor)) * 100).toFixed(1);
    
    return {
      co2SavedKg: saved.toFixed(2),
      percentageSaved: savedPercentage,
      distanceSavedKm: (unoptimizedDistance - optimizedDistance).toFixed(2)
    };
  }
}

/**
 * Main Route Optimizer Service
 */
class RouteOptimizer {
  constructor() {
    this.emissionsCalculator = new EmissionsCalculator();
  }

  /**
   * Optimize pickup routes for NGO/volunteer
   * @param {Object} depot - Starting location {lat, lon, name}
   * @param {Array} pickups - Array of pickup requests
   * @param {Object} options - Optimization options
   * @returns {Object} Optimized routes
   */
  async optimizeRoutes(depot, pickups, options = {}) {
    const {
      vehicleType = 'medium_car',
      maxPickupsPerRoute = 15,
      timeWindow = null
    } = options;

    try {
      // Filter pickups by time window if specified
      const filteredPickups = timeWindow ? 
        this.filterByTimeWindow(pickups, timeWindow) : pickups;

      if (filteredPickups.length === 0) {
        return {
          success: false,
          message: 'No pickups available in specified time window'
        };
      }

      // Step 1: Determine optimal number of vehicles/routes
      const numRoutes = Math.ceil(filteredPickups.length / maxPickupsPerRoute);

      // Step 2: Cluster pickups into route groups
      const clusterer = new KMeansClustering(numRoutes);
      const clusteredPickups = clusterer.cluster(filteredPickups);

      // Step 3: Optimize each route using TSP solver
      const solver = new TSPSolver();
      const routes = [];

      for (let i = 0; i < numRoutes; i++) {
        const clusterPickups = clusteredPickups.filter(p => p.cluster === i);
        
        if (clusterPickups.length > 0) {
          const optimizedRoute = solver.solve(clusterPickups, depot);
          
          // Calculate emissions
          const emissions = this.emissionsCalculator.calculate(
            optimizedRoute.totalDistance,
            vehicleType
          );

          routes.push({
            routeNumber: i + 1,
            pickups: clusterPickups,
            optimizedSequence: optimizedRoute.route,
            totalDistance: optimizedRoute.totalDistance.toFixed(2),
            estimatedTime: optimizedRoute.estimatedTime,
            stops: clusterPickups.length,
            emissions,
            vehicleType
          });
        }
      }

      // Calculate comparison with unoptimized approach
      const unoptimizedDistance = this.calculateUnoptimizedDistance(depot, filteredPickups);
      const optimizedDistance = routes.reduce((sum, r) => sum + parseFloat(r.totalDistance), 0);
      
      const savings = this.emissionsCalculator.calculateSavings(
        unoptimizedDistance,
        optimizedDistance,
        vehicleType
      );

      return {
        success: true,
        depot,
        routes,
        summary: {
          totalPickups: filteredPickups.length,
          totalRoutes: routes.length,
          totalDistance: optimizedDistance.toFixed(2),
          totalCO2: routes.reduce((sum, r) => sum + parseFloat(r.emissions.co2EmittedKg), 0).toFixed(2),
          estimatedTotalTime: routes.reduce((sum, r) => sum + r.estimatedTime, 0),
          optimization: {
            unoptimizedDistance: unoptimizedDistance.toFixed(2),
            optimizedDistance: optimizedDistance.toFixed(2),
            ...savings
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Route optimization error:', error);
      throw error;
    }
  }

  calculateUnoptimizedDistance(depot, pickups) {
    // Simple approach: depot → each pickup → back to depot (no optimization)
    let total = 0;
    pickups.forEach(pickup => {
      total += haversineDistance(depot.lat, depot.lon, pickup.lat, pickup.lon) * 2; // Round trip
    });
    return total;
  }

  filterByTimeWindow(pickups, timeWindow) {
    const now = new Date();
    const { startHour, endHour } = timeWindow;
    
    return pickups.filter(pickup => {
      const pickupTime = new Date(pickup.scheduledTime || now);
      const hour = pickupTime.getHours();
      return hour >= startHour && hour <= endHour;
    });
  }
}

module.exports = {
  RouteOptimizer,
  haversineDistance
};