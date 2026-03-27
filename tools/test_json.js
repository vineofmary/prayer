const fs = require('fs');
const data = JSON.parse(fs.readFileSync('app/src/main/assets/bible/NKJV_New_King_James_English_Bible_1982AD.json', 'utf8'));
const verses = data.verses || data; // depending on structure
let arr = Array.isArray(verses) ? verses : [];
const matches = arr.filter(v => v.book === 19 && v.chapter === 136).slice(0, 5);
console.log(JSON.stringify(matches, null, 2));
