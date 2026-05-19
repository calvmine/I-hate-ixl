# Installation & Usage Guide for IXL Auto Solver

## 🚀 Quick Start (5 minutes)

### Step 1: Get the Extension Files
```bash
git clone https://github.com/calvmine/i-hate-ixl.git
cd i-hate-ixl
```

### Step 2: Load into Chrome/Edge

1. **Open Extensions Page**
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

2. **Enable Developer Mode**
   - Toggle the **"Developer mode"** switch in the top-right corner

3. **Load the Extension**
   - Click **"Load unpacked"**
   - Navigate to your `i-hate-ixl` folder
   - Select the folder and click **"Open"**

4. **Verify Installation**
   - You should see "IXL Auto Solver" in your extensions list
   - Pin it to your toolbar for easy access

### Step 3: Start Solving!

1. Go to [ixl.com](https://ixl.com) and log in
2. Start any **math practice session**
3. The extension automatically detects and solves problems
4. Watch your progress bar fill up! 📈

---

## 🎮 How to Control It

### Extension Popup (Click the extension icon)

**Solver Enabled** 
- Master on/off switch
- Toggle to pause/resume solving

**Auto Submit**
- ✅ ON: Answers auto-submit, problems advance automatically
- ⚪ OFF: Shows answer but requires manual click to submit (review mode)

**Sound Notifications**
- ✅ ON: Beeps when correct answer is found
- ⚪ OFF: Silent mode

### Keyboard Shortcuts (Optional - Not Yet Implemented)
- Coming soon!

---

## ✨ What Problems It Solves

### ✅ Supported
- **Arithmetic**: 5 + 3 = ?, Order of operations
- **Algebra**: Solving for x, Linear equations, Quadratics
- **Geometry**: Area, Perimeter, Pythagorean theorem
- **Statistics**: Mean, Median, Mode
- **Word Problems**: Distance/speed/time, Percentages, Money
- **Patterns**: Sequences, Fibonacci-like patterns

### 🚧 Partially Supported
- Multiple choice (if text is visible)
- Dropdown menus
- Drag-and-drop problems
- Visual/image-based questions

### ❌ Not Supported (Yet)
- Complex interactive proofs
- Free-hand drawing problems
- Some advanced geometry visualizations

---

## 🔧 Troubleshooting

### Problem: "Solver doesn't work"
**Solution:**
- ✅ Check if "Solver Enabled" is ON in the popup
- ✅ Verify you're on ixl.com
- ✅ Refresh the page (Ctrl+R or Cmd+R)
- ✅ Check browser console for errors (F12 → Console)

### Problem: "Answers not submitting"
**Solution:**
- ✅ Enable "Auto Submit" in the popup
- ✅ Some problems may need manual review first
- ✅ Try disabling and re-enabling the extension

### Problem: "Can't load the extension"
**Solution:**
- ✅ Make sure Developer Mode is enabled
- ✅ Select the correct folder containing `manifest.json`
- ✅ Try removing and re-adding the extension
- ✅ Restart Chrome/Edge

### Problem: "Sound not working"
**Solution:**
- ✅ Check if "Sound Notifications" is enabled
- ✅ Verify browser audio is not muted
- ✅ Check volume levels
- ✅ Try refreshing the page

### Problem: "Getting wrong answers"
**Solution:**
- ✅ Toggle "Auto Submit" OFF to review answers
- ✅ Check if the problem statement was extracted correctly
- ✅ Report the issue with the problem text in the console

---

## 📊 Performance Tips

- **Better Success Rate**: Keep "Auto Submit" OFF on first try to verify answers
- **Faster Solving**: Enable "Sound Notifications" to confirm correct answers
- **Debugging**: Open DevTools (F12) to see problem text and answers in console

---

## 🐛 Debug Mode

To see what the solver is doing:

1. Open DevTools: **F12**
2. Go to **Console** tab
3. You'll see:
   - `IXL Problem: [extracted text]`
   - `IXL Answer: [calculated answer]`
   - Error messages if solving fails

---

## 🔒 Privacy & Safety

- ✅ Extension works **offline** (no data sent anywhere)
- ✅ Only reads IXL page content
- ✅ Settings stored locally on your device
- ✅ No tracking or analytics

---

## ⚠️ Important Notes

**Educational Use Only**
- This tool is for learning and understanding concepts
- Don't rely on it without understanding the material
- Check your school's academic integrity policies
- Use responsibly!

---

## 🤝 Contributing

Found a bug? Want to add features?

1. Test the issue thoroughly
2. Note the problem type that fails
3. Open an issue on GitHub
4. Include:
   - Problem type (arithmetic, algebra, etc.)
   - Problem text
   - Expected answer
   - What the solver gave instead

---

## 📝 Changelog

### v1.0.0 (Current)
- ✨ Initial release
- ✅ Arithmetic solver
- ✅ Algebra solver
- ✅ Geometry solver
- ✅ Statistics solver
- ✅ Word problem solver
- ✅ Pattern recognition
- ✅ Settings panel with toggles
- ✅ Sound notifications

---

## 💡 Pro Tips

1. **Review Mode**: Disable auto-submit to check answers before they're submitted
2. **Sound Feedback**: Keep sound on to confirm the solver is working
3. **Problem Inspection**: Use DevTools console to see extracted problem text
4. **Multiple Devices**: Settings sync if you're logged into Chrome

---

## 🆘 Still Need Help?

- Check the README.md for more info
- Review the console (F12) for error messages
- Restart the extension or browser
- Re-clone and reload the extension

---

Made with ❤️ for IXL survival 🎓
