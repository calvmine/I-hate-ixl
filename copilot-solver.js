// GitHub Copilot AI Integration for IXL Solver
// Uses GitHub Copilot API to intelligently solve complex problems

const CopilotSolver = {
  apiKey: null,
  isConfigured: false,

  // Initialize with GitHub API key
  init: function(githubToken) {
    this.apiKey = githubToken;
    this.isConfigured = !!githubToken;
    console.log('Copilot Solver initialized:', this.isConfigured);
  },

  // Load API key from storage
  loadConfig: function() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['copilotToken'], (result) => {
        if (result.copilotToken) {
          this.init(result.copilotToken);
        }
        resolve(this.isConfigured);
      });
    });
  },

  // Call GitHub Copilot API for complex problem solving
  solve: async function(problemText) {
    if (!this.isConfigured || !this.apiKey) {
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/copilot/completions', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          prompt: this.buildPrompt(problemText),
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1
        })
      });

      if (!response.ok) {
        console.log('Copilot API response:', response.status);
        return null;
      }

      const data = await response.json();
      return this.parseAnswer(data, problemText);
    } catch (error) {
      console.log('Copilot API error:', error.message);
      return null;
    }
  },

  // Build optimized prompt for math problems
  buildPrompt: function(problemText) {
    return `Solve this math problem and respond with ONLY the numerical answer or letter choice.

Problem: ${problemText}

Answer:`;
  },

  // Extract answer from Copilot response
  parseAnswer: function(response, problemText) {
    try {
      if (response.choices && response.choices[0]) {
        let answer = response.choices[0].text || '';
        answer = answer.trim().split('\n')[0].trim();
        
        // Extract number or letter from response
        const match = answer.match(/^([A-Z]|\d+\.?\d*)/i);
        if (match) {
          return match[1];
        }
      }
    } catch (e) {
      console.log('Parse error:', e);
    }
    return null;
  }
};

// Enhanced Solver combining Copilot with traditional methods
const EnhancedSolver = {
  async solve(problemText, container) {
    // First try traditional method (faster)
    let answer = MathSolver.solve(problemText, container);
    if (answer !== null) {
      console.log('Solved with traditional solver:', answer);
      return answer;
    }

    // If traditional fails, try Copilot
    const isConfigured = await CopilotSolver.loadConfig();
    if (isConfigured) {
      console.log('Traditional solver failed, trying Copilot...');
      answer = await CopilotSolver.solve(problemText);
      if (answer !== null) {
        console.log('Solved with Copilot:', answer);
        return answer;
      }
    }

    // If both fail, try visual/OCR approach
    answer = this.solveVisual(container);
    if (answer !== null) {
      console.log('Solved with visual analysis:', answer);
      return answer;
    }

    return null;
  },

  // Visual problem solving for image-based questions
  solveVisual: function(container) {
    // Check for multiple choice images with alt text
    const images = container.querySelectorAll('img');
    for (const img of images) {
      const alt = img.getAttribute('alt');
      if (alt && alt.match(/^[A-D]$/i)) {
        return alt.toUpperCase();
      }
    }

    // Check for answer buttons with data attributes
    const buttons = container.querySelectorAll('button[data-answer]');
    if (buttons.length > 0) {
      // Return first visible button's answer (needs refinement)
      return buttons[0].getAttribute('data-answer');
    }

    return null;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CopilotSolver, EnhancedSolver };
}
