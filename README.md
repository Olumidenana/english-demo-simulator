# DemoReady: Online English Teacher Demo-Lesson Simulator

A focused, single-page rehearsal web application designed for applicants preparing for the high-stakes **live demo lesson interview** on online ESL platforms (such as **Native Camp**, **Engoo**, and **DMM Eikaiwa**).

---

## 🎯 The Interview Challenge

On online teaching platforms, applicants must teach a 5-minute scripted lesson to an interviewer roleplaying as an ESL student. Applicants are graded strictly on criteria that frequently trip up first-time candidates:
1. **The Opening Rule (Auto-Fail):** The teacher must introduce themselves and state both their own name and the student's name in the opening ~15 seconds. Missing this is an immediate critical fail on the real platform.
2. **Planted Grammar Traps:** The interviewer intentionally speaks 1–2 planted grammar mistakes out loud (e.g., subject-verb agreement, irregular past tense, prepositions, or uncountable nouns). Teachers must catch and flag these within **6 seconds**.
3. **Pacing:** The entire lesson must finish within 5:00 without running out of time.

**DemoReady** solves this by providing progressive rehearsal drills that build muscle memory before candidates face the actual interviewer.

---

## 🚀 Progressive Difficulty Stages

To prevent cognitive overload from throwing camera, audio, script, and timer at a nervous user all at once:

### 1. Stage 1: The 15-Second Name Drill (30s)
* **Goal:** Master introducing yourself and greeting the student by name immediately.
* **Format:** Enter your name and the student's name. Speak aloud or type your greeting.
* **Feedback:** Instant pass/fail status and elapsed seconds. Explains why this is a critical gatekeeper rule.

### 2. Stage 2: The 6-Second Error Catch Drill
* **Goal:** Train lightning-fast reflex times for spotting spoken grammar mistakes.
* **Format:** Simulated student speaks a sample line aloud via Speech Synthesis. One planted error is embedded.
* **Reaction Window:** A dynamic 6-second countdown bar appears. Candidates click **"Flag Correction"** or speak the correction.
* **Feedback:** Reaction time in seconds (e.g. `1.8s`) and grammar rule explanation.

### 3. Stage 3: Full Rehearsal Simulation (5:00)
* **Goal:** Full dress rehearsal under authentic exam conditions.
* **Layout:**
  * **Left Panel (Teacher's Guide):** Interactive scripted lesson guide highlighting the active step, teacher cues, and student lines.
  * **Right Panel (Classroom Video Call):** Simulated video call with PiP webcam self-view, student avatar with audio visualizer, real-time synchronized captions, and dynamic error overlay.
  * **Bottom Dock:** Continuous speech recognition transcript (*"🎙️ You said: ..."*), fallback typing input, 5:00 master countdown timer, and early exit control.
* **Scoring & Evaluation:** Detailed scorecard breaking down opening name check (PASS / CRITICAL FAIL), reaction speeds on planted errors, pacing, and tailored interviewer tips.
* **History & CSV Export:** Automatically saves sessions to browser `localStorage` and provides one-click export to `.csv`.

---

## 💻 How to Run

No build step, Node.js, Python, or external servers are required. Everything runs 100% in the browser.

### Quick Start:
1. Double-click `index.html` or open it in **Google Chrome** or **Microsoft Edge**.
2. Alternatively, serve via any local static file server:
   ```bash
   # If you have any local HTTP server installed (optional):
   npx serve .
   # or
   python -m http.server 8080
   ```
3. Allow camera and microphone permissions when prompted for full video/audio rehearsal.

---

## 🛡️ Privacy & Fallbacks

* **Zero Backend:** Runs entirely client-side. No audio, video, or names are ever uploaded to an external server.
* **Graceful Degradation:** If camera/mic permissions are denied or if using a browser without the SpeechRecognition API (e.g., Firefox), the simulator automatically runs in **Text-Caption Mode** with typed corrections and synchronized subtitles.

---

## 📚 Included Curricula (Lesson Scripts)

1. **Lesson 1: Daily Routines & Hobbies (A2)**
   * Error 1: Subject-Verb Agreement (*"my brother go"* &rarr; *"brother goes"*)
   * Error 2: Missing Preposition (*"listen music"* &rarr; *"listen to music"*)
2. **Lesson 2: Travel & Vacations (B1)**
   * Error 1: Irregular Past Tense (*"I go to Rome"* &rarr; *"I went to Rome"*)
   * Error 2: Countable Plural Noun (*"many souvenir"* &rarr; *"many souvenirs"*)
3. **Lesson 3: Ordering at a Cafe (A2)**
   * Error 1: Uncountable Noun (*"three breads"* &rarr; *"three pieces of bread / rolls"*)
   * Error 2: Double Comparative (*"more better"* &rarr; *"better / much better"*)
4. **Lesson 4: Work & Career Experiences (B1+)**
   * Error 1: Present Perfect Duration (*"work here since three years"* &rarr; *"have worked here for three years"*)
   * Error 2: Modal Verb Agreement (*"can speaks"* &rarr; *"can speak"*)
5. **Lesson 5: Weekend Shopping & Fashion (B1)**
   * Error 1: Plural Auxiliary Agreement (*"how much does these shoes cost"* &rarr; *"how much do these shoes cost"*)
   * Error 2: Pair Noun Usage (*"bought two jeans"* &rarr; *"bought two pairs of jeans"*)
