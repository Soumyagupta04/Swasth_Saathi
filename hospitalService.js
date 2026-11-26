const fs = require('fs');
const path = require('path');
const { calculateDistance } = require('../utils/haversine');

const HOSPITALS_FILE_PATH = path.join(__dirname, '../data/raipur/hospitals.json');

/**
 * Load hospitals from JSON file.
 * @returns {Array} List of hospitals
 */
function loadHospitals() {
  const rawData = fs.readFileSync(HOSPITALS_FILE_PATH, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Get all hospitals.
 * @returns {Array}
 */
function getAllHospitals() {
  return loadHospitals();
}

/**
 * Get hospital by unique ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getHospitalById(id) {
  const hospitals = loadHospitals();
  return hospitals.find((h) => h.id === id) || null;
}

/**
 * Get hospitals sorted by straight-line distance from user's coordinates.
 * @param {number} userLat
 * @param {number} userLng
 * @returns {Array}
 */
function getNearbyHospitals(userLat, userLng) {
  const hospitals = loadHospitals();

  const results = hospitals
    .map((h) => {
      const hasCoordinates = typeof h.latitude === 'number' && typeof h.longitude === 'number';
      return {
        ...h,
        distanceKm: hasCoordinates ? calculateDistance(userLat, userLng, h.latitude, h.longitude) : null,
      };
    })
    .sort((a, b) => {
      if (a.distanceKm == null) return b.distanceKm == null ? 0 : 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });

  return results;
}

module.exports = {
  getAllHospitals,
  getHospitalById,
  getNearbyHospitals,
};
