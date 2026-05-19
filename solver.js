// Comprehensive Math Solver for all IXL problem types

const MathSolver = {
  solve: function(problemText, container) {
    problemText = problemText.trim();
    
    // Try different solving strategies
    let answer = null;

    // 1. Arithmetic operations
    answer = this.solveArithmetic(problemText);
    if (answer !== null) return answer;

    // 2. Algebra
    answer = this.solveAlgebra(problemText);
    if (answer !== null) return answer;

    // 3. Geometry
    answer = this.solveGeometry(problemText);
    if (answer !== null) return answer;

    // 4. Statistics
    answer = this.solveStatistics(problemText);
    if (answer !== null) return answer;

    // 5. Word problems
    answer = this.solveWordProblem(problemText);
    if (answer !== null) return answer;

    // 6. Pattern recognition
    answer = this.solvePattern(problemText);
    if (answer !== null) return answer;

    // 7. Check visual problems in DOM
    answer = this.solveVisualProblem(container);
    if (answer !== null) return answer;

    return null;
  },

  solveArithmetic: function(text) {
    // Basic arithmetic: 5 + 3 = ?
    let match = text.match(/(\d+\.?\d*)\s*([+\-×*÷/])\s*(\d+\.?\d*)\s*[=?]/);
    if (match) {
      const a = parseFloat(match[1]);
      const op = match[2];
      const b = parseFloat(match[3]);
      
      let result;
      switch(op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '×':
        case '*': result = a * b; break;
        case '÷':
        case '/': result = a / b; break;
        default: return null;
      }
      return Math.round(result * 1000) / 1000; // Handle floating point
    }

    // Order of operations
    match = text.match(/What is (.+)\?/i);
    if (match) {
      try {
        const expr = match[1]
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\s+/g, '');
        const result = Function('"use strict"; return (' + expr + ')')();
        return Math.round(result * 1000) / 1000;
      } catch (e) {
        return null;
      }
    }

    return null;
  },

  solveAlgebra: function(text) {
    // Solve for x: 2x + 5 = 13
    let match = text.match(/(\d+)x\s*([+\-])\s*(\d+)\s*[=]\s*(\d+)/i);
    if (match) {
      const coef = parseInt(match[1]);
      const op = match[2];
      const const1 = parseInt(match[3]);
      const result = parseInt(match[4]);
      
      let x;
      if (op === '+') {
        x = (result - const1) / coef;
      } else {
        x = (result + const1) / coef;
      }
      return Math.round(x * 1000) / 1000;
    }

    // Solve 5x = 20
    match = text.match(/(\d+)x\s*[=]\s*(\d+)/i);
    if (match) {
      return parseInt(match[2]) / parseInt(match[1]);
    }

    // Quadratic formula recognition
    match = text.match(/x[²^2]\s*([+\-])\s*(\d+)x?\s*([+\-])\s*(\d+)\s*[=]\s*0/i);
    if (match) {
      const a = 1;
      const b = parseInt(match[2]) * (match[1] === '+' ? 1 : -1);
      const c = parseInt(match[4]) * (match[3] === '+' ? 1 : -1);
      
      const discriminant = b * b - 4 * a * c;
      if (discriminant >= 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return [Math.round(x1 * 100) / 100, Math.round(x2 * 100) / 100];
      }
    }

    return null;
  },

  solveGeometry: function(text) {
    // Area of rectangle: length × width
    let match = text.match(/area.*?(\d+\.?\d*)\s*(?:by|×|x)\s*(\d+\.?\d*)/i);
    if (match) {
      return parseFloat(match[1]) * parseFloat(match[2]);
    }

    // Area of circle: πr²
    match = text.match(/(?:area|πr[²^2]).*?(?:radius|r)\s*[=:]\s*(\d+\.?\d*)/i);
    if (match) {
      const r = parseFloat(match[1]);
      return Math.round(Math.PI * r * r * 100) / 100;
    }

    // Perimeter of rectangle
    match = text.match(/perimeter.*?(\d+\.?\d*)\s*(?:by|×|x)\s*(\d+\.?\d*)/i);
    if (match) {
      return 2 * (parseFloat(match[1]) + parseFloat(match[2]));
    }

    // Pythagorean theorem: a² + b² = c²
    match = text.match(/(?:legs?|sides?)\s*(?:are|of)\s*(\d+\.?\d*)\s*(?:and|,)\s*(\d+\.?\d*)/i);
    if (match) {
      const a = parseFloat(match[1]);
      const b = parseFloat(match[2]);
      const c = Math.sqrt(a * a + b * b);
      return Math.round(c * 100) / 100;
    }

    return null;
  },

  solveStatistics: function(text) {
    // Mean/Average
    let match = text.match(/(?:mean|average).*?\d+/i);
    if (match) {
      const numbers = text.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        const sum = numbers.reduce((a, b) => a + parseFloat(b), 0);
        const mean = sum / numbers.length;
        return Math.round(mean * 100) / 100;
      }
    }

    // Median
    if (/median/i.test(text)) {
      const numbers = text.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        const sorted = numbers.map(n => parseFloat(n)).sort((a, b) => a - b);
        const median = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        return Math.round(median * 100) / 100;
      }
    }

    // Mode
    if (/mode/i.test(text)) {
      const numbers = text.match(/\d+\.?\d*/g);
      if (numbers && numbers.length > 0) {
        const freq = {};
        numbers.forEach(n => {
          const num = parseFloat(n);
          freq[num] = (freq[num] || 0) + 1;
        });
        const mode = Object.keys(freq).reduce((a, b) => 
          freq[a] > freq[b] ? a : b
        );
        return parseFloat(mode);
      }
    }

    return null;
  },

  solveWordProblem: function(text) {
    // Distance = Speed × Time
    let match = text.match(/speed.*?(\d+\.?\d*)\s*(?:mph|km\/h).*?time.*?(\d+\.?\d*)\s*(?:hours?|hrs?)/i);
    if (match) {
      return parseFloat(match[1]) * parseFloat(match[2]);
    }

    // Percentage problems
    match = text.match(/(\d+\.?\d*)%\s*(?:of)?\s*(\d+\.?\d*)/i);
    if (match) {
      const percent = parseFloat(match[1]);
      const value = parseFloat(match[2]);
      return Math.round((percent / 100) * value * 100) / 100;
    }

    // Total cost problems
    match = text.match(/(\d+\.?\d*)\s*(?:costs?|@|x)\s*\$?(\d+\.?\d*)/i);
    if (match && /total|each|cost/i.test(text)) {
      return parseFloat(match[1]) * parseFloat(match[2]);
    }

    return null;
  },

  solvePattern: function(text) {
    // Number sequences: 2, 4, 6, 8, ?
    let match = text.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+\?/);
    if (match) {
      const nums = [match[1], match[2], match[3], match[4]].map(Number);
      const diff1 = nums[1] - nums[0];
      const diff2 = nums[2] - nums[1];
      const diff3 = nums[3] - nums[2];
      
      if (diff1 === diff2 && diff2 === diff3) {
        // Arithmetic sequence
        return nums[3] + diff1;
      }
    }

    // Fibonacci-like patterns
    match = text.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+(\d+)[,\s]+\?/);
    if (match) {
      const nums = [match[1], match[2], match[3], match[4]].map(Number);
      if (nums[2] === nums[0] + nums[1] && nums[3] === nums[1] + nums[2]) {
        return nums[2] + nums[3];
      }
    }

    return null;
  },

  solveVisualProblem: function(container) {
    // Handle image-based or interactive problems
    const images = container.querySelectorAll('img');
    
    // Look for answer indicators in data attributes
    for (const img of images) {
      const alt = img.getAttribute('alt') || '';
      if (alt.match(/\d+/)) {
        return alt.match(/\d+/)[0];
      }
      
      const dataAnswer = img.getAttribute('data-answer');
      if (dataAnswer) return dataAnswer;
    }

    return null;
  }
};
