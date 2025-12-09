import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Button, Platform } from 'react-native';
import { ResumeData, ResumeSection, ResumeItem, OptimizationMode } from '../types';
import { validateResumeData } from '../utils/validation';

interface ResumeFormProps {
  initialData?: ResumeData;
  onSave: (resumeData: ResumeData) => void;
  onOptimize?: (rawContent: string, mode: OptimizationMode, jobTitle?: string, jobDescription?: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onSave, onOptimize }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(
    initialData || {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      sections: [
        { title: 'Experience', items: [] },
        { title: 'Education', items: [] },
        { title: 'Skills', items: [] }
      ],
      job_title: '',
      original_content: '',
      enhanced_content: '',
      enhancement_mode: OptimizationMode.NO_HALLUCINATIONS,
    }
  );

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [newItemText, setNewItemText] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>(initialData?.job_title || '');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [mode, setMode] = useState<OptimizationMode>(OptimizationMode.NO_HALLUCINATIONS);

  const handleSave = () => {
    const updatedResumeData = {
      ...resumeData,
      job_title: jobTitle,
      original_content: buildResumeContent(),
      enhancement_mode: mode,
    };

    const validation = validateResumeData(updatedResumeData);

    if (!validation.isValid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      return;
    }

    onSave(updatedResumeData);
  };

  const buildResumeContent = (): string => {
    let content = '';
    if (resumeData.fullName) content += `Name: ${resumeData.fullName}\n`;
    if (resumeData.email) content += `Email: ${resumeData.email}\n`;
    if (resumeData.phone) content += `Phone: ${resumeData.phone}\n`;
    if (resumeData.address) content += `Address: ${resumeData.address}\n`;
    if (resumeData.summary) content += `\nSummary: ${resumeData.summary}\n`;

    resumeData.sections.forEach(section => {
      content += `\n${section.title}:\n`;
      section.items.forEach(item => {
        if (typeof item === 'string') {
          content += `- ${item}\n`;
        } else {
          content += `- ${item.position || ''} at ${item.company || ''} (${item.startDate || ''} - ${item.endDate || ''})\n`;
          if (item.description) content += `  ${item.description}\n`;
          if (item.skills) content += `  Skills: ${item.skills.join(', ')}\n`;
        }
      });
    });

    return content;
  };

  const handleOptimize = () => {
    const rawContent = buildResumeContent();
    if (onOptimize) {
      onOptimize(rawContent, mode, jobTitle, jobDescription);
    }
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, updatedItem: ResumeItem) => {
    const updatedSections = [...resumeData.sections];
    if (updatedSections[sectionIndex] && updatedSections[sectionIndex].items[itemIndex]) {
      updatedSections[sectionIndex].items[itemIndex] = { ...updatedSections[sectionIndex].items[itemIndex], ...updatedItem };
      setResumeData({ ...resumeData, sections: updatedSections });
    }
  };

  const addSectionItem = () => {
    if (!newItemText.trim()) return;

    const updatedSections = [...resumeData.sections];
    updatedSections[activeSectionIndex].items.push({
      description: newItemText
    });

    setResumeData({ ...resumeData, sections: updatedSections });
    setNewItemText('');
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...resumeData.sections];
    updatedSections[sectionIndex].items.splice(itemIndex, 1);
    setResumeData({ ...resumeData, sections: updatedSections });
  };

  const renderSection = (section: ResumeSection, sectionIndex: number) => {
    const isActive = activeSectionIndex === sectionIndex;

    return (
      <View key={sectionIndex} style={[styles.section, isActive && styles.activeSection]}>
        <TouchableOpacity
          onPress={() => setActiveSectionIndex(sectionIndex)}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </TouchableOpacity>

        {isActive && (
          <View style={styles.sectionContent}>
            {section.items.map((item: any, itemIndex: number) => (
              <View key={itemIndex} style={styles.itemContainer}>
                <TextInput
                  style={styles.itemInput}
                  value={item.description || ''}
                  onChangeText={(text) => updateSectionItem(sectionIndex, itemIndex, { description: text })}
                  placeholder="Enter item details..."
                  multiline
                />
                <TouchableOpacity
                  onPress={() => removeSectionItem(sectionIndex, itemIndex)}
                  style={styles.removeItemButton}
                >
                  <Text style={styles.removeItemText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.addItemInput}
                value={newItemText}
                onChangeText={setNewItemText}
                placeholder="Add new item..."
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addSectionItem}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Resume</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={resumeData.fullName}
            onChangeText={(text) => setResumeData({ ...resumeData, fullName: text })}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={resumeData.email}
            onChangeText={(text) => setResumeData({ ...resumeData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={resumeData.phone}
            onChangeText={(text) => setResumeData({ ...resumeData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={resumeData.address}
            onChangeText={(text) => setResumeData({ ...resumeData, address: text })}
            placeholder="Enter your address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Professional Summary</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={resumeData.summary}
            onChangeText={(text) => setResumeData({ ...resumeData, summary: text })}
            placeholder="Enter your professional summary"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={jobTitle}
            onChangeText={setJobTitle}
            placeholder="Enter the job title you're applying for"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={jobDescription}
            onChangeText={setJobDescription}
            placeholder="Paste the job description here for tailoring"
            multiline
            numberOfLines={4}
          />
        </View>

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

        <Text style={styles.sectionLabel}>Resume Sections</Text>
        {resumeData.sections.map(renderSection)}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.optimizeButton}
            onPress={handleOptimize}
          >
            <Text style={styles.buttonText}>Optimize with AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Resume</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6ff', // Light blue/purple background
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    color: '#333',
    // Add glassmorphism effect
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  section: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  activeSection: {
    borderColor: 'rgba(0, 122, 255, 0.8)',
    borderWidth: 2,
  },
  sectionHeader: {
    padding: 18,
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    padding: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    color: '#333',
  },
  removeItemButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    borderRadius: 6,
  },
  removeItemText: {
    color: '#fff',
    fontSize: 12,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    color: '#333',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  modeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeModeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optimizeButton: {
    flex: 0.48,
    backgroundColor: 'rgba(88, 86, 214, 0.8)', // Purple for optimization
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  saveButton: {
    flex: 0.48,
    backgroundColor: 'rgba(0, 122, 255, 0.8)', // Blue for save
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResumeForm;