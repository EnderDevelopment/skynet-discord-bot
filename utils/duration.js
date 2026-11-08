const UNITS = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
const MAX_TIMEOUT = 28 * 24 * 60 * 60 * 1000;

function parseDuration(value) {
  const match = /^(\d+)\s*([smhd])$/i.exec(value.trim());
  if (!match) return null;
  const duration = Number(match[1]) * UNITS[match[2].toLowerCase()];
  return duration > 0 && duration <= MAX_TIMEOUT ? duration : null;
}

module.exports = { parseDuration };
