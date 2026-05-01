const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = path.resolve(__dirname, 'client/src');
const files = walk(srcDir);
const liveUrl = "https://ai-interview-prepration-2-nadp.onrender.com";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('ai-interview-prepration-2-nadp.onrender.com') || content.includes('${liveUrl}')) {
        console.log(`Final Fix in ${file}`);
        
        // Replace ${liveUrl} with the actual string
        const fixed = content.replace(/\${liveUrl}/g, liveUrl);
        
        // Ensure all are backticks for safety, but with the string inside
        const final = fixed.replace(/[`"']https:\/\/ai-interview-prepration-2-nadp\.onrender\.com.*?\/api\/(.*?)['"`]/g, `\`${liveUrl}/api/$1\``);

        fs.writeFileSync(file, final);
    }
});
