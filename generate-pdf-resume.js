const pdf = require('html-pdf');
const options = { format: 'A4' };
const fs = require('fs')
const html = fs.readFileSync('./static/html/resume.html', 'utf8');

pdf.create(html, options).toFile('./static/pdf/resume.pdf', (err, res) => {
  console.log('PDF resume is generated succesfully')
});
