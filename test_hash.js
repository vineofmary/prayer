const text = "፨ Reader: The bush which Moses saw burning with fire in the wilderness, whose branches were not consumed,";
const nodeHash = Buffer.from(text).toString('base64').substring(0, 10);
const browserHash = btoa(unescape(encodeURIComponent(text))).substring(0, 10);
console.log(nodeHash === browserHash, nodeHash, browserHash);
