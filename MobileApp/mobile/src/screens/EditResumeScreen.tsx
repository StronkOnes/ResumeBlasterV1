import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ResumeForm from '../components/ResumeForm';
import { ResumeData, OptimizationMode } from '../types';

interface EditResumeScreenProps {
  route: any;
  navigation: any;
}

const EditResumeScreen: React.FC<EditResumeScreenProps> = ({ route, navigation }) => {
  const { resumeData } = route.params || {};
  const nav = useNavigation();

  const handleSaveResume = (data: ResumeData) => {
    // In a real app, this would save to a database or state management system
    console.log('Saving resume:', data);
    // Navigate back to dashboard
    navigation.goBack();
  };

  const handleOptimize = (rawContent: string, mode: OptimizationMode, jobTitle?: string, jobDescription?: string) => {
    // Navigate to the optimization screen with the content and parameters
    navigation.navigate('Optimization', {
      content: rawContent,
      method: 'typing',
      mode,
      jobTitle,
      jobDescription
    });
  };

  return (
    <View style={styles.container}>
      <ResumeForm
        initialData={resumeData}
        onSave={handleSaveResume}
        onOptimize={handleOptimize}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6ff', // Light blue/purple background
  },
});

export default EditResumeScreen;