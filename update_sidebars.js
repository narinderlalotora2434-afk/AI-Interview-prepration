const fs = require('fs');
const path = require('path');

const directory = './client/src/app';

function updateSidebar(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateSidebar(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Don't update the roadmaps page itself as we already built it
      if (fullPath.includes('roadmaps')) continue;

      // Ensure MapIcon is imported
      if (!content.includes('Map as MapIcon')) {
        content = content.replace(/Zap,/, 'Zap,\n  Map as MapIcon,');
      }

      // Add the link after Daily Quests
      const searchStr = /<Link href="\/quests".*?<\/Link>/s;
      const match = content.match(searchStr);
      
      if (match && !content.includes('href="/roadmaps"')) {
        const insertLink = `
          <Link href="/roadmaps" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MapIcon className="w-5 h-5" />
            Placement Roadmaps
          </Link>`;
        
        content = content.replace(searchStr, match[0] + insertLink);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated sidebar in ${fullPath}`);
      }
    }
  }
}

updateSidebar(directory);
console.log("Done updating sidebars.");
