# 🔮 Aura Detector — Base Website

A clean, beginner-friendly single-page web application created for the **NexaSoul Web Development Foundation Bootcamp** (*Chandigarh University*).

![NexaSoul Logo](assets/club-logo.svg)

---


## 📌 Project Features

- **10 Gen-Z Relatable Questions** (Campus situations, "K" replies, 11:59 PM deadlines, 8 AM classes).
- **Dynamic 100-Point Scoring System** calculated via JavaScript.
- **6 Aura Levels:**
  - 0–39 → NPC Energy 😶
  - 40–59 → Average Aura 😐
  - 60–69 → Cool Aura 😎
  - 70–79 → Pro Aura 🔥
  - 80–89 → Savage Aura 🗿
  - 90–100 → Unlimited Aura 👑
- **Official NexaSoul Branding & Logos** (`assets/club-logo.svg`, `assets/favicon.svg`).

---

## 📁 File Structure

```text
aura-detector/
│
├── index.html         # HTML5 Markup with clean section structure
├── style.css          # CSS3 stylesheet with design variables
├── script.js         # JavaScript quiz logic & state management
├── README.md          # Curriculum documentation & AI guide
│
└── assets/            # NexaSoul Official Logos & Assets
    ├── club-logo.svg
    ├── club-profile.svg
    ├── favicon.svg
    └── icons.svg
```

---

## 🤖 AI Prompting Guide for Students & Instructors

Students can use AI prompts to help them redesign and edit the base template into something awesome:

### 💡 Example Prompts to Hack & Enhance the Website:
1. **Neon Dark Theme:**  
   > *"Redesign style.css to turn Aura Detector into a sleek neon dark mode with glassmorphism cards and vibrant gradient buttons."*

2. **Animations & Confetti:**  
   > *"Modify script.js and index.html to add confetti animations when the user scores Unlimited Aura or Savage Aura."*

3. **Sound Effects:**  
   > *"Add fun Web Audio API sound effects when options are clicked and when the final Aura score is revealed."*

4. **Social Sharing:**  
   > *"Add a 'Share your Aura on Instagram / WhatsApp' button on the results screen that copies the user's score text."*

---

## 🚀 Student Guide: Setup & Editing

### 1. Download & Open the Project
You need to download the base project from GitHub and open it in your code editor.
1. Open your terminal or command prompt.
2. Clone the repository using Git:
   ```bash
   git clone https://github.com/GARVITAMITBHUTANI/Aura-detector-test.git
   ```
   *(Note: If you don't have Git installed, you can click the green **Code** button on GitHub and select **Download ZIP**, then extract it).*
3. Open **VS Code**.
4. Go to `File` > `Open Folder...` and select the downloaded `aura-detector` folder.

### 2. View the Website (Live Preview)
To see the website and test your changes in real-time:
1. In VS Code, go to the Extensions panel (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2. Search for and install the **Live Server** extension (by Ritwick Dey).
3. Open `index.html` in VS Code.
4. Right-click anywhere in the code and select **"Open with Live Server"** (or click **"Go Live"** at the bottom right). Your browser will automatically open the website.

### 3. How to Edit & Customize (Hackathon Challenge)
Now that you have the project running, it's time to redesign it! Here is where you make changes:
- **Change the Look (Colors, Fonts, Layouts):** Open `style.css`. At the very top, you'll find `:root` variables. Change the hex color codes here to instantly create a new theme! Scroll down to edit card designs, button hover effects, and typography.
- **Change the Questions & Logic:** Open `script.js`. You will see a `const questions = [...]` array at the top. You can rewrite the questions, change the options, or adjust the scores. Scroll down to edit the `showResults()` function if you want to change the Aura Level names (e.g., from "Savage Aura" to "Sigma Aura").
- **Change the Content:** Open `index.html` to add new text, images, footers, or completely new HTML sections to the website.

---

### 🌐 Club Credentials
**NexaSoul — Frontend × Full Stack Development Club**  
*Chandigarh University*  
*Code • Connect • Conquer*
