// GitHub Copilot AI Integration for IXL Auto Solver
// Enhances problem solving with AI capabilities

const CopilotSolver = {
  // Your GitHub personal access token (set in extension settings)
  apiToken: null,
  
  // Initialize Copilot integration
  init: function() {
    chrome.storage.local.get(['copilotToken'], (result) => {
      this.apiToken = result.copilotToken || null;
    });
  },

  // Enhanced problem solving using Copilot API
  solveWithAI: async function(problemText) {
    if (!this.apiToken) {
      console.log('Copilot token not set, using local solver');
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/repos/github/copilot-docs/contents/docs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Solve this math problem and provide only the numerical answer:\n\n${problemText}`,
          temperature: 0.3,
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        return this.extractAnswer(data);
      }
    } catch (error) {
      console.error('Copilot API error:', error);
    }

    return null;
  },

  // Extract numerical answer from AI response
  extractAnswer: function(data) {
    try {
      let text = '';
      if (typeof data === 'string') {
        text = data;
      } else if (data.choices && data.choices[0]) {
        text = data.choices[0].text || data.choices[0].message?.content || '';
      }

      // Extract first number from response
      const match = text.match(/[-]?\d+\.?\d*/);
      if (match) {
        return parseFloat(match[0]);
      }
    } catch (e) {
      console.error('Error extracting answer:', e);
    }

    return null;
  },

  // Fallback: Use local solving with pattern enhancement
  solveWithLocalAI: function(problemText) {
    // Advanced pattern matching for complex problems
    
    // Multi-step word problems
    let match = problemText.match(/(.+?)(?:first|then|after that|finally)(.+?)(?:\?|=)/i);
    if (match) {
      return this.solveMultiStepProblem(match[1], match[2]);
    }

    // Comparative problems
    match = problemText.match(/(\w+).*?(\d+).*?(?:more|less|times).*?(\w+)/i);
    if (match) {
      return this.solveComparativeProblem(problemText);
    }

    // Ratio problems
    if (/ratio|proportion|:/.test(problemText)) {
      return this.solveRatioProblem(problemText);
    }

    // Percentage problems
    if (/%|percent/i.test(problemText)) {
      return this.solvePercentageProblem(problemText);
    }

    return null;
  },

  solveMultiStepProblem: function(step1, step2) {
    // Extract numbers from each step
    const nums1 = step1.match(/\d+\.?\d*/g);
    const nums2 = step2.match(/\d+\.?\d*/g);

    if (nums1 && nums2) {
      const n1 = parseFloat(nums1[0]);
      const n2 = parseFloat(nums2[0]);
      
      // Determine operation based on keywords
      if (/add|plus|total|sum/i.test(step1 + step2)) {
        return n1 + n2;
      } else if (/subtract|minus|difference|remove/i.test(step1 + step2)) {
        return n1 - n2;
      } else if (/multiply|times|of/i.test(step1 + step2)) {
        return n1 * n2;
      } else if (/divide|split|share/i.test(step1 + step2)) {
        return n1 / n2;
      }
    }

    return null;
  },

  solveComparativeProblem: function(text) {
    const numbers = text.match(/\d+\.?\d*/g);
    if (!numbers || numbers.length < 2) return null;

    const n1 = parseFloat(numbers[0]);
    const n2 = parseFloat(numbers[1]);

    if (/more/i.test(text)) {
      return n1 + n2;
    } else if (/less/i.test(text)) {
      return n1 - n2;
    } else if (/times/i.test(text)) {
      return n1 * n2;
    }

    return null;
  },

  solveRatioProblem: function(text) {
    // Extract ratio like "3:4" or "3 to 4"
    let match = text.match(/(\d+)\s*(?::|to)\s*(\d+)/);
    if (!match) return null;

    const ratio1 = parseFloat(match[1]);
    const ratio2 = parseFloat(match[2]);

    // Find the known quantity
    const quantityMatch = text.match(/(\d+)\s*(?:parts?|units?|items?)/i);
    if (!quantityMatch) return null;

    const knownQty = parseFloat(quantityMatch[1]);
    const totalRatio = ratio1 + ratio2;

    // Calculate missing quantity
    if (/find|calculate|what is/i.test(text)) {
      return (knownQty / ratio1) * ratio2;
    }

    return null;
  },

  solvePercentageProblem: function(text) {
    // "What is 25% of 100?" or "100 is 25% of what?"
    let match = text.match(/(\d+\.?\d*)%\s*(?:of)?\s*(\d+\.?\d*)/i);
    if (match) {
      const percent = parseFloat(match[1]);
      const whole = parseFloat(match[2]);
      return (percent / 100) * whole;
    }

    // "What percent of 100 is 25?"
    match = text.match(/percent.*?(\d+\.?\d*).*?is\s*(\d+\.?\d*)/i);
    if (match) {
      const whole = parseFloat(match[1]);
      const part = parseFloat(match[2]);
      return (part / whole) * 100;
    }

    // "25 is what percent of 100?"
    match = text.match(/(\d+\.?\d*)\s*is\s*(?:what\s*)?percent.*?(\d+\.?\d*)/i);
    if (match) {
      const part = parseFloat(match[1]);
      const whole = parseFloat(match[2]);
      return (part / whole) * 100;
    }

    return null;
  }
};

// Initialize Copilot solver
CopilotSolver.init();

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.CopilotSolver = CopilotSolver;
}
