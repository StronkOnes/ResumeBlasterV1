import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ResumeData, OptimizationMode } from '../types';
import { resumeService } from '../services/supabaseService';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useTheme();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const userResumes = await resumeService.getUserResumes();
      if (userResumes) {
        setResumes(userResumes);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      Alert.alert('Error', 'Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (resume: ResumeData) => {
    navigation.navigate('Preview', { resumeData: resume, content: resume.enhanced_content });
  };

  const handleEdit = (resume: ResumeData) => {
    // For the mobile app, editing should take the user to the wizard with the resume content pre-filled
    // Using the Optimization screen with pre-filled content to go through the wizard again
    navigation.navigate('Optimization', {
      method: 'wizard',
      content: resume.original_content || resume.enhanced_content, // Use original content if available, otherwise enhanced
      resumeData: resume // Pass the resume data for context
    });
  };

  const handleDownloadPDF = async (resume: ResumeData) => {
    if (!resume.enhanced_content) {
      Alert.alert('Error', 'No content available to download.');
      return;
    }

    try {
      // Create HTML content for the PDF with proper formatting
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${resume.job_title || 'Resume'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              font-size: 12px;
            }
            h1 {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              color: #2c3e50;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .contact {
              text-align: center;
              margin-bottom: 20px;
              color: #666;
            }
            .content {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>${resume.job_title || 'Resume'}</h1>
          <div class="contact">
            Generated on ${new Date().toLocaleDateString()}
          </div>
          <div class="content">
            ${resume.enhanced_content.replace(/\n/g, '<br>')}
          </div>
        </body>
        </html>
      `;

      // Generate the PDF file
      const file = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Share the PDF file
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share your resume PDF',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download resume as PDF. Please try again.');
    }
  };

  const handleDownloadDOCX = async (resume: ResumeData) => {
    if (!resume.enhanced_content) {
      Alert.alert('Error', 'No content available to download.');
      return;
    }

    try {
      // For DOCX, we'll share as a text file with .docx extension since we don't have a proper DOCX library
      // In a full implementation, we would use a library to generate a proper DOCX
      const fileName = `${resume.job_title || 'resume'}-${new Date().toISOString().split('T')[0]}.docx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write content to file
      await FileSystem.writeAsStringAsync(fileUri, resume.enhanced_content);

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dialogTitle: 'Share your resume DOCX',
      });
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      Alert.alert('Error', 'Failed to download resume as DOCX. Please try again.');
    }
  };

  const handleDelete = async (resume: ResumeData) => {
    if (!resume.id) return;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this resume? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (resume.id) {
              setDeletingId(resume.id);
              try {
                await resumeService.deleteResume(resume.id);
                setResumes(resumes.filter(r => r.id !== resume.id));
              } catch (error) {
                console.error('Error deleting resume:', error);
                Alert.alert('Error', 'Failed to delete resume. Please try again.');
              } finally {
                setDeletingId(null);
              }
            }
          }
        }
      ]
    );
  };

  const renderResumeItem = ({ item }: { item: ResumeData }) => {
    const title = item.job_title || 'Untitled Resume';
    const date = item.generated_at
      ? new Date(item.generated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Unknown date';

    return (
      <View style={[
        styles.resumeItem,
        {
          backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
          shadowColor: isDarkMode ? '#000' : '#000'
        }
      ]}>
        <View style={styles.resumeHeader}>
          <View>
            <Text style={[styles.resumeTitle, { color: isDarkMode ? '#fff' : '#333' }]}>{title}</Text>
            <Text style={[styles.resumeDate, { color: isDarkMode ? '#aaa' : '#666' }]}>{date}</Text>
          </View>
          {item.enhancement_mode === OptimizationMode.POWER_BOOST && (
            <View style={styles.boostTag}>
              <Text style={styles.boostTagText}>BOOSTED</Text>
            </View>
          )}
        </View>

        <View style={styles.resumeInfo}>
          {item.job_description_used ? (
            <View style={styles.jobDescTag}>
              <Text style={styles.jobDescTagText}>Tailored to Job Description</Text>
            </View>
          ) : (
            <View style={styles.standardTag}>
              <Text style={styles.standardTagText}>Standard Optimization</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.previewButton]}
            onPress={() => handlePreview(item)}
          >
            <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#333' }]}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pdfButton]}
            onPress={() => handleDownloadPDF(item)}
            disabled={downloadingId === item.id}
          >
            <Text style={styles.buttonText}>
              PDF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.docxButton]}
            onPress={() => handleDownloadDOCX(item)}
            disabled={downloadingId === item.id}
          >
            <Text style={styles.buttonText}>
              DOCX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.editButton, { borderColor: isDarkMode ? '#444' : '#ddd' }]}
            onPress={() => handleEdit(item)}
          >
            <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#333' }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleDelete(item)}
            disabled={deletingId === item.id}
          >
            <Text style={styles.buttonText}>
              {deletingId === item.id ? '...' : 'Delete'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>My Resumes</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.textColor }}>Loading resumes...</Text>
        </View>
      ) : resumes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateIcon, { color: isDarkMode ? '#666' : '#ccc' }]}>📄</Text>
          <Text style={[styles.emptyStateText, { color: theme.textColor }]}>No resumes yet</Text>
          <Text style={[styles.emptyStateSubtext, { color: isDarkMode ? '#aaa' : '#666' }]}>Create your first 10/10 resume now</Text>
        </View>
      ) : (
        <FlatList
          data={resumes}
          renderItem={renderResumeItem}
          keyExtractor={(item) => item.id || `resume-${Math.random()}`}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 60,
    color: '#ccc',
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  resumeItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  resumeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resumeDate: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 2,
  },
  boostTag: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  boostTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  resumeInfo: {
    marginBottom: 15,
  },
  jobDescTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDescTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  standardTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  standardTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565c0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  previewButton: {
    backgroundColor: '#e3f2fd',
  },
  pdfButton: {
    backgroundColor: '#FF5722',
  },
  docxButton: {
    backgroundColor: '#2196F3',
  },
  editButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default HistoryScreen;
