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
  
  // Parse markdown content and apply template-specific styling
  const lines = content.split('\n');
  let inList = false;
  
  lines.forEach(line => {
    let element: HTMLElement;
    
    if (line.startsWith('###')) {
      // Section headers
      element = document.createElement('h3');
      element.textContent = line.replace('###', '').trim();
      element.style.fontSize = `${style.sectionSize}px`;
      element.style.fontWeight = 'bold';
      element.style.color = style.primaryColor;
      element.style.marginTop = `${style.sectionSpacing}px`;
      element.style.marginBottom = '12px';
      element.style.textTransform = template === ResumeTemplate.EXECUTIVE ? 'uppercase' : 'none';
      element.style.borderBottom = template === ResumeTemplate.CLASSIC 
        ? `${style.accentWidth}px solid ${style.secondaryColor}` 
        : 'none';
      element.style.paddingBottom = '8px';
      
      // Add accent bar for Modern template
      if (template === ResumeTemplate.MODERN) {
        const accent = document.createElement('div');
        accent.style.width = '40px';
        accent.style.height = `${style.accentWidth}px`;
        accent.style.backgroundColor = style.primaryColor;
        accent.style.marginTop = '4px';
        element.appendChild(accent);
      }
      
      inList = false;
    } else if (line.startsWith('##')) {
      // Subsection headers
      element = document.createElement('h2');
      element.textContent = line.replace('##', '').trim();
      element.style.fontSize = `${style.sectionSize + 2}px`;
      element.style.fontWeight = 'bold';
      element.style.color = style.primaryColor;
      element.style.marginTop = `${style.sectionSpacing + 4}px`;
      element.style.marginBottom = '10px';
      inList = false;
    } else if (line.startsWith('#')) {
      // Main header (name)
      element = document.createElement('h1');
      element.textContent = line.replace('#', '').trim();
      element.style.fontSize = `${style.headerSize}px`;
      element.style.fontWeight = 'bold';
      element.style.color = style.primaryColor;
      element.style.textAlign = 'center';
      element.style.marginBottom = '30px';
      element.style.letterSpacing = template === ResumeTemplate.EXECUTIVE ? '2px' : '0';
      inList = false;
    } else if (line.startsWith('-')) {
      // List items
      if (!inList) {
        const ul = document.createElement('ul');
        ul.style.marginLeft = '20px';
        ul.style.marginBottom = '12px';
        container.appendChild(ul);
        inList = true;
      }
      
      element = document.createElement('li');
      element.textContent = line.replace('-', '').trim();
      element.style.marginBottom = '6px';
      element.style.fontSize = `${style.bodySize}px`;
      element.style.color = style.secondaryColor;
      element.style.listStyleType = template === ResumeTemplate.MODERN ? 'disc' : 'square';
      
      // Add to the last ul element
      const lastUl = container.lastElementChild as HTMLElement;
      if (lastUl && lastUl.tagName === 'UL') {
        lastUl.appendChild(element);
        return;
      }
    } else if (line.trim() === '') {
      element = document.createElement('div');
      element.style.height = '8px';
      inList = false;
    } else {
      // Regular paragraphs
      element = document.createElement('p');
      element.textContent = line;
      element.style.marginBottom = '10px';
      element.style.fontSize = `${style.bodySize}px`;
      element.style.color = style.secondaryColor;
      inList = false;
    }
    
    if (element && element.tagName !== 'LI') {
      container.appendChild(element);
    }
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
