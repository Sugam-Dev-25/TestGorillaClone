const PDFDocument = require('pdfkit');

class PDFService {
    generateCertificate(candidateName, assessmentTitle, score, totalMarks, date) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Outer Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#4F46E5");

            // Header Title
            doc.fontSize(30).fillColor('#4F46E5').text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' });
            doc.moveDown(0.5);

            doc.fontSize(16).fillColor('#374151').text('This is proudly presented to', { align: 'center' });
            doc.moveDown(0.5);

            // Candidate Name
            doc.fontSize(26).fillColor('#1F2937').text(candidateName, { align: 'center', underline: true });
            doc.moveDown(0.8);

            // Details
            doc.fontSize(14).fillColor('#4B5563').text(`For successfully passing the assessment:`, { align: 'center' });
            doc.fontSize(18).fillColor('#4F46E5').text(assessmentTitle, { align: 'center' });
            doc.moveDown(0.5);

            doc.fontSize(12).fillColor('#6B7280').text(`Score Secured: ${score} / ${totalMarks}`, { align: 'center' });
            doc.text(`Issue Date: ${new Date(date).toLocaleDateString()}`, { align: 'center' });

            doc.end();
        });
    }
}

module.exports = new PDFService();