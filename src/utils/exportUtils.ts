import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportData {
  title: string;
  duration: string;
  summary: string;
  topics: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
  transcript: string;
}

// Export as PDF
export const exportToPDF = async (data: ExportData): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.title, margin, currentY);
    currentY += 15;

    // Duration
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Duration: ${data.duration}`, margin, currentY);
    currentY += 10;

    // Summary section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary', margin, currentY);
    currentY += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(data.summary, maxWidth);
    pdf.text(summaryLines, margin, currentY);
    currentY += summaryLines.length * 5 + 10;

    // Topics section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Topics', margin, currentY);
    currentY += 10;

    data.topics.forEach((topic) => {
      if (currentY > 270) { // Check if we need a new page
        pdf.addPage();
        currentY = margin;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${topic.timestamp} - ${topic.title}`, margin, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(topic.description, maxWidth);
      pdf.text(descLines, margin, currentY);
      currentY += descLines.length * 4 + 5;
    });

    // Transcript section (truncated for PDF)
    if (currentY > 250) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Transcript (Preview)', margin, currentY);
    currentY += 10;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const transcriptPreview = data.transcript.substring(0, 2000) + '...';
    const transcriptLines = pdf.splitTextToSize(transcriptPreview, maxWidth);
    
    // Only add transcript lines that fit on the page
    const remainingSpace = 280 - currentY;
    const maxLines = Math.floor(remainingSpace / 4);
    const limitedLines = transcriptLines.slice(0, maxLines);
    
    pdf.text(limitedLines, margin, currentY);

    // Save the PDF
    pdf.save(`${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF');
  }
};

// Export as Markdown
export const exportToMarkdown = (data: ExportData): void => {
  try {
    let markdown = '';

    // Title
    markdown += `# ${data.title}\n\n`;
    markdown += `**Duration:** ${data.duration}\n\n`;

    // Summary
    markdown += `## Summary\n\n`;
    markdown += `${data.summary}\n\n`;

    // Topics
    markdown += `## Topics\n\n`;
    data.topics.forEach((topic) => {
      markdown += `### ${topic.timestamp} - ${topic.title}\n\n`;
      markdown += `${topic.description}\n\n`;
    });

    // Transcript
    markdown += `## Full Transcript\n\n`;
    markdown += '```\n';
    markdown += data.transcript;
    markdown += '\n```\n';

    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Markdown:', error);
    throw new Error('Failed to export Markdown');
  }
};

// Export as JSON
export const exportToJSON = (data: ExportData): void => {
  try {
    const jsonData = {
      ...data,
      exportedAt: new Date().toISOString(),
      format: 'PodcastAI Export v1.0'
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export JSON');
  }
};

// Export summary card as image
export const exportSummaryAsImage = async (elementId: string, filename: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting image:', error);
    throw new Error('Failed to export image');
  }
};

// Generate shareable text for social media
export const generateShareText = (data: ExportData): string => {
  const shortenedSummary = data.summary.length > 200 
    ? data.summary.substring(0, 200) + '...' 
    : data.summary;

  return `🎧 Just analyzed "${data.title}" with PodcastAI!\n\n${shortenedSummary}\n\n#PodcastAI #PodcastSummary #AI`;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
};