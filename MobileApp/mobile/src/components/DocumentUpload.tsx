import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import RNFS from 'react-native-fs';
import { OptimizedResumeForm } from '../components/OptimizedResumeForm';
import { Buffer } from 'buffer';
import mammoth from 'mammoth';
import { supabase } from '../services/supabaseService';

import { NavigationProp } from '@react-navigation/native';

interface DocumentUploadProps {
  onContentExtracted: (content: string) => void;
  onBack: () => void;
  navigation?: NavigationProp<any>;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onContentExtracted, onBack, navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [extractedContent, setExtractedContent] = useState('');

  const validateDocumentFile = (file: any) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'text/markdown'];

    // Safely get file extension, falling back to extracting from URI if name is not available
    const fileName = file.name || file.uri.split('/').pop() || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.mimeType) && !['pdf', 'docx', 'doc', 'txt', 'md'].includes(fileExtension || '')) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a PDF, DOCX, DOC, TXT, or MD file.'
      };
    }

    if (file.size && file.size > 10 * 1024 * 1024) { // 10MB limit
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { valid: true };
  };

  const parseDocument = async (file: any): Promise<string> => {
    try {
      const fileName = file.name || file.uri.split('/').pop() || '';
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      // For text files, we can read the content directly
      if (file.mimeType.includes('text/') || fileExtension === 'txt' || fileExtension === 'md') {
        const content = await FileSystem.readAsStringAsync(file.uri);
        return content;
      }

      if (file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExtension === 'docx') {
        try {
          const base64Content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });
          const arrayBuffer = Buffer.from(base64Content, 'base64');
          const result = await mammoth.extractRawText({ arrayBuffer });
          return result.value;
        } catch (readErr) {
          console.error('Error reading DOCX file:', readErr);
          throw new Error(`Failed to read DOCX file: ${readErr.message}`);
        }
      }

      if (file.mimeType === 'application/pdf' || fileExtension === 'pdf') {
        try {
          // Convert PDF to base64 and send to deployed Supabase Edge Function
          const base64Content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });

          // Call the deployed Supabase Edge Function to parse the PDF
          const { data, error } = await supabase.functions.invoke('pdf-parser', {
            body: JSON.stringify({ fileContent: base64Content }),
          });

          if (error) {
            console.error('Supabase PDF parser error:', error);
            throw new Error(`PDF parsing failed: ${error.message}`);
          }

          if (!data) {
            console.error('PDF parser returned no data:', data);
            throw new Error('PDF parsing returned no data');
          }

          // The Supabase function may return text as a string or as an array of text segments
          let extractedText = '';
          if (typeof data.text === 'string') {
            extractedText = data.text;
          } else if (Array.isArray(data.text)) {
            // If it's an array, join all segments
            extractedText = data.text.join('\n');
          } else {
            console.error('PDF parser returned unexpected data format:', data);
            throw new Error('PDF parsing returned invalid data format');
          }

          console.log('PDF parsed successfully via Supabase function');
          return extractedText;
        } catch (error: any) {
          console.error('Error processing PDF file:', error);
          throw new Error(`Failed to process PDF file: ${error.message || 'PDF parsing failed'}`);
        }
      }

      // For DOC files (older Word format)
      if (file.mimeType === 'application/msword' || fileExtension === 'doc') {
        throw new Error('Parsing .doc files is not supported in the mobile app.');
      }

      // Fallback for any other file type
      const content = await FileSystem.readAsStringAsync(file.uri);
      return content;
    } catch (err) {
      console.error('Error parsing document:', err);
      throw new Error(`Failed to parse document content: ${err.message}`);
    }
  };

  const handleDocumentPick = async () => {
    // Prevent multiple simultaneous document picks
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError('');
      setExtractedContent('');

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/markdown'
        ],
        copyToCacheDirectory: true
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return; // User cancelled
      }

      const file = result.assets[0];

      // Validate file
      const validation = validateDocumentFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      setIsProcessing(true);
      setUploadedFileName(file.name);

      try {
        const content = await parseDocument(file);

        // Ensure content is a string and has content after trimming
        if (typeof content !== 'string' || !content || content.trim().length === 0) {
          throw new Error('No text content found in the document. Please ensure the file contains text.');
        }

        setExtractedContent(content);
        console.log('✅ Document parsed successfully:', content.substring(0, 100) + '...');
      } catch (err: any) {
        console.error('Error processing document:', err);
        setError(err.message || 'Failed to process document. Please try again.');
        setUploadedFileName('');
      } finally {
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Error picking document:', err);
      setError(err.message || 'Failed to pick document. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (extractedContent) {
      onContentExtracted(extractedContent);
    }
  };

  const handleReset = () => {
    setExtractedContent('');
    setUploadedFileName('');
    setError('');
  };

  if (!extractedContent) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upload Your Resume</Text>
        </View>

        <View style={styles.uploadArea} onTouchStart={handleDocumentPick}>
          <View style={styles.uploadIconContainer}>
            <Text style={styles.uploadIcon}>📄</Text>
          </View>
          <Text style={styles.uploadTitle}>Tap to select your resume</Text>
          <Text style={styles.uploadSubtitle}>or drag & drop (simulated)</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentPick}>
            <Text style={styles.uploadButtonText}>Choose File</Text>
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>Processing {uploadedFileName}...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Supported Formats</Text>
          <View style={styles.formatTags}>
            <Text style={[styles.formatTag, styles.pdfTag]}>PDF</Text>
            <Text style={[styles.formatTag, styles.docxTag]}>DOCX</Text>
            <Text style={[styles.formatTag, styles.txtTag]}>TXT</Text>
            <Text style={[styles.formatTag, styles.mdTag]}>MD</Text>
          </View>
          <Text style={styles.infoText}>
            Your document is processed locally in your device. We only extract the text content to help optimize your resume.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Review Content</Text>
      </View>

      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successText}>Document processed successfully!</Text>
        <Text style={styles.successDetails}>
          {uploadedFileName} • {extractedContent.length} characters extracted
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>Extracted Content</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Upload Different File</Text>
        </TouchableOpacity>

        <View style={styles.textArea}>
          <OptimizedResumeForm
            initialContent={extractedContent}
            onContentChange={setExtractedContent}
          />
        </View>

        <Text style={styles.contentHint}>
          You can edit the extracted content before proceeding to AI optimization.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
          <Text style={styles.secondaryButtonText}>← Upload Different File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue to AI Optimization →</Text>
        </TouchableOpacity>
      </View>
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
  uploadArea: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    marginBottom: 20,
  },
  uploadIconContainer: {
    marginBottom: 15,
  },
  uploadIcon: {
    fontSize: 60,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  processingContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#0d47a1',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
  },
  infoContainer: {
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33691e',
    marginBottom: 10,
  },
  formatTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  formatTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
  },
  pdfTag: {
    backgroundColor: '#ffcdd2',
    color: '#c62828',
  },
  docxTag: {
    backgroundColor: '#bbdefb',
    color: '#1565c0',
  },
  txtTag: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  mdTag: {
    backgroundColor: '#fff3e0',
    color: '#ef6c00',
  },
  infoText: {
    fontSize: 14,
    color: '#558b2f',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  successDetails: {
    fontSize: 14,
    color: '#558b2f',
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resetButton: {
    alignSelf: 'flex-end',
  },
  resetButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  textArea: {
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  contentHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DocumentUpload;