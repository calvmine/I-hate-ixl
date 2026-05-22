// IXL Auto Solver - Content Script (Enhanced)
// Injects into IXL pages and automatically solves ALL problem types

let isEnabled = true;
let autoSubmit = true;
let soundEnabled = true;
let useCopilot = false;

// Load settings from storage
chrome.storage.local.get(['enabled', 'autoSubmit', 'soundEnabled', 'useCopilot'], (result) => {
  isEnabled = result.enabled !== false;
  autoSubmit = result.autoSubmit !== false;
  soundEnabled = result.soundEnabled !== false;
  useCopilot = result.useCopilot || false;
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if ('enabled' in changes) isEnabled = changes.enabled.newValue;
    if ('autoSubmit' in changes) autoSubmit = changes.autoSubmit.newValue;
    if ('soundEnabled' in changes) soundEnabled = changes.soundEnabled.newValue;
    if ('useCopilot' in changes) useCopilot = changes.useCopilot.newValue;
  }
});

// Main solver function - handles ALL question types
async function solveCurrentProblem() {
  if (!isEnabled) return;

  try {
    // Get the main problem container
    const problemContainer = getProblemContainer();
    
    if (!problemContainer) {
      setTimeout(solveCurrentProblem, 500);
      return;
    }

    // Extract ALL relevant information
    const problemInfo = extractProblemInfo(problemContainer);
    
    if (!problemInfo.text && !problemInfo.images.length && !problemInfo.options.length) {
      setTimeout(solveCurrentProblem, 500);
      return;
    }

    console.log('IXL Problem Info:', problemInfo);

    // Try to solve using various methods
    let answer = null;

    // Method 1: Use traditional math solver
    if (problemInfo.text) {
      answer = MathSolver.solve(problemInfo.text, problemContainer);
    }

    // Method 2: If traditional fails and Copilot enabled, use AI
    if (!answer && useCopilot && problemInfo.text) {
      console.log('Attempting Copilot solve...');
      answer = await solvWithAI(problemInfo.text);
    }

    // Method 3: Visual analysis for multiple choice / options
    if (!answer && problemInfo.options.length > 0) {
      answer = solveMultipleChoice(problemInfo);
    }

    // Method 4: Image-based problem solving
    if (!answer && problemInfo.images.length > 0) {
      answer = solveImageProblem(problemInfo.images);
    }

    // Method 5: Drag and drop / interactive elements
    if (!answer) {
      answer = findInteractiveAnswer(problemContainer);
    }

    // Submit the answer if found
    if (answer !== null && answer !== undefined) {
      console.log('IXL Answer:', answer);
      submitAnswer(answer, problemInfo);
      if (soundEnabled) playSuccessSound();
    } else {
      console.log('Could not solve - retrying...');
      setTimeout(solveCurrentProblem, 1000);
    }
  } catch (error) {
    console.error('IXL Solver Error:', error);
    setTimeout(solveCurrentProblem, 1000);
  }
}

// Find the problem container - works with all IXL layouts
function getProblemContainer() {
  const selectors = [
    '[data-test-id="problem"]',
    '.problem-content',
    '[role="main"]',
    'main',
    '.question-container',
    '.problem-frame'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.offsetParent !== null) {
      return el;
    }
  }

  return document.body;
}

// Extract all problem information
function extractProblemInfo(container) {
  const info = {
    text: '',
    images: [],
    options: [],
    inputField: null,
    type: 'unknown'
  };

  // Extract text
  const textSelectors = [
    '[data-test-id="problem-statement"]',
    '.problem-statement',
    '.problem-text',
    '.question-text'
  ];

  for (const selector of textSelectors) {
    const el = container.querySelector(selector);
    if (el) {
      info.text = el.textContent.trim().substring(0, 1000);
      break;
    }
  }

  // If no dedicated text element, extract from visible paragraphs
  if (!info.text) {
    const paragraphs = container.querySelectorAll('p, span, div');
    for (const p of paragraphs) {
      const text = p.textContent.trim();
      if (text.length > 10 && text.length < 500 && !text.match(/sign|log|click|more/i)) {
        info.text = text;
        break;
      }
    }
  }

  // Find images
  info.images = Array.from(container.querySelectorAll('img')).map(img => ({
    src: img.src,
    alt: img.alt,
    dataAnswer: img.getAttribute('data-answer')
  }));

  // Find answer options (multiple choice, buttons, etc.)
  const optionSelectors = [
    'button[role="radio"]',
    'button[role="checkbox"]',
    '.choice-button',
    '[data-test-id*="choice"]',
    '.answer-option',
    'label input + span'
  ];

  for (const selector of optionSelectors) {
    const options = container.querySelectorAll(selector);
    if (options.length > 0) {
      info.options = Array.from(options).map(opt => ({
        text: opt.textContent.trim(),
        element: opt,
        value: opt.getAttribute('data-value') || opt.value
      }));
      info.type = 'multiple-choice';
      break;
    }
  }

  // Find input field
  const inputSelectors = [
    'input[type="text"]:not([type="hidden"])',
    'input[type="number"]',
    'input.answer-input',
    '[data-test-id="answer-input"]'
  ];

  for (const selector of inputSelectors) {
    const input = container.querySelector(selector);
    if (input && input.offsetParent !== null) {
      info.inputField = input;
      info.type = 'text-input';
      break;
    }
  }

  return info;
}

