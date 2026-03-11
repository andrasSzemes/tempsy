import type { Combinaison } from './combinaisonService';

function getSentenceWithSolution(task: Combinaison): string {
  if (task.phraseToShow.includes('(') && task.phraseToShow.includes(')')) {
    return task.phraseToShow.replace(/\(.*?\)/, task.conjuguatedVerbWithSubject);
  }

  return `${task.phraseToShow} ${task.conjuguatedVerbWithSubject}`.trim();
}

export async function downloadPracticeReportPdf(tasks: Combinaison[]): Promise<void> {
  const solvedTasks = tasks.filter((task) => task.isRight !== null);
  if (solvedTasks.length === 0) {
    return;
  }

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftPadding = 40;
  const rightPadding = 40;
  const contentWidth = pageWidth - leftPadding - rightPadding;

  let y = 44;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Practice Report', leftPadding, y);

  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, leftPadding, y);

  y += 16;
  y += 20;
  for (let i = 0; i < solvedTasks.length; i += 1) {
    const task = solvedTasks[i];
    const notFirstTry = task.numOfTentatives > 0 || task.isRight === false;
    const sentence = getSentenceWithSolution(task);
    const sentenceLines = doc.splitTextToSize(`${i + 1}. ${sentence}`, contentWidth);

    const blockHeight = sentenceLines.length * 12 + 20;

    if (y + blockHeight > pageHeight - 40) {
      doc.addPage();
      y = 44;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    if (notFirstTry) {
      doc.setTextColor(180, 30, 30); // dark red for not-first-try
    } else {
      doc.setTextColor(20, 20, 20); // normal text color
    }
    doc.text(sentenceLines, leftPadding, y);
    y += sentenceLines.length * 12 + 10;
  }

  doc.save(`practice-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
