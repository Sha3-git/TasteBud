const getTimeWindowScore = (hours, track) => {
  if (hours < 0) return 0;
  
  switch (track) {
    case 'ige':
      if (hours <= 0.5) return 1.0;
      if (hours <= 1) return 0.9;
      if (hours <= 2) return 0.7;
      if (hours <= 4) return 0.3;
      if (hours <= 6) return 0.1;
      return 0;
      
    case 'fodmap':
      if (hours < 0.5) return 0.1;
      if (hours <= 1) return 0.4;
      if (hours <= 2) return 0.6;
      if (hours <= 4) return 0.8;
      if (hours <= 8) return 1.0;
      if (hours <= 12) return 0.9;
      if (hours <= 24) return 0.6;
      if (hours <= 48) return 0.3;
      return 0;
      
    case 'intolerance':
      if (hours < 1) return 0.1;
      if (hours <= 2) return 0.3;
      if (hours <= 4) return 0.5;
      if (hours <= 6) return 0.7;
      if (hours <= 12) return 0.9;
      if (hours <= 24) return 1.0;
      if (hours <= 48) return 0.7;
      if (hours <= 72) return 0.3;
      return 0;
      
    default:
      return 0.5;
  }
};
const getSeverityMultiplier = (severity) => {
  if (severity >= 9) return 2.0;
  if (severity >= 7) return 1.5;
  if (severity >= 4) return 1.0;
  return 0.5;
};
const calculateReactionScore = (symptoms, symptomMap) => {
    return symptoms.reduce((total, s) => {
        const info = symptomMap[s.id?.toString()]; // <-- FIXED
        const baseWeight = info?.weight || 1;
        const severityMultiplier = getSeverityMultiplier(s.severity);
        return total + (baseWeight * severityMultiplier);
    }, 0);
};

module.exports = {
  getTimeWindowScore,
  calculateReactionScore
};