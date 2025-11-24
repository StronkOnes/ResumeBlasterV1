#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const REQUIRED_TAGS = {
  single: ['name', 'email', 'phone', 'location', 'profile_summary'],
  arrays: ['work_experience', 'education', 'skills'],
  optional: ['certifications', 'achievements']
};

const TEMPLATES = [
  { name: 'Modern Template', file: 'Document 1.docx', path: path.join(__dirname, '../Templates/Document 1.docx') },
  { name: 'Classic Template', file: 'Document 2.docx', path: path.join(__dirname, '../Templates/Document 2.docx') },
  { name: 'Executive Template', file: 'Document 3.docx', path: path.join(__dirname, '../Templates/Document 3.docx') }
];

function extractTextFromDocx(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'binary');
    const zip = new PizZip(content);
    const documentXml = zip.file('word/document.xml').asText();
    const textMatches = documentXml.match(/<w:t[^>]*>([^<]*)</w:t>/g) || [];
    return textMatches.map(match => match.replace(/<w:t[^>]*>([^<]*)</w:t>/, '$1')).join('');
  } catch (error) {
    console.error('Error:', error.message);
    return '';
  }
}

function findTags(text) {
  const tagPattern = /{{[#/]?([a-z_]+)}}/g;
  const tags = new Set();
  let match;
  while ((match = tagPattern.exec(text)) !== null) {
    tags.add(match[1]);
  }
  return Array.from(tags);
}

function checkArrayTags(text, arrayName) {
  const openTag = `{{#${arrayName}}}`;
  const closeTag = `{{/${arrayName}}}`;
  const dotTag = '{{.}}';
  return {
    complete: text.includes(openTag) && text.includes(closeTag) && text.includes(dotTag),
    hasOpen: text.includes(openTag),
    hasClose: text.includes(closeTag),
    hasDot: text.includes(dotTag)
  };
}

function validateTemplate(template) {
  console.log(`\n========== ${template.name} ==========\n`);
  if (!fs.existsSync(template.path)) {
    console.log('ERROR: File not found');
    return false;
  }
  const text = extractTextFromDocx(template.path);
  if (!text) return false;
  const foundTags = findTags(text);
  let allValid = true;
  console.log('Single Tags:');
  REQUIRED_TAGS.single.forEach(tag => {
    const found = foundTags.includes(tag);
    console.log(`  ${found ? '✓' : '✗'} {{${tag}}}`);
    if (!found) allValid = false;
  });
  console.log('\nArray Tags:');
  REQUIRED_TAGS.arrays.forEach(tag => {
    const check = checkArrayTags(text, tag);
    console.log(`  ${check.complete ? '✓' : '✗'} {{#${tag}}}{{.}}{{/${tag}}}`);
    if (!check.complete) allValid = false;
  });
  return allValid;
}

function main() {
  console.log('\n=== DOCX Template Validator ===');
  const results = TEMPLATES.map(t => ({ name: t.name, valid: validateTemplate(t) }));
  console.log('\n=== Summary ===');
  results.forEach(r => console.log(`  ${r.name}: ${r.valid ? '✓ VALID' : '✗ INVALID'}`));
  const allValid = results.every(r => r.valid);
  console.log(allValid ? '\n🎉 All valid!\n' : '\n⚠️  Fix issues above\n');
  process.exit(allValid ? 0 : 1);
}

main();