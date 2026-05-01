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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('process.env.NEXT_PUBLIC_API_URL') || content.includes('http://localhost:5000')) {
        console.log(`Fixing ${file}`);
        
        // Match both hardcoded localhost and our previous broken replacement
        // Case 1: "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/..." (in double quotes)
        content = content.replace(/"\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000'\}(.*?)"/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1` ");
        
        // Case 2: 'http://localhost:5000' (simple hardcoded)
        content = content.replace(/['"]http:\/\/localhost:5000['"]/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`");

        // Case 3: remaining hardcoded inside other strings
        content = content.replace(/http:\/\/localhost:5000/g, "\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");
        
        // Final check: if it's already in a template literal, don't double backtick
        // This is tricky, but our script is simple.
        
        fs.writeFileSync(file, content);
    }
});
