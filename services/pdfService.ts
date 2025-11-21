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
  
  // Parse and render the content
  const lines = content.split('\n');
  lines.forEach(line => {
    let element: HTMLElement;
    
    if (line.startsWith('###')) {
      element = document.createElement('h3');
      element.textContent = line.replace('###', '').trim();
      element.style.fontSize = '18px';
      element.style.fontWeight = 'bold';
      element.style.textTransform = 'uppercase';
      element.style.borderBottom = '2px solid #e5e7eb';
      element.style.paddingBottom = '8px';
      element.style.marginTop = '32px';
      element.style.marginBottom = '16px';
    } else if (line.startsWith('##')) {
      element = document.createElement('h2');
      element.textContent = line.replace('##', '').trim();
      element.style.fontSize = '24px';
      element.style.fontWeight = 'bold';
      element.style.marginTop = '32px';
      element.style.marginBottom = '12px';
    } else if (line.startsWith('#')) {
      element = document.createElement('h1');
      element.textContent = line.replace('#', '').trim();
      element.style.fontSize = '36px';
      element.style.fontWeight = 'bold';
      element.style.textAlign = 'center';
      element.style.marginBottom = '40px';
    } else if (line.startsWith('-')) {
      element = document.createElement('li');
      element.textContent = line.replace('-', '').trim();
      element.style.marginLeft = '16px';
      element.style.marginBottom = '8px';
      element.style.paddingLeft = '4px';
      element.style.listStyleType = 'disc';
      element.style.display = 'list-item';
    } else if (line.trim() === '') {
      element = document.createElement('div');
      element.style.height = '8px';
    } else {
      element = document.createElement('p');
      element.textContent = line;
      element.style.marginBottom = '12px';
      element.style.lineHeight = '1.6';
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