// Solve multiple choice problems
function solveMultipleChoice(problemInfo) {
  const problemText = problemInfo.text.toLowerCase();
  
  for (const option of problemInfo.options) {
    const optText = option.text.toLowerCase();
    
    // Look for keywords that match
    if (problemText.includes('which') || problemText.includes('select')) {
      // For "which" questions, try to find matching keywords
      const keywords = problemText.match(/\b(\w+)\b/g) || [];
      if (keywords.some(kw => optText.includes(kw))) {
        return option.text;
      }
    }
  }

  // If no match found, this needs AI or more context
  return null;
}

// Solve image-based problems
function solveImageProblem(images) {
  for (const img of images) {
    // Check for explicit answer in data attribute
    if (img.dataAnswer) return img.dataAnswer;

    // Check alt text for answers (A, B, C, D or numbers)
    if (img.alt && img.alt.match(/^[A-D]$/i)) {
      return img.alt.toUpperCase();
    }
    
    if (img.alt && img.alt.match(/^\d+$/)) {
      return img.alt;
    }
  }
  return null;
}

// Find interactive answers (drag-drop, match, etc.)
function findInteractiveAnswer(container) {
  const interactives = container.querySelectorAll('[draggable="true"], .draggable, [data-answer]');
  for (const el of interactives) {
    if (el.offsetParent !== null) {
      return el.getAttribute('data-answer') || el.textContent.trim();
    }
  }
  return null;
}

// AI solving using Copilot (placeholder for now)
async function solvWithAI(problemText) {
  // This would call your AI service
  // For now, returning null - you can integrate with actual AI
  return null;
}

// Submit answer to IXL - handles ALL input methods
function submitAnswer(answer, problemInfo) {
  // Method 1: Text input field
  if (problemInfo.inputField) {
    problemInfo.inputField.value = String(answer);
    problemInfo.inputField.dispatchEvent(new Event('input', { bubbles: true }));
    problemInfo.inputField.dispatchEvent(new Event('change', { bubbles: true }));
    
    setTimeout(() => {
      const submitBtn = findSubmitButton();
      if (submitBtn && autoSubmit) {
        submitBtn.click();
        setTimeout(solveCurrentProblem, 1500);
      }
    }, 300);
    return;
  }

  // Method 2: Multiple choice click
  for (const option of problemInfo.options) {
    const optionText = option.text.trim();
    if (optionText === String(answer) || optionText.includes(String(answer))) {
      option.element.click();
      setTimeout(() => {
        const submitBtn = findSubmitButton();
        if (submitBtn && autoSubmit) submitBtn.click();
        setTimeout(solveCurrentProblem, 1500);
      }, 300);
      return;
    }
  }

  // Method 3: Find and click matching button
  const buttons = document.querySelectorAll('button');
  for (const btn of buttons) {
    if (btn.textContent.includes(String(answer))) {
      btn.click();
      setTimeout(solveCurrentProblem, 1500);
      return;
    }
  }

  // Method 4: Submit form
  const form = document.querySelector('form');
  if (form && autoSubmit) {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    setTimeout(solveCurrentProblem, 1500);
  }
}

// Find submit button
function findSubmitButton() {
  const buttons = document.querySelectorAll('button');
  for (const btn of buttons) {
    const text = btn.textContent.toLowerCase();
    if ((text.includes('submit') || text.includes('check') || text.includes('next')) && 
        btn.offsetParent !== null) {
      return btn;
    }
  }
  return null;
}

// Play success sound
function playSuccessSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log('Sound unavailable');
  }
}

// Start solving
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', solveCurrentProblem);
} else {
  solveCurrentProblem();
}

// Watch for problem changes
if (document.body) {
  const observer = new MutationObserver(() => {
    setTimeout(solveCurrentProblem, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false
  });
}
