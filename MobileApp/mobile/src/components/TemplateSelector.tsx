import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResumeTemplate, TemplateInfo } from '../types';

const RESUME_TEMPLATES: TemplateInfo[] = [
  {
    id: ResumeTemplate.MODERN,
    name: 'Modern',
    description: 'Clean, minimalist design with bold headings and accent colors. Perfect for tech and creative roles.',
    preview: 'modern-preview',
    docxPath: 'Document 1.docx',
  },
  {
    id: ResumeTemplate.CLASSIC,
    name: 'Classic',
    description: 'Traditional, professional layout with serif fonts. Ideal for corporate and formal positions.',
    preview: 'classic-preview',
    docxPath: 'Document 2.docx',
  },
  {
    id: ResumeTemplate.EXECUTIVE,
    name: 'Executive',
    description: 'Sophisticated design with subtle shading and prominent achievements. Best for senior-level roles.',
    preview: 'executive-preview',
    docxPath: 'Document 3.docx',
  }
];

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Template</Text>
        <Text style={styles.subtitle}>Select a visual style for your resume</Text>
      </View>

      <View style={styles.templatesContainer}>
        {RESUME_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateOption,
                isSelected && styles.templateOptionSelected
              ]}
              onPress={() => onSelectTemplate(template.id)}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIcon}>✓</Text>
                </View>
              )}

              {/* Template Preview Placeholder */}
              <View style={[
                styles.templatePreview,
                isSelected ? styles.templatePreviewSelected : styles.templatePreviewDefault
              ]}>
                <Text style={styles.previewIcon}>📄</Text>
                <Text style={[
                  styles.templateNameOverlay,
                  isSelected ? styles.templateNameOverlaySelected : styles.templateNameOverlayDefault
                ]}>
                  {template.name}
                </Text>
              </View>

              {/* Template Info */}
              <View style={styles.templateInfo}>
                <Text style={[
                  styles.templateName,
                  isSelected ? styles.templateNameSelected : styles.templateNameDefault
                ]}>
                  {template.name}
                </Text>
                <Text style={[
                  styles.templateDescription,
                  isSelected ? styles.templateDescriptionSelected : styles.templateDescriptionDefault
                ]}>
                  {template.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Template Features */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoIcon}>✨</Text>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>AI-Powered Formatting</Text>
          <Text style={styles.infoDescription}>
            Our AI will automatically format your resume to match the selected template's style,
            ensuring professional presentation and visual impact.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  templatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  templateOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  templateOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  selectedIcon: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  templatePreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  templatePreviewSelected: {
    backgroundColor: '#e3f2fd',
  },
  templatePreviewDefault: {
    backgroundColor: '#f0f0f0',
  },
  previewIcon: {
    fontSize: 40,
  },
  templateNameOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  templateNameOverlaySelected: {
    color: '#0d47a1',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  templateNameOverlayDefault: {
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  templateNameSelected: {
    color: '#0d47a1',
  },
  templateNameDefault: {
    color: '#333',
  },
  templateDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  templateDescriptionSelected: {
    color: '#0d47a1',
  },
  templateDescriptionDefault: {
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 12,
  },
  infoIcon: {
    fontSize: 18,
    color: '#0d47a1',
    marginRight: 10,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: 12,
    color: '#0d47a1',
  },
});