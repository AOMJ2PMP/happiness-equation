import fs from "fs";
import path from "path";

const CWD = process.cwd();

// --- Paths to source CSVs ---
const CSV_2024 = path.join(CWD, "tasks", "World-happiness-report-2024.csv");
const CSV_HISTORICAL = path.join(CWD, "tasks", "World-happiness-report-updated_2024.csv");
const OUTPUT = path.join(CWD, "src", "data", "countries.json");

// --- Country name normalization ---
const NAME_MAP = {
  "Taiwan Province of China": "Taiwan",
  "Hong Kong S.A.R. of China": "Hong Kong",
  "Turkiye": "Turkey",
  "T\u00fcrkiye": "Turkey",
  "State of Palestine": "Palestine",
  "Congo (Brazzaville)": "Congo (Brazzaville)",
  "Congo (Kinshasa)": "Congo (Kinshasa)",
};

function normalizeName(name) {
  return NAME_MAP[name] || name;
}

// --- Region assignments for countries in historical file but NOT in 2024 file ---
const MANUAL_REGIONS = {
  "Angola": "Sub-Saharan Africa",
  "Belarus": "Central and Eastern Europe",
  "Belize": "Latin America and Caribbean",
  "Bhutan": "South Asia",
  "Central African Republic": "Sub-Saharan Africa",
  "Cuba": "Latin America and Caribbean",
  "Djibouti": "Sub-Saharan Africa",
  "Guyana": "Latin America and Caribbean",
  "Haiti": "Latin America and Caribbean",
  "Maldives": "South Asia",
  "Myanmar": "Southeast Asia",
  "Oman": "Middle East and North Africa",
  "Rwanda": "Sub-Saharan Africa",
  "Somalia": "Sub-Saharan Africa",
  "South Sudan": "Sub-Saharan Africa",
  "Sudan": "Sub-Saharan Africa",
  "Suriname": "Latin America and Caribbean",
  "Syria": "Middle East and North Africa",
  "Trinidad and Tobago": "Latin America and Caribbean",
  "Turkmenistan": "Commonwealth of Independent States",
  "North Cyprus": "Western Europe",
  "Somaliland region": "Sub-Saharan Africa",
  "Kosovo": "Central and Eastern Europe",
  "Burundi": "Sub-Saharan Africa",
  "Qatar": "Middle East and North Africa",
};

// --- Parse CSV ---
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h.trim()] = values[idx].trim();
      });
      rows.push(row);
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function toNum(val) {
  if (val === "" || val === undefined || val === null) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

// --- Main ---
function main() {
  const raw2024 = fs.readFileSync(CSV_2024, "utf8");
  const rawHistoricalBuf = fs.readFileSync(CSV_HISTORICAL);
  // File uses Latin-1 encoding (Türkiye has 0xFC for ü)
  const rawHistorical = new TextDecoder("latin1").decode(rawHistoricalBuf);

  const data2024 = parseCSV(raw2024);
  const dataHistorical = parseCSV(rawHistorical);

  // Build region lookup from 2024 file
  const regionLookup = {};
  for (const row of data2024) {
    const name = normalizeName(row["Country name"]);
    regionLookup[name] = row["Regional indicator"];
  }

  // Build 2024 data map
  const map2024 = {};
  data2024.forEach((row, idx) => {
    const name = normalizeName(row["Country name"]);
    map2024[name] = {
      rank: idx + 1,
      score2024: toNum(row["Ladder score"]),
      contributions: {
        gdp: toNum(row["Log GDP per capita"]),
        social: toNum(row["Social support"]),
        health: toNum(row["Healthy life expectancy"]),
        freedom: toNum(row["Freedom to make life choices"]),
        generosity: toNum(row["Generosity"]),
        corruption: toNum(row["Perceptions of corruption"]),
        dystopiaResidual: toNum(row["Dystopia + residual"]),
      },
    };
  });

  // Build historical data grouped by country
  const historyMap = {};
  for (const row of dataHistorical) {
    const name = normalizeName(row["Country name"]);
    if (!historyMap[name]) historyMap[name] = {};
    const year = row["year"];
    historyMap[name][year] = {
      score: toNum(row["Life Ladder"]),
      gdp: toNum(row["Log GDP per capita"]),
      social: toNum(row["Social support"]),
      health: toNum(row["Healthy life expectancy at birth"]),
      freedom: toNum(row["Freedom to make life choices"]),
      generosity: toNum(row["Generosity"]),
      corruption: toNum(row["Perceptions of corruption"]),
      positiveAffect: toNum(row["Positive affect"]),
      negativeAffect: toNum(row["Negative affect"]),
    };
  }

  // Merge all unique country names
  const allNames = new Set([
    ...Object.keys(map2024),
    ...Object.keys(historyMap),
  ]);

  const countries = [];
  for (const name of allNames) {
    const d2024 = map2024[name];
    const history = historyMap[name] || {};
    const region = regionLookup[name] || MANUAL_REGIONS[name] || "Unknown";

    if (region === "Unknown") {
      console.warn(`No region for: ${name}`);
    }

    const entry = {
      name,
      region,
      rank: d2024 ? d2024.rank : null,
      score2024: d2024 ? d2024.score2024 : null,
      contributions: d2024 ? d2024.contributions : null,
      history,
    };

    countries.push(entry);
  }

  // Sort: countries with 2024 rank first (by rank), then historical-only (by name)
  countries.sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank) return -1;
    if (b.rank) return 1;
    return a.name.localeCompare(b.name);
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(countries, null, 2));
  console.log(`Wrote ${countries.length} countries to ${OUTPUT}`);
}

main();
