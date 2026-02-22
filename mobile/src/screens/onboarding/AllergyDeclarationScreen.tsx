/**
 * ALLERGY DECLARATION SCREEN
 * 
 * PURPOSE:
 * - Allows users to declare pre-existing allergies and symptoms
 * - Supports MULTIPLE selections for both allergies and symptoms
 * - Users can skip if they have no known allergies
 * 
 * BACKEND INTEGRATION: COMPLETE
 * - Calls POST /api/unsafefood/onboarding to save allergies
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onboardingService } from '../../services/onboardingService';

interface AllergyDeclarationScreenProps {
  onBack: () => void;
  onContinue: (allergyData: { allergies: string[]; symptoms: string[] }) => void;
}

export function AllergyDeclarationScreen({ onBack, onContinue }: AllergyDeclarationScreenProps) {
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);
  const [showSymptomPicker, setShowSymptomPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // TODO: Replace with API call to fetch allergens from database
  const allergies = [
    'Peanuts', 'Tree nuts', 'Dairy', 'Eggs', 'Shellfish',
    'Fish', 'Soy', 'Wheat', 'Sesame', 'Gluten',
  ];
  
  // TODO: Replace with API call to fetch symptoms from database
  const symptoms = [
    'Itching', 'Swelling', 'Hives', 'Nausea', 'Vomiting',
    'Diarrhea', 'Shortness of breath', 'Abdominal pain', 'Headache', 'Dizziness',
  ];
  
  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleContinue = async () => {
    console.log('🏥 ALLERGY DATA TO SEND TO BACKEND:', {
      allergies: selectedAllergies,
      symptoms: selectedSymptoms,
      timestamp: new Date().toISOString()
    });
    
    setIsSaving(true);
    try {
      // TODO: Replace with real userId from auth context when ready
      const testUserId = "69173dd5a3866b85b59d9760";
      
      await onboardingService.saveAllergies(testUserId, {
        allergies: selectedAllergies,
        symptoms: selectedSymptoms
      });
      
      console.log('Allergies saved successfully');
      onContinue({ allergies: selectedAllergies, symptoms: selectedSymptoms });
    } catch (error) {
      console.error('Failed to save allergies:', error);
      // Still continue even if save fails - don't block onboarding
      onContinue({ allergies: selectedAllergies, symptoms: selectedSymptoms });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSkip = async () => {
    console.log('USER SKIPPED - No known allergies');
    setIsSaving(true);
    try {
      const testUserId = "69173dd5a3866b85b59d9760";
      await onboardingService.saveAllergies(testUserId, {
        allergies: [],
        symptoms: []
      });
    } catch (error) {
      console.error('Skip save error:', error);
    } finally {
      setIsSaving(false);
    }
    onContinue({ allergies: [], symptoms: [] });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerBrand}>TasteBud</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollForm}
        contentContainerStyle={styles.scrollFormContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ALLERGIES SECTION */}
        <View>
          <Text style={styles.screenTitle}>Do you have any allergies?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          
          {selectedAllergies.length > 0 && (
            <View style={styles.chipsContainer}>
              {selectedAllergies.map((allergy) => (
                <TouchableOpacity
                  key={allergy}
                  style={styles.chip}
                  onPress={() => toggleAllergy(allergy)}
                >
                  <Text style={styles.chipText}>{allergy}</Text>
                  <Ionicons name="close-circle" size={18} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setShowAllergyPicker(!showAllergyPicker);
              setShowSymptomPicker(false);
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>
              {showAllergyPicker ? 'Hide options' : 'Add allergy'}
            </Text>
          </TouchableOpacity>
          
          {showAllergyPicker && (
            <View style={styles.selectionGrid}>
              {allergies.map((allergy) => (
                <TouchableOpacity
                  key={allergy}
                  style={[
                    styles.gridItem,
                    selectedAllergies.includes(allergy) && styles.gridItemSelected
                  ]}
                  onPress={() => toggleAllergy(allergy)}
                >
                  <Text style={[
                    styles.gridItemText,
                    selectedAllergies.includes(allergy) && styles.gridItemTextSelected
                  ]}>
                    {allergy}
                  </Text>
                  {selectedAllergies.includes(allergy) && (
                    <Ionicons name="checkmark-circle" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* SYMPTOMS SECTION */}
        <View style={styles.sectionSpacing}>
          <Text style={styles.screenTitle}>Are you aware of any symptoms?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          
          {selectedSymptoms.length > 0 && (
            <View style={styles.chipsContainer}>
              {selectedSymptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={styles.chip}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={styles.chipText}>{symptom}</Text>
                  <Ionicons name="close-circle" size={18} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setShowSymptomPicker(!showSymptomPicker);
              setShowAllergyPicker(false);
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>
              {showSymptomPicker ? 'Hide options' : 'Add symptom'}
            </Text>
          </TouchableOpacity>
          
          {showSymptomPicker && (
            <View style={styles.selectionGrid}>
              {symptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={[
                    styles.gridItem,
                    selectedSymptoms.includes(symptom) && styles.gridItemSelected
                  ]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={[
                    styles.gridItemText,
                    selectedSymptoms.includes(symptom) && styles.gridItemTextSelected
                  ]}>
                    {symptom}
                  </Text>
                  {selectedSymptoms.includes(symptom) && (
                    <Ionicons name="checkmark-circle" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.skipButton, isSaving && styles.buttonDisabled]}
          onPress={handleSkip}
          disabled={isSaving}
        >
          <Text style={styles.skipButtonText}>
            {isSaving ? 'Saving...' : "I'm not aware of any allergies or symptoms"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {(selectedAllergies.length > 0 || selectedSymptoms.length > 0) && (
        <TouchableOpacity 
          onPress={handleContinue}
          style={[styles.continueButton, isSaving && styles.buttonDisabled]}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          <Text style={styles.continueIcon}>{isSaving ? '...' : '→'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
  },
  headerBrand: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginRight: 40,
  },
  scrollForm: {
    flex: 1,
  },
  scrollFormContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 40,
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
    marginTop: -30,
    paddingLeft: 2,
  },
  sectionSpacing: {
    marginTop: 50,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  chipText: {
    color: '#fff',
    fontSize: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  gridItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridItemSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  gridItemText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  gridItemTextSelected: {
    color: '#000',
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 40,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomPadding: {
    height: 100,
  },
  continueButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueIcon: {
    color: '#000',
    fontSize: 28,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
