const text = "Oh, give thanks to the LORD, for <i>He is</i> good! <span class=\"rubric-red\">For His mercy <i>endures</i> forever</span>.";
const refrainRegex = /\s*(<span class="rubric-red">)?(For His mercy (?:<i>)?endures(?:<\/i>)? forever)(<\/span>)?/g;
console.log(text.replace(refrainRegex, (match, p1, p2, p3) => {
    return '<br>' + (p1 || '') + p2 + (p3 || '');
}));
