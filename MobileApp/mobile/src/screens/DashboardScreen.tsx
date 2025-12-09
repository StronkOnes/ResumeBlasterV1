import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MethodSelector, InputMethod } from '../components/MethodSelector';
import { useTheme } from '../context/ThemeContext';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useTheme();
  const [showMethodSelector, setShowMethodSelector] = useState(false);

  const handleMethodSelect = (method: InputMethod) => {
    setShowMethodSelector(false);
    
    if (method === 'wizard') {
      navigation.navigate('Optimization', { method: 'wizard' });
    } else {
      // For upload, we'll navigate to the optimization screen
      navigation.navigate('Optimization', { method: 'upload' });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Create New Resume</Text>
      </View>
      <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {!showMethodSelector ? (
          <>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: isDarkMode ? 'rgba(0, 122, 255, 0.6)' : 'rgba(0, 122, 255, 0.8)' }]}
              onPress={() => setShowMethodSelector(true)}
            >
              <Text style={styles.createButtonText}>+ Create New Resume</Text>
            </TouchableOpacity>

            {/* Always show instructions on the Dashboard - this is the main landing screen for creating resumes */}
            <View style={[
              styles.instructionsContainer,
              {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
              }
            ]}>
              <Text style={[styles.instructionsTitle, { color: theme.textColor }]}>How to Create Your Perfect Resume</Text>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>1.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Click the button above to start creating your resume</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>2.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Choose "Create from Scratch" to use our step-by-step wizard or "Upload Document" to enhance an existing resume</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>3.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Fill in your professional details, experience, and skills</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>4.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Select your preferred template and optimization mode (Strict or Power Boost)</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>5.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Our AI will enhance your resume with professional language and optimal structure</Text>
              </View>
              <View style={styles.instructionStep}>
                <Text style={[styles.stepNumber, { color: isDarkMode ? '#FFD700' : '#007AFF' }]}>6.</Text>
                <Text style={[styles.stepText, { color: theme.textColor }]}>Preview, download as PDF/DOCX, and land your dream job!</Text>
              </View>
            </View>
          </>
        ) : (
          <MethodSelector onSelectMethod={handleMethodSelect} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  createButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    // Glassmorphism effect
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      }
    }),
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 20,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
});

export default DashboardScreen;