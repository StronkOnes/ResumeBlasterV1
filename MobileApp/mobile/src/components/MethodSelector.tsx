import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export type InputMethod = 'wizard' | 'upload';

interface MethodSelectorProps {
  onSelectMethod: (method: InputMethod) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ onSelectMethod }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How would you like to create your resume?</Text>
        <Text style={styles.subtitle}>Choose the method that works best for you</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Create from Scratch Option */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onSelectMethod('wizard')}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Create from Scratch</Text>
              <Text style={styles.optionDescription}>
                Use our step-by-step wizard to build your resume from the ground up.
                Perfect if you're starting fresh or want guided assistance.
              </Text>
            </View>

            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Step-by-step</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Guided</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Easy</Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Upload Document Option */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onSelectMethod('upload')}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📄</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Upload Document</Text>
              <Text style={styles.optionDescription}>
                Already have a resume? Upload your existing document and we'll
                optimize it for you. Supports PDF, DOCX, and TXT files.
              </Text>
            </View>

            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>PDF</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>DOCX</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>TXT</Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoContent}>
          <Text style={styles.infoIcon}>✨</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Both methods lead to AI optimization!</Text>
            <Text style={styles.infoDescription}>
              After entering your information, you'll be able to enhance your resume with our AI-powered
              optimization tools to create a perfect 10/10 resume.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  optionContent: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 48,
  },
  textContainer: {
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  arrowContainer: {
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 15,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: 14,
    color: '#0d47a1',
  },
});