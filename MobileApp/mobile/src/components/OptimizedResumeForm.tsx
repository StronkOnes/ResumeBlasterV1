import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OptimizedResumeFormProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

export const OptimizedResumeForm: React.FC<OptimizedResumeFormProps> = ({ initialContent, onContentChange }) => {
  return (
    <TextInput
      style={styles.textInput}
      value={initialContent}
      onChangeText={onContentChange}
      multiline
      placeholder="Extracted content will appear here..."
      textAlignVertical="top"
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});