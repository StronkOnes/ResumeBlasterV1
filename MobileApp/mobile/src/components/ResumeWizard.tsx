import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { InputMethod } from './MethodSelector';

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

interface ResumeData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;

  // Professional Summary
  summary: string;

  // Work Experience
  workExperience: WorkExperience[];

  // Education
  education: Education[];

  // Skills
  skills: string[];

  // Additional
  certifications: string[];
  achievements: string[];
}

interface ResumeWizardProps {
  onComplete: (content: string) => void;
  onBack: () => void;
}

export const ResumeWizard: React.FC<ResumeWizardProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
  });

  const updateField = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    updateField('workExperience', [...resumeData.workExperience, newExp]);
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = resumeData.workExperience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField('workExperience', updated);
  };

  const removeWorkExperience = (id: string) => {
    updateField('workExperience', resumeData.workExperience.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
    };
    updateField('education', [...resumeData.education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateField('education', updated);
  };

  const removeEducation = (id: string) => {
    updateField('education', resumeData.education.filter(edu => edu.id !== id));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      updateField('skills', [...resumeData.skills, skill.trim()]);
    }
  };

  const removeSkill = (skill: string) => {
    updateField('skills', resumeData.skills.filter(s => s !== skill));
  };

  const addCertification = (cert: string) => {
    if (cert.trim() && !resumeData.certifications.includes(cert.trim())) {
      updateField('certifications', [...resumeData.certifications, cert.trim()]);
    }
  };

  const removeCertification = (cert: string) => {
    updateField('certifications', resumeData.certifications.filter(c => c !== cert));
  };

  const addAchievement = (achievement: string) => {
    if (achievement.trim() && !resumeData.achievements.includes(achievement.trim())) {
      updateField('achievements', [...resumeData.achievements, achievement.trim()]);
    }
  };

  const removeAchievement = (achievement: string) => {
    updateField('achievements', resumeData.achievements.filter(a => a !== achievement));
  };

  const convertToMarkdown = (): string => {
    let markdown = '';

    // Header with name
    markdown += `# ${resumeData.fullName}\n\n`;

    // Contact Info
    const contactInfo = [
      resumeData.email,
      resumeData.phone,
      resumeData.location,
      resumeData.linkedIn,
      resumeData.website
    ].filter(Boolean).join(' | ');

    if (contactInfo) {
      markdown += `${contactInfo}\n\n`;
    }

    // Professional Summary
    if (resumeData.summary) {
      markdown += `## Professional Summary\n\n${resumeData.summary}\n\n`;
    }

    // Work Experience
    if (resumeData.workExperience.length > 0) {
      markdown += `## Work Experience\n\n`;
      resumeData.workExperience.forEach(exp => {
        markdown += `### ${exp.jobTitle} - ${exp.company}\n`;
        markdown += `${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n\n`;
        if (exp.description) {
          markdown += `${exp.description}\n\n`;
        }
      });
    }

    // Education
    if (resumeData.education.length > 0) {
      markdown += `## Education\n\n`;
      resumeData.education.forEach(edu => {
        markdown += `### ${edu.degree}\n`;
        markdown += `${edu.institution}, ${edu.location}`;
        if (edu.gpa) {
          markdown += ` | GPA: ${edu.gpa}`;
        }
        markdown += `\n${edu.graduationDate}\n\n`;
      });
    }

    // Skills
    if (resumeData.skills.length > 0) {
      markdown += `## Skills\n\n`;
      resumeData.skills.forEach(skill => {
        markdown += `- ${skill}\n`;
      });
      markdown += '\n';
    }

    // Certifications
    if (resumeData.certifications.length > 0) {
      markdown += `## Certifications\n\n`;
      resumeData.certifications.forEach(cert => {
        markdown += `- ${cert}\n`;
      });
      markdown += '\n';
    }

    // Achievements
    if (resumeData.achievements.length > 0) {
      markdown += `## Achievements\n\n`;
      resumeData.achievements.forEach(achievement => {
        markdown += `- ${achievement}\n`;
      });
      markdown += '\n';
    }

    return markdown;
  };

  const handleComplete = () => {
    const markdown = convertToMarkdown();
    onComplete(markdown);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return resumeData.fullName.trim() !== '' && resumeData.email.trim() !== '';
      case 2:
        return resumeData.summary.trim() !== '';
      case 3:
        return resumeData.workExperience.length > 0;
      case 4:
        return resumeData.education.length > 0;
      case 5:
        return resumeData.skills.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={resumeData} updateField={updateField} />;
      case 2:
        return <SummaryStep data={resumeData} updateField={updateField} />;
      case 3:
        return (
          <WorkExperienceStep
            experiences={resumeData.workExperience}
            onAdd={addWorkExperience}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
          />
        );
      case 4:
        return (
          <EducationStep
            education={resumeData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        );
      case 5:
        return (
          <SkillsStep
            skills={resumeData.skills}
            onAdd={addSkill}
            onRemove={removeSkill}
          />
        );
      case 6:
        return (
          <AdditionalStep
            certifications={resumeData.certifications}
            achievements={resumeData.achievements}
            onAddCert={addCertification}
            onRemoveCert={removeCertification}
            onAddAchievement={addAchievement}
            onRemoveAchievement={removeAchievement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Create Your Resume</Text>
            <Text style={styles.subtitle}>Step {currentStep} of {totalSteps}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Personal</Text>
            <Text style={styles.progressLabel}>Summary</Text>
            <Text style={styles.progressLabel}>Experience</Text>
            <Text style={styles.progressLabel}>Education</Text>
            <Text style={styles.progressLabel}>Skills</Text>
            <Text style={styles.progressLabel}>Additional</Text>
          </View>
          <View style={styles.progressBar}>
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressStep,
                  step <= currentStep && styles.progressStepActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.content}>
          {renderStep()}
        </View>

        {/* Navigation */}
        <View style={styles.navContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonSecondary]}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.navButtonTextSecondary}>← Previous</Text>
            </TouchableOpacity>
          )}

          {currentStep < totalSteps ? (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                !canProceed() && styles.navButtonDisabled
              ]}
              onPress={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              <Text style={styles.navButtonTextPrimary}>Next Step</Text>
              <Text style={styles.navButtonTextPrimary}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                !canProceed() && styles.navButtonDisabled
              ]}
              onPress={handleComplete}
              disabled={!canProceed()}
            >
              <Text style={styles.navButtonTextPrimary}>Complete & Continue to AI Optimization</Text>
              <Text style={styles.navButtonTextPrimary}>✨</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Step Components
