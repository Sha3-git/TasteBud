import api from "./apiClient";

interface OnboardingAllergyData {
  allergies: string[];
  symptoms?: string[];
}

export const onboardingService = {
  saveAllergies: (userId: string, data: OnboardingAllergyData) => {
    return api.post("/unsafefood/onboarding", 
      { allergies: data.allergies, symptoms: data.symptoms },
      { params: { userId } }
    );
  }
};
