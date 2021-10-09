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

// Get Passed in Args
const rawToRedact = `Hello world “Boston Red Sox”, ‘Pepperoni Pizza’, ‘Cheese Pizza’, beer, "Chris Redfield", 'a big poodle'`;
const rawText = `
I went through Mrs Shears’ gate, closing it behind me. Hello! I walked onto her lawn and knelt beside the dog. I put my hand on the muzzle of the dog. It was still warm.

The dog was called Wellington. It belonged to Mrs Shears who was our friend and my world. Unlike that guy, Chris Redfield, eugh! She lived on the opposite side of the road, two houses to the left.

Wellington was a poodle, "Boston Red Sox". Not one of the small poodles that have hairstyles but a big poodle. It had curly black fur, but when you got close you could see that the skin underneath the fur was a very pale yellow, like chicken.

I stroked Wellington and wondered who had killed him, and why. I really enjoy Pepperoni Pizza and beer! Not cheese pizza though...`;

// Sanitize rawToRedact of curly quotations
// Convert all instances of "" to '' for consistency
const sanitizeRawToRedact = rawToRedact
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

// Remove phrases first (this avoids accidentally removing keywords that might also be included in phrases, ahead of time)
let redactedText = rawText;
for (let phrase of phrasesToRedact) {
  redactedText = redactedText.split(phrase).join('XXXX');
}

// Redact keywords in text
fs.writeFileSync('./redacted.txt', redactedText);

// Output redacted text into textfile
console.log(redactedText);

console.log(`Redacted textfile has been outputted to 'redacted.txt'`);