const PersonalInfoStep: React.FC<{
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}> = ({ data, updateField }) => (
  <View style={styles.card}>
    <Text style={styles.stepTitle}>Personal Information</Text>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        value={data.fullName}
        onChangeText={(value) => updateField('fullName', value)}
        placeholder="John Doe"
      />
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={data.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="john@example.com"
        keyboardType="email-address"
      />
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={data.phone}
        onChangeText={(value) => updateField('phone', value)}
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
      />
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={data.location}
        onChangeText={(value) => updateField('location', value)}
        placeholder="New York, NY"
      />
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>LinkedIn</Text>
      <TextInput
        style={styles.input}
        value={data.linkedIn}
        onChangeText={(value) => updateField('linkedIn', value)}
        placeholder="linkedin.com/in/johndoe"
      />
    </View>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Website/Portfolio</Text>
      <TextInput
        style={styles.input}
        value={data.website}
        onChangeText={(value) => updateField('website', value)}
        placeholder="johndoe.com"
      />
    </View>
  </View>
);

const SummaryStep: React.FC<{
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}> = ({ data, updateField }) => (
  <View style={styles.card}>
    <Text style={styles.stepTitle}>Professional Summary</Text>

    <View style={styles.formGroup}>
      <Text style={styles.label}>Summary *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={data.summary}
        onChangeText={(value) => updateField('summary', value)}
        placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
        multiline
        textAlignVertical="top"
      />
      <Text style={styles.hint}>
        Tip: Focus on your most relevant experience and what makes you unique. Keep it concise (2-4 sentences).
      </Text>
    </View>
  </View>
);

const WorkExperienceStep: React.FC<{
  experiences: WorkExperience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof WorkExperience, value: any) => void;
  onRemove: (id: string) => void;
}> = ({ experiences, onAdd, onUpdate, onRemove }) => {
  return (
    <View>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Work Experience</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+ Add Experience</Text>
        </TouchableOpacity>
      </View>

      {experiences.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>👤</Text>
          <Text style={styles.emptyStateText}>No work experience added yet</Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={onAdd}>
            <Text style={styles.emptyStateButtonText}>Add Your First Experience</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={experiences}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Experience #{index + 1}</Text>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  style={styles.input}
                  value={item.jobTitle}
                  onChangeText={(value) => onUpdate(item.id, 'jobTitle', value)}
                  placeholder="Software Engineer"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={item.company}
                  onChangeText={(value) => onUpdate(item.id, 'company', value)}
                  placeholder="Tech Corp"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={item.location}
                  onChangeText={(value) => onUpdate(item.id, 'location', value)}
                  placeholder="San Francisco, CA"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    value={item.startDate}
                    onChangeText={(value) => onUpdate(item.id, 'startDate', value)}
                    placeholder="Jan 2020"
                  />
                </View>

                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInput
                    style={styles.input}
                    value={item.endDate}
                    onChangeText={(value) => onUpdate(item.id, 'endDate', value)}
                    placeholder="Dec 2023"
                    editable={!item.current}
                  />
                </View>
              </View>

              <View style={styles.checkboxRow}>
                <Text style={styles.label}>Current</Text>
                <TouchableOpacity 
                  onPress={() => onUpdate(item.id, 'current', !item.current)}
                  style={[styles.checkbox, item.current && styles.checkboxActive]}
                >
                  {item.current && <Text style={styles.checkboxCheck}>✓</Text>}
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={item.description}
                  onChangeText={(value) => onUpdate(item.id, 'description', value)}
                  placeholder="Describe your responsibilities and achievements..."
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const EducationStep: React.FC<{
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Education, value: any) => void;
  onRemove: (id: string) => void;
}> = ({ education, onAdd, onUpdate, onRemove }) => {
  return (
    <View>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Education</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+ Add Education</Text>
        </TouchableOpacity>
      </View>

      {education.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎓</Text>
          <Text style={styles.emptyStateText}>No education added yet</Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={onAdd}>
            <Text style={styles.emptyStateButtonText}>Add Your Education</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={education}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Education #{index + 1}</Text>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Degree</Text>
                <TextInput
                  style={styles.input}
                  value={item.degree}
                  onChangeText={(value) => onUpdate(item.id, 'degree', value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Institution</Text>
                <TextInput
                  style={styles.input}
                  value={item.institution}
                  onChangeText={(value) => onUpdate(item.id, 'institution', value)}
                  placeholder="University Name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={item.location}
                  onChangeText={(value) => onUpdate(item.id, 'location', value)}
                  placeholder="Boston, MA"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Graduation Date</Text>
                  <TextInput
                    style={styles.input}
                    value={item.graduationDate}
                    onChangeText={(value) => onUpdate(item.id, 'graduationDate', value)}
                    placeholder="May 2020"
                  />
                </View>

                <View style={[styles.formGroup, styles.halfWidth]}>
                  <Text style={styles.label}>GPA (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={item.gpa}
                    onChangeText={(value) => onUpdate(item.id, 'gpa', value)}
                    placeholder="3.8/4.0"
                  />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const SkillsStep: React.FC<{
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}> = ({ skills, onAdd, onRemove }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill);
      setNewSkill('');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.stepTitle}>Skills</Text>

      <View style={styles.skillInputContainer}>
        <TextInput
          style={styles.input}
          value={newSkill}
          onChangeText={setNewSkill}
          onSubmitEditing={handleAdd}
          placeholder="e.g., JavaScript, Project Management, Data Analysis"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {skills.length > 0 ? (
        <View style={styles.skillsContainer}>
          {skills.map((skill) => (
            <View key={skill} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity onPress={() => onRemove(skill)}>
                <Text style={styles.skillRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptySkillsText}>No skills added yet. Add your first skill above.</Text>
      )}
    </View>
  );
};

const AdditionalStep: React.FC<{
  certifications: string[];
  achievements: string[];
  onAddCert: (cert: string) => void;
  onRemoveCert: (cert: string) => void;
  onAddAchievement: (achievement: string) => void;
  onRemoveAchievement: (achievement: string) => void;
}> = ({ 
  certifications, 
  achievements, 
  onAddCert, 
  onRemoveCert, 
  onAddAchievement, 
  onRemoveAchievement 
}) => {
  const [newCert, setNewCert] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleAddCert = () => {
    if (newCert.trim()) {
      onAddCert(newCert);
      setNewCert('');
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      onAddAchievement(newAchievement);
      setNewAchievement('');
    }
  };

  return (
    <View>
      {/* Certifications */}
      <View style={styles.card}>
        <Text style={styles.stepTitle}>Certifications</Text>

        <View style={styles.skillInputContainer}>
          <TextInput
            style={styles.input}
            value={newCert}
            onChangeText={setNewCert}
            onSubmitEditing={handleAddCert}
            placeholder="e.g., AWS Certified Solutions Architect"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCert}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {certifications.length > 0 && (
          <View style={styles.certificationsContainer}>
            {certifications.map((cert) => (
              <View key={cert} style={styles.certificationItem}>
                <Text style={styles.certificationText}>{cert}</Text>
                <TouchableOpacity onPress={() => onRemoveCert(cert)}>
                  <Text style={styles.certificationRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Achievements */}
      <View style={styles.card}>
        <Text style={styles.stepTitle}>Achievements</Text>

        <View style={styles.skillInputContainer}>
          <TextInput
            style={styles.input}
            value={newAchievement}
            onChangeText={setNewAchievement}
            onSubmitEditing={handleAddAchievement}
            placeholder="e.g., Increased sales by 150% in Q4 2023"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddAchievement}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {achievements.length > 0 && (
          <View style={styles.certificationsContainer}>
            {achievements.map((achievement) => (
              <View key={achievement} style={styles.certificationItem}>
                <Text style={styles.certificationText}>{achievement}</Text>
                <TouchableOpacity onPress={() => onRemoveAchievement(achievement)}>
                  <Text style={styles.certificationRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoIcon}>✨</Text>
        <View>
          <Text style={styles.infoTitle}>Almost done!</Text>
          <Text style={styles.infoDescription}>
            These sections are optional but can help make your resume stand out.
            Click "Complete" when you're ready to optimize your resume with AI.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  progressBar: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressStep: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 1,
  },
  progressStepActive: {
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  navContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  navButtonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteIcon: {
    color: '#ff3b30',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  skillText: {
    color: '#0d47a1',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
  },
  skillRemove: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptySkillsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  skillInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  certificationsContainer: {
    marginTop: 10,
  },
  certificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 5,
  },
  certificationText: {
    color: '#333',
    fontSize: 14,
  },
  certificationRemove: {
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateIcon: {
    fontSize: 48,
    color: '#ccc',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#0d47a1',
    marginTop: 2,
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