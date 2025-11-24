import React, { useState } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';

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
    <div className="max-w-3xl mx-auto pb-24 pt-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
          className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
        >
          <Icons.Back size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Your Resume
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 mx-1 rounded-full transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Personal</span>
          <span>Summary</span>
          <span>Experience</span>
          <span>Education</span>
          <span>Skills</span>
          <span>Additional</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex gap-4">
        {currentStep > 1 && (
          <Button
            variant="secondary"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            <Icons.Back size={16} className="mr-2" />
            Previous
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="flex-1"
          >
            Next Step
            <Icons.Back size={16} className="ml-2 -rotate-180" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canProceed()}
            className="flex-1"
          >
            Complete & Continue to AI Optimization
            <Icons.Sparkles size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Step Components
const PersonalInfoStep: React.FC<{
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}> = ({ data, updateField }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
      Personal Information
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="(555) 123-4567"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => updateField('location', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="New York, NY"
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          LinkedIn
        </label>
        <input
          type="url"
          value={data.linkedIn}
          onChange={(e) => updateField('linkedIn', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Website/Portfolio
        </label>
        <input
          type="url"
          value={data.website}
          onChange={(e) => updateField('website', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="johndoe.com"
        />
      </div>
    </div>
  </div>
);

const SummaryStep: React.FC<{
  data: ResumeData;
  updateField: (field: keyof ResumeData, value: any) => void;
}> = ({ data, updateField }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
      Professional Summary
    </h3>
    
    <div>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Summary <span className="text-red-500">*</span>
      </label>
      <textarea
        value={data.summary}
        onChange={(e) => updateField('summary', e.target.value)}
        className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all resize-none text-slate-900 dark:text-white"
        placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Tip: Focus on your most relevant experience and what makes you unique. Keep it concise (2-4 sentences).
      </p>
    </div>
  </div>
);

const WorkExperienceStep: React.FC<{
  experiences: WorkExperience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof WorkExperience, value: any) => void;
  onRemove: (id: string) => void;
}> = ({ experiences, onAdd, onUpdate, onRemove }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Work Experience
      </h3>
      <Button onClick={onAdd} size="sm">
        <Icons.Sparkles size={14} className="mr-2" />
        Add Experience
      </Button>
    </div>
    
    {experiences.length === 0 ? (
      <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
        <Icons.User size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          No work experience added yet
        </p>
        <Button onClick={onAdd}>
          Add Your First Experience
        </Button>
      </div>
    ) : (
      experiences.map((exp, index) => (
        <div
          key={exp.id}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Experience #{index + 1}
            </h4>
            <button
              onClick={() => onRemove(exp.id)}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
            >
              <Icons.Download size={16} className="rotate-45" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) => onUpdate(exp.id, 'jobTitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Tech Corp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => onUpdate(exp.id, 'location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Jan 2020"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white disabled:opacity-50"
                    placeholder="Dec 2023"
                  />
                </div>
                <label className="flex items-center gap-2 mt-7 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => onUpdate(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Current
                  </span>
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all resize-none text-slate-900 dark:text-white"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

const EducationStep: React.FC<{
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Education, value: any) => void;
  onRemove: (id: string) => void;
}> = ({ education, onAdd, onUpdate, onRemove }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Education
      </h3>
      <Button onClick={onAdd} size="sm">
        <Icons.Sparkles size={14} className="mr-2" />
        Add Education
      </Button>
    </div>
    
    {education.length === 0 ? (
      <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
        <Icons.User size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          No education added yet
        </p>
        <Button onClick={onAdd}>
          Add Your Education
        </Button>
      </div>
    ) : (
      education.map((edu, index) => (
        <div
          key={edu.id}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Education #{index + 1}
            </h4>
            <button
              onClick={() => onRemove(edu.id)}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
            >
              <Icons.Download size={16} className="rotate-45" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Degree
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Institution
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => onUpdate(edu.id, 'institution', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="University Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => onUpdate(edu.id, 'location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="Boston, MA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Graduation Date
              </label>
              <input
                type="text"
                value={edu.graduationDate}
                onChange={(e) => onUpdate(edu.id, 'graduationDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="May 2020"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => onUpdate(edu.id, 'gpa', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                placeholder="3.8/4.0"
              />
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
        Skills
      </h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
          placeholder="e.g., JavaScript, Project Management, Data Analysis"
        />
        <Button onClick={handleAdd}>
          Add
        </Button>
      </div>
      
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => onRemove(skill)}
                className="hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full p-1 transition-colors"
              >
                <Icons.Download size={12} className="rotate-45" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">
          No skills added yet. Add your first skill above.
        </p>
      )}
    </div>
  );
};

const AdditionalStep: React.FC<{
  certifications: string[];
  achievements: string[];
  onAddCert: (cert: string) => void;
  onRemoveCert: (cert: string) => void;
  onAddAchievement: (achievement: string) => void;
  onRemoveAchievement: (achievement: string) => void;
}> = ({ certifications, achievements, onAddCert, onRemoveCert, onAddAchievement, onRemoveAchievement }) => {
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
    <div className="space-y-6">
      {/* Certifications */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Certifications <span className="text-slate-400 text-sm font-normal">(Optional)</span>
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCert()}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="e.g., AWS Certified Solutions Architect"
          />
          <Button onClick={handleAddCert}>
            Add
          </Button>
        </div>
        
        {certifications.length > 0 && (
          <ul className="space-y-2 mt-4">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <span className="text-slate-900 dark:text-white">{cert}</span>
                <button
                  onClick={() => onRemoveCert(cert)}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                >
                  <Icons.Download size={14} className="rotate-45" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Achievements <span className="text-slate-400 text-sm font-normal">(Optional)</span>
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
            placeholder="e.g., Increased sales by 150% in Q4 2023"
          />
          <Button onClick={handleAddAchievement}>
            Add
          </Button>
        </div>
        
        {achievements.length > 0 && (
          <ul className="space-y-2 mt-4">
            {achievements.map((achievement) => (
              <li
                key={achievement}
                className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <span className="text-slate-900 dark:text-white">{achievement}</span>
                <button
                  onClick={() => onRemoveAchievement(achievement)}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                >
                  <Icons.Download size={14} className="rotate-45" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <Icons.Sparkles size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Almost done!</p>
            <p className="text-blue-700 dark:text-blue-300">
              These sections are optional but can help make your resume stand out. 
              Click "Complete" when you're ready to optimize your resume with AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
