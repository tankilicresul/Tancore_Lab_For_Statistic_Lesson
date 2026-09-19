const fs = require('fs');

let code = fs.readFileSync('src/components/ConceptDiagram.tsx', 'utf8');

// Replace diagram headers with responsive flex
code = code.replaceAll(
  '<div className="flex items-center justify-between mb-3">',
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">'
);

// Replace badge containers so they wrap cleanly on mobile
code = code.replaceAll(
  'className="px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold"',
  'className="hidden sm:inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-bold shrink-0"'
);

fs.writeFileSync('src/components/ConceptDiagram.tsx', code, 'utf8');
console.log('ConceptDiagram updated successfully.');
