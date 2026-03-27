let processedText = "Oh, give thanks to the LORD, for <i>He</i> <i>is</i> good!  <span class=\"rubric-red\">For His mercy <i>endures</i> forever</span>.";

const refrainRegex = /\s*(<span class="rubric-red">)?(For His mercy (?:<i>)?endures(?:<\/i>)? forever)(<\/span>)?/g;
processedText = processedText.replace(refrainRegex, (match, p1, p2, p3) => {
    return '<br>' + (p1 || '') + p2 + (p3 || '');
});

console.log(processedText);
