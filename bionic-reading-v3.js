// Function to check if a character is a vowel
function isVowel(char) {
    return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
}

// List of common function words to deprioritize
const functionWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'
]);

// Function to determine if a word is "important"
function isImportantWord(word) {
    const lowerWord = word.toLowerCase();
    // A word is important if it's not a function word and is longer than 3 letters
    return !functionWords.has(lowerWord) && word.length > 3;
}

// Function to determine how many letters to bold
function getBoldLength(word) {
    const len = word.length;
    const isImportant = isImportantWord(word);

    if (len <= 2) return 1; // Short words (e.g., "to") get 1 letter
    if (len <= 4) return isImportant ? 2 : 1; // "the" → 1, "cake" → 2

    // Important words get ~50% bolded, others ~40%
    const boldPercentage = isImportant ? 0.5 : 0.4;
    const boldLen = Math.max(2, Math.ceil(len * boldPercentage));
    return Math.min(boldLen, Math.floor(len / 2)); // Cap at half the word
}

// Function to bold the initial part of a word
function boldInitial(word) {
    if (word.length === 0) return '';

    const digraphs = ['ch', 'sh', 'th', 'wh', 'ph', 'qu'];
    const lowerWord = word.toLowerCase();

    // Check for digraphs
    for (const digraph of digraphs) {
        if (lowerWord.startsWith(digraph)) {
            const boldLen = Math.max(digraph.length, getBoldLength(word));
            return `<b>${word.substring(0, boldLen)}</b>${word.substring(boldLen)}`;
        }
    }

    // Determine bold length
    let boldLen = getBoldLength(word);

    // Adjust to stop at or before first vowel for natural flow (if past minimum)
    for (let i = 2; i < boldLen; i++) {
        if (isVowel(word[i])) {
            boldLen = i; // Stop at vowel if it makes sense
            break;
        }
    }

    return `<b>${word.substring(0, boldLen)}</b>${word.substring(boldLen)}`;
}

// Function to process text and apply Bionic Reading format
function applyBionicReading(text) {
    return text.split(/\b/).map(part => {
        if (/[a-zA-Z]/.test(part)) {
            return boldInitial(part);
        }
        return part; // Preserve punctuation, spaces, etc.
    }).join('');
}

// Function to modify text nodes within <p> elements
function modifyParagraphs() {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
        Array.from(p.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const newHTML = applyBionicReading(node.textContent);
                const newNode = document.createElement('span');
                newNode.innerHTML = newHTML;
                p.replaceChild(newNode, node);
            }
        });
    });
}

// Execute when the page loads
window.addEventListener('load', modifyParagraphs);