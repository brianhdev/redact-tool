/**
 * THE PROCESS
 *
 * 1) Sanitize Input
 *   - ensure quotes are in the proper format (e.g. curly single-double quotes converted to regular, SINGLE quotes)
 *   - ensure greater string is wrapped with DOUBLE quotes
 * 2) Extract phrases from input
 *   - extract phrase (surrounded by single quotes)
 *   - add phrase to list of 'redactables'
 * 3) Extract remaining keywords from input
 *   - either separated by commas or spaces
 *   - add words to 'redactables' list
 * 4) Read in text passage as string
 *   - once read, do a search of each keyword/phrase in 'redactables'
 *   - replace each instance with XXXX in its place in the string
 *   - output final string into text file on the same dir
 */

import fs from 'fs';

// Prompt user
let pathToInput = './input.txt';
let pathToText = './text.txt';

// Get Input Keywords and Phrases
let rawInput = '';
try {
  rawInput = fs.readFileSync(pathToInput, 'utf-8');
  console.log(`Successfully read from ${pathToInput}`);
} catch(error) {
  console.log(`Error while reading from ${pathToInput}`, error);
}

// Get Text to Redact
let rawText = '';
try {
  rawText = fs.readFileSync(pathToText, 'utf-8');
  console.log(`Successfully read from ${pathToText}`);
} catch(error) {
  console.log(`Error while reading from ${pathToText}`, error);
}

///////////////////////////////////////////////////////////////////

// Sanitize rawToRedact of curly quotations
// Convert all instances of "" to '' for consistency
const sanitizeRawToRedact = rawInput
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201C\u201D]/g, "'")
  .replace(/["]/g, "'");


// GET ALL PHRASES

// regex idea:
// - match a start quote /', end quote '/
// - [] indicates to match a character instance, the ^ right after indicates nonexistence
// - + to match one or more quantifier, in this case we want all characters between '' to not match '
const regexGetPhrase = /'([^']+)'/g;

// the raw matchAll returns a RegExpMatchArray, the value we want is in index 1 of each array item
let phrasesToRedact = [...sanitizeRawToRedact.matchAll(regexGetPhrase)].map(phrase => phrase[1]);


// GET ALL KEYWORDS

// Remove already found phrases from the input string
let remainingKeywordsString = sanitizeRawToRedact;
for (let phrase of phrasesToRedact) {
  remainingKeywordsString = remainingKeywordsString.replace(`'${phrase}'`, '');
}

// Sanitize remaining keywords, remove commas
const keywordsToRedact = remainingKeywordsString
  .replace(/,/g, ' ')    // replace commas with spaces (still a separator)
  .replace(/ +/g, ' ')   // remove instances of 2+ spaces with only one
  .split(' ')            // split keywords by individual spaces
  .filter(keyword => keyword !== '') // ensure we omit empty keywords

///////////////////////////////////////////////////////////////////

const placeholder = 'XXXX';
let redactedText = rawText;

// Remove phrases first (this avoids accidentally removing keywords that might also be included in phrases, ahead of time)
for (let phrase of phrasesToRedact) {
  redactedText = redactedText.split(phrase).join(placeholder);
}

// Redact keywords in text
for (let word of keywordsToRedact) {
  redactedText = redactedText.split(word).join(placeholder);
}

// Output file to 'redacted.txt'
try {
  fs.writeFileSync('./redacted.txt', redactedText);
  console.log(`Redacted file has been outputted to 'redacted.txt'`);
} catch(error) {
  console.log(`Error outputting 'redacted.txt'`, error);
}
