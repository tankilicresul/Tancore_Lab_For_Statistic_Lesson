// Script to build fully separated, micro-topic curriculum across all 16 modules
const fs = require('fs');
const path = require('path');

console.log('Generating fully separated, bite-sized micro-curriculum for all 16 modules...');

// We will load existing modules, preserve all case exams, metadata, and expand all bundled lessons into isolated standalone lessons!
const modulesDir = path.join(__dirname, '../src/data');

// Let's create our comprehensive lesson definitions for each module.
// Every lesson will strictly follow:
// 1. Single concept focus
// 2. conceptCard formatted with clear theory & KaTeX
// 3. companyExample formatted with worked example
// 4. questions with numeric/multiple-choice interactive question + KaTeX explanation
// 5. vocabTerms and realWorldBox

require('./build_modules_content.cjs');
