const fs = require('fs');
const code = fs.readFileSync('/Users/amman.win/StudioProjects/mount-of-mercy/app/src/main/assets/js/prayers.js', 'utf8');

const regex = /\{\s*"instruction"[\s\S]*?"reference": `Thursday Praise of Mary`[\s\S]*?"english": `(.*?)`[\s\S]*?"geez_script": `(.*?)`[\s\S]*?"amharic_script": `(.*?)`[\s\S]*?\}/g;

let matches;
let index = 0;
while ((matches = regex.exec(code)) !== null) {
  console.log(`[${index}] ENG: ${matches[1]}`);
  console.log(`[${index}] AMH: ${matches[3]}\n`);
  index++;
}
