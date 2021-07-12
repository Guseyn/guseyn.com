const html_to_pdf = require('html-pdf-node');
const options = { format: 'A4' };
const fs = require('fs')
const file = { content: fs.readFileSync('./static/html/resume.html', 'utf8') };

html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  fs.writeFileSync('./static/pdf/resume.pdf', pdfBuffer)
  console.log('PDF resume is generated succesfully')
});
