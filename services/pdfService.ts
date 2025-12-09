import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from HTML content
 * @param content - The resume content in markdown/text format
 * @param filename - The name of the PDF file to download
 */
export const generatePDFFromContent = async (content: string, filename: string = 'resume.pdf'): Promise<void> => {
  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '60px';
  container.style.backgroundColor = 'white';
  container.style.fontFamily = 'Arial, sans-serif';
  
  // Parse and render the content as plain text - no markdown formatting
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
      element = document.createElement('p');
      element.textContent = cleanLine;
      element.style.marginBottom = '12px';
      element.style.lineHeight = '1.6';
      element.style.fontSize = '12px';
      element.style.color = '#000000'; // Ensure black text
    }

    container.appendChild(element);
  });
  
  document.body.appendChild(container);
  
  try {
    // Generate canvas from the container
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
 * Generate a PDF from a DOM element
 * @param element - The HTML element to convert to PDF
 * @param filename - The name of the PDF file to download
 */
export const generatePDFFromElement = async (element: HTMLElement, filename: string = 'resume.pdf'): Promise<void> => {
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
};
