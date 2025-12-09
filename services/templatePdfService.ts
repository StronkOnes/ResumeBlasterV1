import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResumeTemplate } from '../types';

/**
 * Template-specific PDF styling configurations
 */
const TEMPLATE_STYLES = {
  [ResumeTemplate.MODERN]: {
    primaryColor: '#2563eb',
    secondaryColor: '#60a5fa',
    fontFamily: 'Helvetica',
    headerSize: 24,
    sectionSize: 16,
    bodySize: 11,
    lineHeight: 1.6,
    sectionSpacing: 20,
    accentWidth: 3,
  },
  [ResumeTemplate.CLASSIC]: {
    primaryColor: '#1f2937',
    secondaryColor: '#4b5563',
    fontFamily: 'Times',
    headerSize: 22,
    sectionSize: 14,
    bodySize: 11,
    lineHeight: 1.5,
    sectionSpacing: 18,
    accentWidth: 1,
  },
  [ResumeTemplate.EXECUTIVE]: {
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    fontFamily: 'Helvetica',
    headerSize: 26,
    sectionSize: 15,
    bodySize: 11,
    lineHeight: 1.7,
    sectionSpacing: 22,
    accentWidth: 2,
  },
};

/**
 * Generate a styled PDF based on template
 */
export const generateTemplatePDF = async (
  content: string,
  template: ResumeTemplate,
  filename: string = 'resume.pdf'
): Promise<void> => {
  const style = TEMPLATE_STYLES[template];
  
  // Create a temporary container with template-specific styling
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '60px';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = style.fontFamily;
  container.style.color = style.primaryColor;
  container.style.lineHeight = style.lineHeight.toString();
  
  // Parse content as plain text - no markdown formatting
  const lines = content.split('\n');

  lines.forEach(line => {
    let element: HTMLElement;

    // Remove any markdown formatting characters but preserve the text
    const cleanLine = line
      .replace(/^#+\s*/, '')      // Remove #, ##, ### headers
      .replace(/^-/, '')          // Remove list markers
      .replace(/^\s*[-*]\s*/, '') // Remove other list markers
      .trim();

    if (cleanLine === '') {
      element = document.createElement('div');
      element.style.height = '8px';
    } else {
      // All content as paragraphs with consistent styling
      element = document.createElement('p');
      element.textContent = cleanLine;
      element.style.marginBottom = '10px';
      element.style.fontSize = `${style.bodySize}px`;
      element.style.color = style.primaryColor; // Use primary color for consistent black text
      element.style.fontFamily = style.fontFamily;
    }

    container.appendChild(element);
  });
  
  document.body.appendChild(container);
  
  try {
    // Generate canvas from the styled container
    const canvas = await html2canvas(container, { 
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });
    
    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

/**
 * Generate PDF from DOM element with template styling
 */
export const generateTemplatePDFFromElement = async (
  element: HTMLElement,
  template: ResumeTemplate,
  filename: string = 'resume.pdf'
): Promise<void> => {
  const style = TEMPLATE_STYLES[template];
  
  // Apply template-specific styles to the element temporarily
  const originalStyles = {
    fontFamily: element.style.fontFamily,
    color: element.style.color,
  };
  
  element.style.fontFamily = style.fontFamily;
  element.style.color = style.primaryColor;
  
  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });
    
    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
  } finally {
    // Restore original styles
    element.style.fontFamily = originalStyles.fontFamily;
    element.style.color = originalStyles.color;
  }
};
