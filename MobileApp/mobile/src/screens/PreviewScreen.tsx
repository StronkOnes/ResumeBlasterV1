import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResumeData } from '../types';
import { resumeService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { printToFileAsync } from 'expo-print';

interface RouteParams {
  resumeData?: ResumeData;
  content?: string;
}

const PreviewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Use the content passed from the optimization screen
  const content = routeParams.content || routeParams.resumeData?.enhanced_content || '';
  const resumeData = routeParams.resumeData;

  const handleSaveResume = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save a resume');
      return;
    }

    // Check if we have resume data to save, if not, create a new one
    if (!resumeData) {
      Alert.alert('Error', 'No resume data available to save');
      return;
    }

    // If the resume already exists (has an ID), update it instead of creating
    if (resumeData.id) {
      // For now, just navigate back since it's already saved during generation
      navigation.goBack();
      return;
    }

    setLoading(true);
    try {
      // Create the resume with the current user ID
      const newResumeData: ResumeData = {
        ...resumeData,
        user_id: user.id,
      };

      const savedResume = await resumeService.createResume(newResumeData);
      Alert.alert('Success', 'Resume saved successfully!');

      // Navigate back to the dashboard or history
      navigation.goBack();
    } catch (error) {
      console.error('Error saving resume:', error);
      Alert.alert('Error', 'Failed to save resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // Create HTML content for the PDF with proper formatting
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
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
          <h1>Resume</h1>
          <div class="contact">
            Generated on ${new Date().toLocaleDateString()}
          </div>
          <div class="content">
            ${content.replace(/\n/g, '<br>')}
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
    } finally {
      setLoading(false);
    }
  };

  // Function to handle DOCX download
  const handleDownloadDOCX = async () => {
    setLoading(true);
    try {
      // For DOCX, we'll share as a text file with .docx extension since we don't have a proper DOCX library
      // In a full implementation, we would use a library to generate a proper DOCX
      const fileName = `${resumeData?.job_title || 'resume'}-${new Date().toISOString().split('T')[0]}.docx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write content to file
      await FileSystem.writeAsStringAsync(fileUri, content);

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dialogTitle: 'Share your resume DOCX',
      });
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      Alert.alert('Error', 'Failed to download resume as DOCX. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveResume}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save Resume'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.pdfButton, loading && styles.disabledButton]}
          onPress={handleDownloadPDF}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'PDF...' : 'PDF'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.docxButton, loading && styles.disabledButton]}
          onPress={handleDownloadDOCX}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'DOCX...' : 'DOCX'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    minHeight: 400,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  pdfButton: {
    backgroundColor: '#FF5722',
  },
  docxButton: {
    backgroundColor: '#2196F3',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PreviewScreen;