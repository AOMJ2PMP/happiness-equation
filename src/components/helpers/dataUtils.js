import { getValue, getHistoricalValue } from "./chartUtils.js";

// Check if a country matches the current filter state
export function matchesFilters(country, { dimmedRegions, highlighted }) {
  // If there are highlighted countries, only those are "active"
  if (highlighted && highlighted.length > 0) {
    return highlighted.includes(country.name);
  }
  // If regions are dimmed, check if this country's region is dimmed
  if (dimmedRegions && dimmedRegions.length > 0) {
    return !dimmedRegions.includes(country.region);
  }
  return true;
}

// Check if a country has valid data for the current dimensions
export function hasValidData(country, xDim, yDim, year = null) {
  const xVal = year
    ? getHistoricalValue(country, xDim, year)
    : getValue(country, xDim);
  const yVal = year
    ? getHistoricalValue(country, yDim, year)
    : getValue(country, yDim);
  return xVal !== null && xVal !== undefined && yVal !== null && yVal !== undefined;
}

// Find a country by name
export function findCountry(countries, name) {
  return countries.find((c) => c.name === name);
}

// Get all available years from historical data across all countries
export function getAvailableYears(countries) {
  const years = new Set();
  for (const c of countries) {
    if (c.history) {
      for (const y of Object.keys(c.history)) {
        years.add(Number(y));
      }
    }
  }
  return [...years].sort((a, b) => a - b);
}

// Get the contribution factor labels for display
export const FACTOR_LABELS = {
  gdp: "GDP per capita",
  social: "Social support",
  health: "Healthy life expectancy",
  freedom: "Freedom to choose",
  generosity: "Generosity",
  corruption: "Low corruption",
  dystopiaResidual: "Dystopia + residual",
};

export const FACTOR_COLORS = {
  gdp: "#4e79a7",
  social: "#59a14f",
  health: "#76b7b2",
  freedom: "#f28e2b",
  generosity: "#edc948",
  corruption: "#e15759",
  dystopiaResidual: "#bab0ac",
};
