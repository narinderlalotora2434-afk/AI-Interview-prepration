const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = path.resolve(__dirname, 'server/src');
const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Internal server error')) {
        console.log(`Fixing errors in ${file}`);
        // Replace res.status(500).json({ error: 'Internal server error' })
        // with detailed error reporting
        const fixed = content.replace(/res\.status\(500\)\.json\(\{\s*error:\s*'Internal server error'\s*\}\)/g, 
            "res.status(500).json({ error: error.message || 'Internal server error' })");
        
        fs.writeFileSync(file, fixed);
    }
});
