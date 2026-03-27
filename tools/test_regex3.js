let processedText = "To Him who made great lights, <span class=\"rubric-red\">For His mercy <i>endures</i> forever</span>;";

const refrainRegex = /\s*(<span class="rubric-red">)?(For His mercy (?:<i>)?endures(?:<\/i>)? forever)(<\/span>)?/g;
let newText = processedText.replace(refrainRegex, (match, p1, p2, p3) => {
    return '<br>' + (p1 || '') + p2 + (p3 || '');
});

console.log("Original:", processedText);
console.log("Replaced:", newText);
