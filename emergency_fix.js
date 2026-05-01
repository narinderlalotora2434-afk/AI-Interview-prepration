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
    if (content.includes('http://localhost:5000') || content.includes('process.env.NEXT_PUBLIC_API_URL')) {
        console.log(`Cleaning up ${file}`);
        
        // This regex targets the messy nested template strings and hardcoded localhost
        // and replaces them with the clean hardcoded live URL.
        const cleanedContent = content.replace(/`\${process\.env\.NEXT_PUBLIC_API_URL.*?}`/g, `"${liveUrl}"`)
                                      .replace(/"\${process\.env\.NEXT_PUBLIC_API_URL.*?}"/g, `"${liveUrl}"`)
                                      .replace(/['"]http:\/\/localhost:5000['"]/g, `"${liveUrl}"`);
        
        // One more pass for any missed ones
        const finalContent = cleanedContent.replace(/\${process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000'}/g, liveUrl);

        fs.writeFileSync(file, finalContent);
    }
});
