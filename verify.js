const fs = require('fs');
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const verifier = require('email-verify');

const inputFile = 'input.csv';
const outputFile = 'verified_emails.csv';

const parser = parse({ columns: true }, function (err, records) {
  if (err) {
    console.error('Error parsing CSV:', err);
    return;
  }

  const verifiedEmails = [];

  records.forEach(record => {
    verifier.verify(record.email, function (err, info) {
      if (err) {
        console.log(err);
      } else if (info.success) {
        verifiedEmails.push(record);
      }

      if (verifiedEmails.length === records.length) {
        stringify(verifiedEmails, { header: true }, function (err, output) {
          if (err) {
            console.error('Error writing CSV:', err);
            return;
          }
          fs.writeFileSync(outputFile, output);
        });
      }
    });
  });
});

fs.createReadStream(inputFile).pipe(parser);
