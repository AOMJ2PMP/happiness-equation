import * as d3 from "d3";

// Dimension metadata for axis labels and data access
export const DIMENSIONS = {
  score2024: { label: "Happiness Score", key: "score2024", isContribution: true },
  gdp: { label: "Log GDP per capita", key: "gdp", isContribution: true },
  social: { label: "Social Support", key: "social", isContribution: true },
  health: { label: "Healthy Life Expectancy", key: "health", isContribution: true },
  freedom: { label: "Freedom to Make Choices", key: "freedom", isContribution: true },
  generosity: { label: "Generosity", key: "generosity", isContribution: true },
  corruption: { label: "Perceptions of Corruption", key: "corruption", isContribution: true },
};

// Get value for a dimension from a country object (2024 contribution data)
export function getValue(country, dim) {
  if (dim === "score2024") return country.score2024;
  if (country.contributions) return country.contributions[dim];
  return null;
}

// Get value from historical data for a given year
export function getHistoricalValue(country, dim, year) {
  const yearData = country.history?.[year];
  if (!yearData) return null;
  if (dim === "score2024") return yearData.score;
  return yearData[dim];
}

// Create a linear scale for a given dimension
export function createScale(countries, dim, range, year = null) {
  let values;
  if (year) {
    values = countries
      .map((c) => getHistoricalValue(c, dim, year))
      .filter((v) => v !== null && v !== undefined);
  } else {
    values = countries
      .map((c) => getValue(c, dim))
      .filter((v) => v !== null && v !== undefined);
  }

  return d3
    .scaleLinear()
    .domain(d3.extent(values))
    .range(range)
    .nice();
}

// Create a radius scale for happiness score
export function createRadiusScale(countries) {
  const scores = countries
    .map((c) => c.score2024)
    .filter((v) => v !== null);
  return d3
    .scaleLinear()
    .domain(d3.extent(scores))
    .range([3, 12]);
}

// Region color scale — Tableau 10
const REGION_COLORS = {
  "Western Europe": "#4e79a7",
  "Central and Eastern Europe": "#f28e2b",
  "Commonwealth of Independent States": "#e15759",
  "East Asia": "#76b7b2",
  "Southeast Asia": "#59a14f",
  "South Asia": "#edc948",
  "Latin America and Caribbean": "#b07aa1",
  "Middle East and North Africa": "#ff9da7",
  "North America and ANZ": "#9c755f",
  "Sub-Saharan Africa": "#bab0ac",
};

export function getRegionColor(region) {
  return REGION_COLORS[region] || "#999";
}

export const REGIONS = Object.keys(REGION_COLORS);

// Generate tick values for an axis
export function getTicks(scale, count = 5) {
  return scale.ticks(count);
}

// Format tick value based on dimension
export function formatTick(value, dim) {
  if (dim === "score2024") return value.toFixed(1);
  if (dim === "gdp") return value.toFixed(1);
  return value.toFixed(2);
}
