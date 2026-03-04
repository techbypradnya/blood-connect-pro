/**
 * Check blood donation eligibility based on medical details.
 * Returns { eligible: boolean, reasons: string[], bmi: number|null }
 */
function checkEligibility(data) {
  const reasons = [];
  let bmi = null;

  // Age check
  if (data.age != null) {
    if (data.age < 18 || data.age > 60) {
      reasons.push("Age must be between 18 and 60 years");
    }
  }

  // Weight check
  if (data.weight != null && data.weight < 50) {
    reasons.push("Minimum weight must be 50 kg");
  }

  // BMI check
  if (data.weight != null && data.height != null && data.height > 0) {
    const heightM = data.height / 100;
    bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(1));
    if (bmi < 18.5) {
      reasons.push("BMI is below 18.5 – underweight");
    } else if (bmi > 35) {
      reasons.push("BMI is above safe range");
    }
  }

  // Hemoglobin check
  if (data.hemoglobin != null && data.hemoglobin < 12.5) {
    reasons.push("Hemoglobin must be above 12.5 g/dL");
  }

  // Last donation gap (minimum 3 months / 90 days)
  if (data.lastDonationDate) {
    const last = new Date(data.lastDonationDate);
    const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 90) {
      reasons.push("Minimum 3 months gap since last donation required");
    }
  }

  // Medical conditions
  if (data.hasMedicalConditions) {
    reasons.push("Existing medical conditions reported");
  }

  // Recent surgery
  if (data.recentSurgery) {
    reasons.push("Recent surgery reported");
  }

  // On medication
  if (data.onMedication) {
    reasons.push("Currently on medication");
  }

  return { eligible: reasons.length === 0, reasons, bmi };
}

module.exports = { checkEligibility };
