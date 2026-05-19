# 🎓 IXL Auto Solver

A powerful browser extension that automatically solves IXL math problems. No more endless practice sessions!

## Features

✨ **Comprehensive Math Solving**
- Arithmetic operations (addition, subtraction, multiplication, division)
- Algebra (linear equations, solving for x, quadratic equations)
- Geometry (area, perimeter, Pythagorean theorem)
- Statistics (mean, median, mode)
- Word problems
- Pattern recognition
- Visual problem solving

⚙️ **Smart Controls**
- Toggle solver on/off instantly
- Auto-submit answers or review before submitting
- Sound notifications for correct answers
- Settings persist across sessions

🎯 **Seamless Integration**
- Works directly on IXL.com
- Automatically detects and solves problems as they appear
- Handles multiple problem formats
- Works with various input types

## Installation

### Chrome/Edge:

1. **Clone or download this repository**
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer Mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the folder containing this extension
6. The IXL Auto Solver will now appear in your extensions menu

### Firefox:

1. Go to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select any file from this extension folder
5. The extension will load temporarily (reload after restart)

## Usage

1. Navigate to [ixl.com](https://ixl.com)
2. Start a practice session
3. The extension automatically solves each problem
4. Check the popup menu to:
   - Toggle solver on/off
   - Enable/disable auto-submit
   - Toggle sound notifications

### Controls

**Solver Enabled** - Master switch for the entire extension

**Auto Submit** - When on, answers are submitted automatically. When off, you'll see the answer but must click submit yourself.

**Sound Notifications** - Plays a beep when correct answers are found

## How It Works

The extension uses multiple problem-solving strategies:

1. **Pattern Matching** - Identifies problem types and extracts numbers/variables
2. **Mathematical Formulas** - Applies relevant formulas based on problem type
3. **Visual Analysis** - Examines DOM elements and images for problem indicators
4. **Input Detection** - Finds and fills text inputs, selects, or clickable buttons
5. **DOM Mutation Watching** - Automatically triggers solving when new problems appear

## Problem Types Supported

| Category | Examples |
|----------|----------|
| **Arithmetic** | Basic operations, order of operations |
| **Algebra** | Linear equations, solving for x, quadratics |
| **Geometry** | Area, perimeter, volume, Pythagorean theorem |
| **Statistics** | Mean, median, mode |
| **Word Problems** | Distance/speed/time, percentages, money problems |
| **Sequences** | Arithmetic and Fibonacci-like patterns |

## Troubleshooting

### "Solver doesn't work on some problems"
- Some problems may require visual/interactive solving that the solver can't handle
- Enable "Auto Submit" off to manually verify answers
- Check the browser console for error messages (F12 → Console)

### "Can't load unpacked extension"
- Ensure Developer Mode is enabled
- Select the correct folder containing `manifest.json`
- Try refreshing the page after loading

### "Answers not being submitted"
- Check if "Auto Submit" is enabled in the popup
- Some problems require manual interaction
- Try disabling and re-enabling the extension

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Firefox 109+ (with modifications)
- ✅ Opera (Chromium-based)
- ✅ Brave

## Important Notes

⚠️ **Educational Use Only**
This extension is created for educational purposes. Always understand the concepts being tested. Using this tool without understanding the material may be against your school's academic integrity policies.

## Contributing

Found a bug or want to add a feature? Open an issue or submit a pull request!

## License

MIT License - Feel free to modify and distribute

---

**Made with ❤️ for IXL survival** 🎓

*Disclaimer: This tool is for educational purposes. Check your school's policies before use.*
