// IXL Auto Solver - Content Script
// Injects into IXL pages and automatically solves problems

let isEnabled = true;
let autoSubmit = true;
let soundEnabled = true;

// Load settings from storage
chrome.storage.local.get(['enabled', 'autoSubmit', 'soundEnabled'], (result) => {
  isEnabled = result.enabled !== false;
  autoSubmit = result.autoSubmit !== false;
  soundEnabled = result.soundEnabled !== false;
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if ('enabled' in changes) isEnabled = changes.enabled.newValue;
    if ('autoSubmit' in changes) autoSubmit = changes.autoSubmit.newValue;
    if ('soundEnabled' in changes) soundEnabled = changes.soundEnabled.newValue;
  }
});

// Main solver function
function solveCurrentProblem() {
  if (!isEnabled) return;

  try {
    // Wait for problem to fully load
    const problemContainer = document.querySelector('[data-test-id="problem"]') || 
                            document.querySelector('.problem-content') ||
                            document.querySelector('[role="main"]');
    
    if (!problemContainer) {
      setTimeout(solveCurrentProblem, 500);
      return;
    }

    // Extract problem text
    const problemText = extractProblemText(problemContainer);
    console.log('IXL Problem:', problemText);

    if (!problemText) {
      setTimeout(solveCurrentProblem, 500);
      return;
    }

    // Solve the problem
    const answer = MathSolver.solve(problemText, problemContainer);
    
    if (answer !== null && answer !== undefined) {
      console.log('IXL Answer:', answer);
      
      // Submit the answer
      submitAnswer(answer);
      
      if (soundEnabled) playSuccessSound();
    } else {
      console.log('Could not solve problem');
      setTimeout(solveCurrentProblem, 1000);
    }
  } catch (error) {
    console.error('IXL Solver Error:', error);
    setTimeout(solveCurrentProblem, 1000);
  }
}

// Extract problem text and structure from DOM
function extractProblemText(container) {
  // Try various selectors for problem text
  const selectors = [
    '[data-test-id="problem-statement"]',
    '.problem-statement',
    '.problem-text',
    '[role="main"] p',
    '.question-text'
  ];

  let text = '';
  for (const selector of selectors) {
    const el = container.querySelector(selector);
    if (el) {
      text = el.textContent.trim();
      break;
    }
  }

  // If no text found, get all text from container
  if (!text) {
    text = container.textContent.trim();
  }

  return text;
}

// Submit answer to IXL
function submitAnswer(answer) {
  // Try different input field types
  const inputSelectors = [
    'input[type="text"]',
    'input[type="number"]',
    'input.answer-input',
    '[data-test-id="answer-input"]',
    'input[placeholder*="answer" i]',
    'textarea.answer-input'
  ];

  let inputField = null;
  for (const selector of inputSelectors) {
    inputField = document.querySelector(selector);
    if (inputField && inputField.offsetParent !== null) { // visible
      break;
    }
  }

  if (inputField) {
    // Set value
    inputField.value = String(answer);
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    inputField.dispatchEvent(new Event('change', { bubbles: true }));

    // Try to find and click submit button
    setTimeout(() => {
      const submitBtn = findSubmitButton();
      if (submitBtn && autoSubmit) {
        submitBtn.click();
        
        // Continue to next problem
        setTimeout(solveCurrentProblem, 1500);
      } else if (!autoSubmit) {
        console.log('Auto-submit disabled. Manual submission required.');
      }
    }, 300);
  } else {
    // Try multiple choice, drag-and-drop, or other formats
    handleAlternativeInputs(answer);
  }
}

// Handle alternative input methods (multiple choice, dropdown, etc.)
function handleAlternativeInputs(answer) {
  const answerStr = String(answer).toLowerCase().trim();

  // Multiple choice buttons
  const buttons = document.querySelectorAll('button[role="radio"], button[role="checkbox"], .choice-button, [data-test-id*="choice"]');
  for (const btn of buttons) {
    const btnText = btn.textContent.toLowerCase().trim();
    if (btnText.includes(answerStr) || btnText === answerStr) {
      btn.click();
      setTimeout(() => submitForm(), 500);
      return;
    }
  }

  // Dropdowns
  const selects = document.querySelectorAll('select, [role="combobox"]');
  for (const select of selects) {
    const options = select.querySelectorAll('option, [role="option"]');
    for (const opt of options) {
      if (opt.textContent.toLowerCase().includes(answerStr)) {
        opt.selected = true;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => submitForm(), 500);
        return;
      }
    }
  }

  // Clickable elements (matching position or label)
  const clickables = document.querySelectorAll('[data-answer], [data-value], .answer-option');
  for (const el of clickables) {
    if (el.textContent.includes(answer) || el.getAttribute('data-value') === answerStr) {
      el.click();
      setTimeout(() => submitForm(), 500);
      return;
    }
  }
}

// Find submit button
function findSubmitButton() {
  const selectors = [
    'button:contains("Submit")',
    'button[type="submit"]',
    '.submit-btn',
    '[data-test-id="submit-button"]',
    'button[aria-label*="submit" i]'
  ];

  for (const selector of selectors) {
    if (selector.includes(':contains')) {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Submit') && btn.offsetParent !== null) {
          return btn;
        }
      }
    } else {
      const btn = document.querySelector(selector);
      if (btn && btn.offsetParent !== null) return btn;
    }
  }

  return null;
}

// Submit form if needed
function submitForm() {
  const form = document.querySelector('form');
  if (form) {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  }
}

// Play success sound
function playSuccessSound() {
  try {
    // Create a simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log('Sound disabled or unavailable');
  }
}

// Start solving when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', solveCurrentProblem);
} else {
  solveCurrentProblem();
}

// Also watch for new problems appearing (problem changed)
const observer = new MutationObserver(() => {
  solveCurrentProblem();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: false
});
