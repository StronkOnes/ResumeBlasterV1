import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OptimizationMode, ResumeTemplate, ResumeData } from '../types';
import { generateResumeContent } from '../services/aiService';
import { DocumentUpload } from '../components/DocumentUpload';
import { ResumeWizard } from '../components/ResumeWizard';
import { resumeService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface OptimizationScreenProps {
  route: any;
}

export const OptimizationScreen: React.FC<OptimizationScreenProps> = ({ route }) => {
  const { method, content, resumeData } = route.params;
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isDarkMode, theme } = useTheme();

  const [jobTitle, setJobTitle] = useState(resumeData?.job_title || '');
  const [jobDescription, setJobDescription] = useState(resumeData?.job_description_used || '');
  const [rawContent, setRawContent] = useState(content || resumeData?.original_content || resumeData?.enhanced_content || '');
  const [mode, setMode] = useState<OptimizationMode>(resumeData?.enhancement_mode || OptimizationMode.NO_HALLUCINATIONS);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeData?.template_selected as ResumeTemplate || ResumeTemplate.MODERN);
  const [isTailoring, setIsTailoring] = useState(!!resumeData?.job_description_used);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptimizationOptions, setShowOptimizationOptions] = useState(false);

  // Handle content ready from wizard or upload
  const handleContentReady = (extractedContent: string) => {
    setRawContent(extractedContent);
    setShowOptimizationOptions(true);
  };

  // If method is 'wizard' and content not available yet, show the resume wizard
  if (method === 'wizard' && !showOptimizationOptions && !rawContent) {
    return (
      <ResumeWizard
        onComplete={handleContentReady}
        onBack={() => navigation.goBack()}
      />
    );
  }

  // If method is 'upload' and content not available yet, show document upload
  if (method === 'upload' && !rawContent && !showOptimizationOptions) {
    return (
      <DocumentUpload
        onContentExtracted={(extractedContent) => {
          handleContentReady(extractedContent);
        }}
        onBack={() => navigation.goBack()}
        navigation={navigation}
      />
    );
  }

  const handleGenerate = async () => {
    if (!rawContent || typeof rawContent !== 'string' || !rawContent.trim()) {
      Alert.alert("Error", "Please enter some resume content.");
      return;
    }

    if (isTailoring && (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim())) {
      Alert.alert("Error", "Please provide a job description to tailor against.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to generate a resume.");
      return;
    }

    setIsLoading(true);

    try {
      const enhancedContent = await generateResumeContent(
        rawContent,
        mode,
        selectedTemplate, // Use the selected template
        isTailoring ? jobDescription : undefined,
        jobTitle
      );

      // Create resume data object
      const resumeData: ResumeData = {
        user_id: user.id,
        job_title: jobTitle,
        original_content: rawContent,
        enhanced_content: enhancedContent,
        enhancement_mode: mode,
        job_description_used: isTailoring ? jobDescription : undefined,
        template_selected: selectedTemplate, // Use the selected template
      };

      let savedResume;
      if (route.params.resumeData?.id) {
        // If editing an existing resume, update it
        savedResume = await resumeService.updateResume(route.params.resumeData.id, resumeData);
      } else {
        // Otherwise, create a new resume
        savedResume = await resumeService.createResume(resumeData);
      }

      // Navigate to preview screen with the generated content
      navigation.navigate('Preview', {
        resumeData: savedResume,
        content: enhancedContent
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      Alert.alert("Error", "Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isTailoring ? 'Tailor to Job' : 'Optimize Your Resume'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resume Content</Text>
        <Text style={styles.sectionSubtitle}>
          {rawContent.length} characters
        </Text>
        <TextInput
          style={styles.textArea}
          value={rawContent}
          onChangeText={setRawContent}
          multiline
          placeholder="Your resume content..."
          textAlignVertical="top"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Desired Job Title</Text>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="e.g. Senior Product Manager"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Tailor to Job Description</Text>
          <Switch
            value={isTailoring}
            onValueChange={setIsTailoring}
            trackColor={{ false: "#767577", true: "#007AFF" }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        {isTailoring && (
          <View style={styles.jobDescContainer}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <TextInput
              style={styles.textArea}
              value={jobDescription}
              onChangeText={setJobDescription}
              multiline
              placeholder="Paste the job description here..."
              textAlignVertical="top"
            />
          </View>
        )}
      </View>

      {/* Template Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Template Selection</Text>
        </View>
        <View style={styles.templateSection}>
          <Text style={styles.sectionSubtitle}>Select a visual style for your resume</Text>
          <View style={styles.templateSelectorContainer}>
            <TouchableOpacity
              style={[
                styles.templateOption,
                selectedTemplate === ResumeTemplate.MODERN && styles.templateOptionSelected
              ]}
              onPress={() => setSelectedTemplate(ResumeTemplate.MODERN)}
            >
              <Text style={[
                styles.templateOptionText,
                selectedTemplate === ResumeTemplate.MODERN && styles.templateOptionTextSelected
              ]}>
                Modern
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.templateOption,
                selectedTemplate === ResumeTemplate.CLASSIC && styles.templateOptionSelected
              ]}
              onPress={() => setSelectedTemplate(ResumeTemplate.CLASSIC)}
            >
              <Text style={[
                styles.templateOptionText,
                selectedTemplate === ResumeTemplate.CLASSIC && styles.templateOptionTextSelected
              ]}>
                Classic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.templateOption,
                selectedTemplate === ResumeTemplate.EXECUTIVE && styles.templateOptionSelected
              ]}
              onPress={() => setSelectedTemplate(ResumeTemplate.EXECUTIVE)}
            >
              <Text style={[
                styles.templateOptionText,
                selectedTemplate === ResumeTemplate.EXECUTIVE && styles.templateOptionTextSelected
              ]}>
                Executive
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mode Selection */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === OptimizationMode.NO_HALLUCINATIONS && styles.activeModeButton
          ]}
          onPress={() => setMode(OptimizationMode.NO_HALLUCINATIONS)}
        >
          <Text style={[
            styles.modeButtonText,
            mode === OptimizationMode.NO_HALLUCINATIONS && styles.activeModeButtonText
          ]}>
            Strict Mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === OptimizationMode.POWER_BOOST && styles.activeModeButton
          ]}
          onPress={() => setMode(OptimizationMode.POWER_BOOST)}
        >
          <Text style={[
            styles.modeButtonText,
            mode === OptimizationMode.POWER_BOOST && styles.activeModeButtonText
          ]}>
            Power Boost
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {mode === OptimizationMode.NO_HALLUCINATIONS
            ? "Strict Mode: Optimizes grammar, structure, and phrasing based ONLY on provided info. Perfect for maintaining factual accuracy."
            : "Power Boost: Infers industry-standard skills and achievements based on your job title to create a 'perfect' candidate profile. Use with discretion."}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerate}
        disabled={isLoading}
      >
        <Text style={styles.generateButtonText}>
          {isLoading 
            ? 'Generating...' 
            : (isTailoring ? 'Tailor & Optimize Resume' : 'Enhance & Optimize to 10/10')
          }
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    height: 120,
    textAlignVertical: 'top',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  jobDescContainer: {
    marginTop: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 3,
    marginBottom: 15,
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeModeButton: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateSection: {
    marginTop: 5,
  },
  templateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  templateOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  templateOptionSelected: {
    backgroundColor: '#dae8ff',
    borderColor: '#007AFF',
  },
  templateOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  templateOptionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default OptimizationScreen;