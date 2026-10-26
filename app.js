/* ==========================================================================
   Online English Teacher Demo-Lesson Simulator - Core Application Logic
   ========================================================================== */

(function () {
  "use strict";

  // ------------------------------------------------------------------------
  // Global State
  // ------------------------------------------------------------------------
  const STORAGE_KEY = "demoready_session_history_v1";

  const state = {
    currentStage: 1,
    history: [],

    // Stage 1: Name Drill
    stage1: {
      timer: null,
      secondsLeft: 30,
      isRunning: false,
      teacherName: "Sarah",
      studentName: "Kenji",
      teacherDetected: false,
      studentDetected: false,
      transcript: "",
      finished: false
    },

    // Stage 2: Error Drill
    stage2: {
      sampleErrors: [
        {
          introLine: "I really enjoy my daily morning routine in Tokyo.",
          errorLine: "Every morning, my brother go to school by bicycle.",
          text: "Every morning, my brother go to school by bicycle.",
          errorPhrase: "brother go",
          correctPhrase: "brother goes",
          errorType: "Subject-Verb Agreement",
          tip: "'Brother' is 3rd-person singular. Remember to add '-s' or '-es': 'My brother goes'."
        },
        {
          introLine: "We went on an exciting trip to Europe last month.",
          errorLine: "Yesterday night, I go to the cinema with my best friend.",
          text: "Yesterday night, I go to the cinema with my best friend.",
          errorPhrase: "I go to",
          correctPhrase: "I went to",
          errorType: "Irregular Past Tense",
          tip: "'Yesterday night' happened in the past. Use the irregular past tense: 'I went to'."
        },
        {
          introLine: "Listening to podcasts helps me relax after a long shift.",
          errorLine: "In my free time, I really like to listen music at home.",
          text: "In my free time, I really like to listen music at home.",
          errorPhrase: "listen music",
          correctPhrase: "listen to music",
          errorType: "Missing Preposition",
          tip: "The verb 'listen' needs the preposition 'to' before its object: 'listen TO music'."
        },
        {
          introLine: "Good morning! I would like to order breakfast please.",
          errorLine: "Excuse me, can I have three breads and two hot coffees?",
          text: "Excuse me, can I have three breads and two hot coffees?",
          errorPhrase: "three breads",
          correctPhrase: "three rolls / pieces of bread",
          errorType: "Uncountable Noun",
          tip: "'Bread' is uncountable in English. Say 'three pieces/slices of bread' or 'three rolls'."
        },
        {
          introLine: "We visited the fashion department store on Saturday afternoon.",
          errorLine: "Excuse me, how much does these shoes cost in the window display?",
          text: "Excuse me, how much does these shoes cost in the window display?",
          errorPhrase: "does these shoes cost",
          correctPhrase: "do these shoes cost",
          errorType: "Plural Auxiliary Agreement",
          tip: "'These shoes' is plural, so use auxiliary 'do': 'How much DO these shoes cost?'."
        }
      ],
      currentIdx: 0,
      timer: null,
      startTime: 0,
      flagged: false,
      reactionTime: 0,
      isRunning: false,
      isSpeaking: false
    },

    // Stage 3: Full Simulation
    stage3: {
      selectedScriptId: "script_daily_routines",
      selectedScript: null,
      teacherName: "Sarah",
      studentName: "Kenji",
      textOnlyMode: false,
      currentLineIndex: 0,
      isRunning: false,
      mediaStream: null,
      speechRecognition: null,
      isListening: false,
      masterTimer: null,
      secondsRemaining: 300,
      sessionStartTime: 0,
      sessionElapsedSeconds: 0,
      autoAdvance: true,
      autoAdvanceTimer: null,

      // Opening Check
      openingCheck: {
        checked: false,
        passed: false,
        teacherDetected: false,
        studentDetected: false,
        transcriptAccumulated: ""
      },

      // Planted Errors Tracking
      plantedErrors: [],
      activeError: null,

      // Completion info
      completionStatus: "idle",
      latestSessionRecord: null
    }
  };

  // Web Audio Context for synthesized sound feedback (chimes/clicks)
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration) {
    try {
      type = type || "sine";
      duration = duration || 0.15;
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio tone error", e);
    }
  }

  function playSuccessChime() {
    playTone(587.33, "sine", 0.1);
    setTimeout(() => playTone(880.0, "sine", 0.25), 100);
  }

  function playAlertTone() {
    playTone(330, "sawtooth", 0.15);
  }

  // ------------------------------------------------------------------------
  // Text to Speech Engine (Web Speech API with Headless Fallback Guard)
  // ------------------------------------------------------------------------
  function speakLine(text, onStart, onEnd) {
    if (!text) {
      if (onEnd) onEnd();
      return;
    }

    if (!("speechSynthesis" in window)) {
      if (onStart) onStart();
      const delay = Math.max(1400, text.split(" ").length * 300);
      setTimeout(() => { if (onEnd) onEnd(); }, delay);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang && v.lang.startsWith("en") && !v.name.includes("Bad"));
      if (englishVoice) utterance.voice = englishVoice;

      let ended = false;
      const safeEnd = () => {
        if (ended) return;
        ended = true;
        if (onEnd) onEnd();
      };

      utterance.onstart = () => { if (onStart) onStart(); };
      utterance.onend = safeEnd;
      utterance.onerror = (err) => {
        console.warn("TTS notice:", err);
        safeEnd();
      };

      // Safeguard for headless browsers or muted tabs where onend may not fire
      const maxDuration = Math.max(2200, text.split(" ").length * 480);
      setTimeout(safeEnd, maxDuration);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS exception fallback:", err);
      if (onStart) onStart();
      const delay = Math.max(1400, text.split(" ").length * 300);
      setTimeout(() => { if (onEnd) onEnd(); }, delay);
    }
  }

  // ------------------------------------------------------------------------
  // Stage Navigation
  // ------------------------------------------------------------------------
  window.switchStage = function (stageNum) {
    if (state.stage3.isRunning && stageNum !== 3) {
      if (!confirm("Your full rehearsal session is currently active. Are you sure you want to leave?")) {
        return;
      }
      cleanupStage3Session("aborted");
    }

    if (state.stage1.isRunning) {
      clearInterval(state.stage1.timer);
      state.stage1.isRunning = false;
    }
    if (state.stage2.isRunning) {
      clearInterval(state.stage2.timer);
      state.stage2.isRunning = false;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    state.currentStage = stageNum;

    document.querySelectorAll(".stage-nav .nav-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById("navStage" + stageNum);
    if (activeBtn) activeBtn.classList.add("active");

    document.querySelectorAll(".stage-view").forEach(v => v.classList.remove("active-view"));
    const activeView = document.getElementById("stage" + stageNum + "View");
    if (activeView) activeView.classList.add("active-view");

    if (stageNum === 1) resetStage1();
    else if (stageNum === 2) initStage2();
    else if (stageNum === 3) initStage3Setup();
  };

  // ------------------------------------------------------------------------
  // STAGE 1: Name Drill Logic
  // ------------------------------------------------------------------------
  window.validateStage1Inputs = function () {
    const t = document.getElementById("s1TeacherName").value.trim();
    const s = document.getElementById("s1StudentName").value.trim();
    const btn = document.getElementById("s1StartBtn");
    if (btn) btn.disabled = !t || !s;
  };

  window.startStage1Drill = function () {
    const teacherInput = document.getElementById("s1TeacherName").value.trim();
    const studentInput = document.getElementById("s1StudentName").value.trim();

    if (!teacherInput || !studentInput) {
      alert("Please enter both your name and the student's name to practice.");
      return;
    }

    state.stage1.teacherName = teacherInput;
    state.stage1.studentName = studentInput;
    state.stage1.teacherDetected = false;
    state.stage1.studentDetected = false;
    state.stage1.transcript = "";
    state.stage1.secondsLeft = 30;
    state.stage1.isRunning = true;
    state.stage1.finished = false;

    updateStage1TagUI();
    document.getElementById("s1Feedback").classList.add("hidden");
    const replyBox = document.getElementById("s1MockReplyBox");
    if (replyBox) replyBox.classList.add("hidden");

    document.getElementById("s1StartBtn").disabled = true;
    document.getElementById("s1GreetingInput").value = "";
    document.getElementById("s1GreetingInput").focus();

    updateStage1TimerDisplay();
    startStage1SpeechRecog();

    clearInterval(state.stage1.timer);
    state.stage1.timer = setInterval(() => {
      state.stage1.secondsLeft--;
      updateStage1TimerDisplay();

      if (state.stage1.secondsLeft <= 0) {
        finishStage1Drill();
      }
    }, 1000);
  };

  function updateStage1TimerDisplay() {
    const el = document.getElementById("s1TimerText");
    if (el) el.textContent = state.stage1.secondsLeft + "s";
  }

  function updateStage1TagUI() {
    const tagT = document.getElementById("s1TagTeacher");
    const statusT = document.getElementById("s1TagTeacherStatus");
    const tagS = document.getElementById("s1TagStudent");
    const statusS = document.getElementById("s1TagStudentStatus");

    if (state.stage1.teacherDetected) {
      tagT.className = "detected-tag detected";
      statusT.textContent = "✓ Detected (" + state.stage1.teacherName + ")";
    } else {
      tagT.className = "detected-tag missing";
      statusT.textContent = "Missing (" + state.stage1.teacherName + ")";
    }

    if (state.stage1.studentDetected) {
      tagS.className = "detected-tag detected";
      statusS.textContent = "✓ Detected (" + state.stage1.studentName + ")";
    } else {
      tagS.className = "detected-tag missing";
      statusS.textContent = "Missing (" + state.stage1.studentName + ")";
    }
  }

  function evaluateStage1Text(rawText) {
    const clean = rawText.toLowerCase();
    const tName = state.stage1.teacherName.toLowerCase();
    const sName = state.stage1.studentName.toLowerCase();

    if (clean.includes(tName)) state.stage1.teacherDetected = true;
    if (clean.includes(sName)) state.stage1.studentDetected = true;

    updateStage1TagUI();

    if (state.stage1.teacherDetected && state.stage1.studentDetected) {
      finishStage1Drill();
    }
  }

  window.checkStage1InputGreeting = function () {
    const val = document.getElementById("s1GreetingInput").value.trim();
    if (!val) return;
    state.stage1.transcript += " " + val;
    evaluateStage1Text(state.stage1.transcript);
  };

  let s1Recog = null;
  function startStage1SpeechRecog() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      if (s1Recog) s1Recog.abort();
      s1Recog = new SpeechRec();
      s1Recog.continuous = true;
      s1Recog.interimResults = true;
      s1Recog.lang = "en-US";

      s1Recog.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          interim += e.results[i][0].transcript;
        }
        state.stage1.transcript += " " + interim;
        evaluateStage1Text(state.stage1.transcript);
      };

      s1Recog.onerror = (e) => {
        if (e.error !== "no-speech") {
          console.warn("Stage 1 speech error", e.error);
        }
      };

      s1Recog.start();
    } catch (err) {
      console.warn("Could not start stage 1 speech recog", err);
    }
  }

  function finishStage1Drill() {
    if (state.stage1.finished) return;
    state.stage1.finished = true;
    clearInterval(state.stage1.timer);
    state.stage1.isRunning = false;
    document.getElementById("s1StartBtn").disabled = false;

    if (s1Recog) {
      try { s1Recog.abort(); } catch (e) {}
    }

    const passed = state.stage1.teacherDetected && state.stage1.studentDetected;
    const timeTaken = 30 - state.stage1.secondsLeft;

    const feedbackBox = document.getElementById("s1Feedback");
    const feedbackIcon = document.getElementById("s1FeedbackIcon");
    const feedbackTitle = document.getElementById("s1FeedbackTitle");
    const feedbackMsg = document.getElementById("s1FeedbackMsg");
    const replyBox = document.getElementById("s1MockReplyBox");
    const replyText = document.getElementById("s1MockReplyText");

    feedbackBox.classList.remove("hidden", "pass", "fail");

    if (passed) {
      playSuccessChime();

      // Play mock student response line
      const mockReply = "Hello Teacher " + state.stage1.teacherName + "! Nice to meet you, my name is " + state.stage1.studentName + ". Thank you for teaching me today!";
      if (replyBox && replyText) {
        replyText.textContent = '"' + mockReply + '"';
        replyBox.classList.remove("hidden");
      }
      speakLine(mockReply);

      feedbackBox.classList.add("pass");
      feedbackIcon.textContent = "✅";
      feedbackTitle.textContent = "Drill Passed (" + timeTaken + "s)!";
      feedbackMsg.innerHTML = "You stated both names in <strong>" + timeTaken + " seconds</strong>. In real interviews, keeping this under 15 seconds is key to starting strong!";
    } else {
      playAlertTone();
      if (replyBox) replyBox.classList.add("hidden");

      feedbackBox.classList.add("fail");
      feedbackIcon.textContent = "⚠️";
      feedbackTitle.textContent = "Drill Failed - Missing Name";
      let missing = [];
      if (!state.stage1.teacherDetected) missing.push("your name ('" + state.stage1.teacherName + "')");
      if (!state.stage1.studentDetected) missing.push("the student's name ('" + state.stage1.studentName + "')");
      feedbackMsg.innerHTML = "You missed: " + missing.join(" and ") + ". Remember: <em>'Hello, my name is " + state.stage1.teacherName + ". Welcome, " + state.stage1.studentName + "!'</em>";
    }
  }

  window.resetStage1 = function () {
    clearInterval(state.stage1.timer);
    state.stage1.isRunning = false;
    state.stage1.secondsLeft = 30;
    state.stage1.teacherDetected = false;
    state.stage1.studentDetected = false;
    state.stage1.finished = false;
    state.stage1.transcript = "";
    if (s1Recog) {
      try { s1Recog.abort(); } catch (e) {}
    }
    updateStage1TimerDisplay();
    updateStage1TagUI();
    document.getElementById("s1StartBtn").disabled = false;
    document.getElementById("s1Feedback").classList.add("hidden");
    const replyBox = document.getElementById("s1MockReplyBox");
    if (replyBox) replyBox.classList.add("hidden");
    document.getElementById("s1GreetingInput").value = "";
    validateStage1Inputs();
  };

  // ------------------------------------------------------------------------
  // STAGE 2: Error-Catching Drill Logic
  // ------------------------------------------------------------------------
  function initStage2() {
    state.stage2.currentIdx = 0;
    state.stage2.isRunning = false;
    state.stage2.flagged = false;
    state.stage2.isSpeaking = false;
    clearInterval(state.stage2.timer);
    renderStage2Line();
  }

  function renderStage2Line() {
    const item = state.stage2.sampleErrors[state.stage2.currentIdx];
    const preview = item.introLine ? `${item.introLine} ... "${item.errorLine}"` : `"${item.errorLine}"`;
    document.getElementById("s2SpeechText").textContent = preview;
    document.getElementById("s2FlagBtn").disabled = true;
    document.getElementById("s2TimerBar").style.width = "100%";
    document.getElementById("s2WindowLabel").textContent = "Reaction window: 6.0s";
    document.getElementById("s2Feedback").classList.add("hidden");
    document.getElementById("s2Visualizer").classList.remove("speaking");
  }

  window.switchStage2Line = function () {
    if (state.stage2.isRunning || state.stage2.isSpeaking) return;
    state.stage2.currentIdx = (state.stage2.currentIdx + 1) % state.stage2.sampleErrors.length;
    renderStage2Line();
  };

  window.playStage2Line = function () {
    if (state.stage2.isSpeaking || state.stage2.isRunning) return;

    const item = state.stage2.sampleErrors[state.stage2.currentIdx];
    document.getElementById("s2PlayBtn").disabled = true;
    document.getElementById("s2FlagBtn").disabled = true;
    document.getElementById("s2Feedback").classList.add("hidden");
    document.getElementById("s2Visualizer").classList.add("speaking");
    state.stage2.isSpeaking = true;

    if (item.introLine) {
      document.getElementById("s2SpeechText").textContent = '"' + item.introLine + '"';
      speakLine(
        item.introLine,
        () => {},
        () => {
          setTimeout(() => {
            document.getElementById("s2SpeechText").textContent = '"' + item.errorLine + '"';
            speakLine(
              item.errorLine,
              () => {},
              () => {
                state.stage2.isSpeaking = false;
                document.getElementById("s2Visualizer").classList.remove("speaking");
                startStage2ReactionWindow();
              }
            );
          }, 800);
        }
      );
    } else {
      document.getElementById("s2SpeechText").textContent = '"' + item.errorLine + '"';
      speakLine(
        item.errorLine,
        () => {},
        () => {
          state.stage2.isSpeaking = false;
          document.getElementById("s2Visualizer").classList.remove("speaking");
          startStage2ReactionWindow();
        }
      );
    }
  };

  function startStage2ReactionWindow() {
    state.stage2.isRunning = true;
    state.stage2.flagged = false;
    state.stage2.startTime = performance.now();
    document.getElementById("s2FlagBtn").disabled = false;
    playAlertTone();

    const durationMs = 6000;
    const bar = document.getElementById("s2TimerBar");
    const label = document.getElementById("s2WindowLabel");

    clearInterval(state.stage2.timer);
    state.stage2.timer = setInterval(() => {
      const elapsed = performance.now() - state.stage2.startTime;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const pct = (remainingMs / durationMs) * 100;
      bar.style.width = pct + "%";
      label.textContent = "Reaction window: " + (remainingMs / 1000).toFixed(1) + "s";

      if (remainingMs <= 0) {
        clearInterval(state.stage2.timer);
        state.stage2.isRunning = false;
        document.getElementById("s2FlagBtn").disabled = true;
        document.getElementById("s2PlayBtn").disabled = false;
        finishStage2Reaction(false, 6.0);
      }
    }, 50);
  }

  window.flagStage2Error = function () {
    if (!state.stage2.isRunning || state.stage2.flagged) return;
    state.stage2.flagged = true;
    clearInterval(state.stage2.timer);
    state.stage2.isRunning = false;
    document.getElementById("s2FlagBtn").disabled = true;
    document.getElementById("s2PlayBtn").disabled = false;

    const reactionSec = Math.max(0.2, (performance.now() - state.stage2.startTime) / 1000);
    state.stage2.reactionTime = reactionSec;
    finishStage2Reaction(true, reactionSec);
  };

  function finishStage2Reaction(caught, reactionSec) {
    const item = state.stage2.sampleErrors[state.stage2.currentIdx];
    const feedbackBox = document.getElementById("s2Feedback");
    const feedbackIcon = document.getElementById("s2FeedbackIcon");
    const feedbackTitle = document.getElementById("s2FeedbackTitle");
    const feedbackMsg = document.getElementById("s2FeedbackMsg");
    const tipEl = document.getElementById("s2GrammarTip");

    feedbackBox.classList.remove("hidden", "pass", "fail");

    if (caught) {
      playSuccessChime();
      feedbackBox.classList.add("pass");
      feedbackIcon.textContent = "⚡";
      feedbackTitle.textContent = "Caught in " + reactionSec.toFixed(1) + "s!";
      feedbackMsg.innerHTML = "Great reflex! You caught the <strong>" + item.errorType + "</strong> error before time expired.";
    } else {
      playAlertTone();
      feedbackBox.classList.add("fail");
      feedbackIcon.textContent = "⏳";
      feedbackTitle.textContent = "Missed! 6-Second Window Expired";
      feedbackMsg.innerHTML = "You missed the error: <em>'" + item.errorPhrase + "'</em>. Be prepared to flag immediately!";
    }

    tipEl.innerHTML = "<strong>Rule (" + item.errorType + "):</strong> " + item.tip + "<br><strong>Expected:</strong> \"" + item.correctPhrase + "\"";
  }

  // Keyboard shortcut listener: Spacebar flags Stage 2 error if active
  window.addEventListener("keydown", (e) => {
    if (state.currentStage === 2 && state.stage2.isRunning && (e.code === "Space" || e.key === " ")) {
      e.preventDefault();
      window.flagStage2Error();
    }
  });

  // ------------------------------------------------------------------------
  // STAGE 3: Full Simulation Setup & Room Logic
  // ------------------------------------------------------------------------
  window.validateSetupInputs = function () {
    const t = document.getElementById("simTeacherName").value.trim();
    const s = document.getElementById("simStudentName").value.trim();
    const btn = document.getElementById("startSimulationBtn");
    if (btn) {
      const valid = t.length > 0 && s.length > 0;
      btn.disabled = !valid;
      btn.style.opacity = valid ? "1" : "0.5";
      btn.style.cursor = valid ? "pointer" : "not-allowed";
    }
  };

  function initStage3Setup() {
    loadSavedHistory();
    renderScriptPicker();
    validateSetupInputs();
    document.getElementById("simSetupScreen").style.display = "block";
    document.getElementById("simRoom").classList.remove("active-room");
  }

  function renderScriptPicker() {
    const container = document.getElementById("scriptPickerList");
    if (!container || !window.LESSON_SCRIPTS) return;

    container.innerHTML = "";
    window.LESSON_SCRIPTS.forEach((script) => {
      const card = document.createElement("div");
      card.className = "script-option-card" + (script.id === state.stage3.selectedScriptId ? " selected" : "");
      card.onclick = () => selectScript(script.id);

      card.innerHTML = `
        <div class="script-option-header">
          <span class="script-option-title">${script.title}</span>
          <span class="script-option-level">${script.level}</span>
        </div>
        <p class="script-option-desc">${script.description}</p>
        <div style="font-size: 0.72rem; color: var(--accent); margin-top: 0.4rem;">
          Planted traps: ${script.plantedErrorsCount} errors | Student: ${script.targetStudent}
        </div>
      `;
      container.appendChild(card);
    });
  }

  function selectScript(scriptId) {
    state.stage3.selectedScriptId = scriptId;
    renderScriptPicker();
    const script = window.LESSON_SCRIPTS.find(s => s.id === scriptId);
    if (script) {
      document.getElementById("simStudentName").value = script.defaultStudentName;
      validateSetupInputs();
    }
  }

  window.randomizeScript = function () {
    if (!window.LESSON_SCRIPTS || window.LESSON_SCRIPTS.length === 0) return;
    const rand = window.LESSON_SCRIPTS[Math.floor(Math.random() * window.LESSON_SCRIPTS.length)];
    selectScript(rand.id);
  };

  window.toggleAutoAdvance = function (enabled) {
    state.stage3.autoAdvance = !!enabled;
    if (!state.stage3.autoAdvance && state.stage3.autoAdvanceTimer) {
      clearTimeout(state.stage3.autoAdvanceTimer);
      state.stage3.autoAdvanceTimer = null;
    }
  };

  window.startFullSimulation = async function () {
    const teacherName = document.getElementById("simTeacherName").value.trim();
    const studentName = document.getElementById("simStudentName").value.trim();
    const skipMedia = document.getElementById("skipMediaToggle").checked;

    if (!teacherName || !studentName) {
      alert("Please provide both your name and the student's name before starting.");
      return;
    }

    state.stage3.teacherName = teacherName;
    state.stage3.studentName = studentName;
    state.stage3.textOnlyMode = skipMedia;

    const script = window.LESSON_SCRIPTS.find(s => s.id === state.stage3.selectedScriptId) || window.LESSON_SCRIPTS[0];
    state.stage3.selectedScript = script;
    state.stage3.currentLineIndex = 0;
    state.stage3.secondsRemaining = 300;
    state.stage3.sessionStartTime = Date.now();
    state.stage3.completionStatus = "running";
    state.stage3.isRunning = true;
    state.stage3.autoAdvance = document.getElementById("autoAdvanceToggle") ? document.getElementById("autoAdvanceToggle").checked : true;

    state.stage3.openingCheck = {
      checked: false,
      passed: false,
      teacherDetected: false,
      studentDetected: false,
      transcriptAccumulated: ""
    };

    state.stage3.plantedErrors = script.lines
      .filter(l => l.hasError)
      .map(l => ({
        lineId: l.id,
        errorId: l.errorId,
        errorPhrase: l.errorPhrase,
        correctPhrase: l.correctPhrase,
        errorType: l.errorType,
        explanation: l.explanation,
        caught: false,
        reactionTimeSec: 0
      }));

    await setupCameraAndMic(skipMedia);
    setupLiveSpeechRecognition();

    document.getElementById("simSetupScreen").style.display = "none";
    document.getElementById("simRoom").classList.add("active-room");
    document.getElementById("activeStudentLabel").textContent = studentName;
    document.getElementById("liveCaptionText").textContent = "Connecting to student...";
    document.getElementById("userLiveTranscript").textContent = "Say something aloud or type in the box below...";

    const nameBadge = document.getElementById("nameCheckBadge");
    if (nameBadge) {
      nameBadge.textContent = "Opening name check pending (15s)...";
      nameBadge.className = "status-pill";
    }

    renderLessonScriptGuide();
    startMasterTimer();
    executeScriptLine(0);
  };

  async function setupCameraAndMic(skipMedia) {
    const videoEl = document.getElementById("selfVideo");
    const fallbackEl = document.getElementById("selfVideoFallback");
    const tagEl = document.getElementById("selfCameraTag");

    if (skipMedia || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      videoEl.classList.add("hidden");
      fallbackEl.classList.remove("hidden");
      tagEl.textContent = "Text Mode";
      state.stage3.textOnlyMode = true;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 } },
        audio: true
      });
      state.stage3.mediaStream = stream;
      videoEl.srcObject = stream;
      videoEl.classList.remove("hidden");
      fallbackEl.classList.add("hidden");
      tagEl.textContent = "Camera On";
    } catch (err) {
      console.warn("Camera/Mic permission denied or unavailable:", err);
      videoEl.classList.add("hidden");
      fallbackEl.classList.remove("hidden");
      tagEl.textContent = "No Camera (Fallback)";
      state.stage3.textOnlyMode = true;
    }
  }

  function setupLiveSpeechRecognition() {
    const badge = document.getElementById("speechRecogBadge");
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec || state.stage3.textOnlyMode) {
      badge.textContent = "⌨️ Text Fallback Mode";
      badge.className = "status-pill";
      state.stage3.speechRecognition = null;
      return;
    }

    try {
      const recog = new SpeechRec();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = "en-US";

      recog.onresult = (e) => {
        let interimTranscript = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          interimTranscript += e.results[i][0].transcript;
        }

        const displayEl = document.getElementById("userLiveTranscript");
        if (displayEl) {
          displayEl.textContent = '🎙️ "' + interimTranscript.trim() + '"';
        }

        handleLiveSpokenText(interimTranscript);
      };

      recog.onerror = (e) => {
        if (e.error === "no-speech") return; // Expected silence
        console.warn("Live speech recognition error:", e.error);
        if (e.error === "not-allowed") {
          badge.textContent = "Mic Denied (Type mode)";
        }
      };

      recog.onend = () => {
        if (state.stage3.isRunning && state.stage3.speechRecognition) {
          try { recog.start(); } catch (e) {}
        }
      };

      recog.start();
      state.stage3.speechRecognition = recog;
      badge.textContent = "🎙️ Listening Active";
      badge.className = "status-pill pill-pass";
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      badge.textContent = "Speech Recog Fallback";
    }
  }

  function handleLiveSpokenText(spokenText) {
    if (!spokenText) return;
    const clean = spokenText.toLowerCase();

    // 1. Check Opening Names (during first 15 seconds)
    if (!state.stage3.openingCheck.passed && state.stage3.secondsRemaining >= 285) {
      const tName = state.stage3.teacherName.toLowerCase();
      const sName = state.stage3.studentName.toLowerCase();

      state.stage3.openingCheck.transcriptAccumulated += " " + clean;
      const fullText = state.stage3.openingCheck.transcriptAccumulated;

      if (fullText.includes(tName)) state.stage3.openingCheck.teacherDetected = true;
      if (fullText.includes(sName)) state.stage3.openingCheck.studentDetected = true;

      updateNameCheckBadge();
    }

    // 2. Check if active error window is waiting for a catch
    if (state.stage3.activeError && !state.stage3.activeError.resolved) {
      const targetPhrase = state.stage3.activeError.lineObj.correctPhrase.toLowerCase();
      const keywords = ["correction", "instead", "say", "repeat", "mistake", "grammar"];

      const spokeKeyword = keywords.some(k => clean.includes(k));
      const spokeCorrection = targetPhrase.split(" ").some(word => word.length > 3 && clean.includes(word));

      if (spokeKeyword || spokeCorrection) {
        handleSimulationErrorCatch();
      }
    }
  }

  function updateNameCheckBadge() {
    const badge = document.getElementById("nameCheckBadge");
    if (!badge) return;

    const op = state.stage3.openingCheck;
    if (op.teacherDetected && op.studentDetected) {
      op.passed = true;
      badge.textContent = "✓ Opening Names Passed!";
      badge.className = "status-pill pill-pass";
    } else if (op.teacherDetected || op.studentDetected) {
      badge.textContent = "1 of 2 names detected";
      badge.className = "status-pill";
    } else {
      badge.textContent = "Awaiting both names...";
      badge.className = "status-pill";
    }
  }

  window.sendTypedCorrection = function () {
    const input = document.getElementById("typeCorrectionInput");
    const val = input.value.trim();
    if (!val) return;

    const displayEl = document.getElementById("userLiveTranscript");
    if (displayEl) {
      displayEl.textContent = '💬 You typed: "' + val + '"';
    }

    handleLiveSpokenText(val);

    if (state.stage3.activeError && !state.stage3.activeError.resolved) {
      handleSimulationErrorCatch();
    }

    input.value = "";
  };

  function startMasterTimer() {
    clearInterval(state.stage3.masterTimer);
    updateMasterTimerUI();

    state.stage3.masterTimer = setInterval(() => {
      state.stage3.secondsRemaining--;
      updateMasterTimerUI();

      if (state.stage3.secondsRemaining === 285 && !state.stage3.openingCheck.checked) {
        finalizeOpeningNameCheck();
      }

      if (state.stage3.secondsRemaining <= 0) {
        clearInterval(state.stage3.masterTimer);
        forceEndDueToTimeout();
      }
    }, 1000);
  }

  function updateMasterTimerUI() {
    const mins = Math.floor(state.stage3.secondsRemaining / 60);
    const secs = state.stage3.secondsRemaining % 60;
    const str = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    const el = document.getElementById("masterTimerNums");
    if (!el) return;
    el.textContent = str;

    if (state.stage3.secondsRemaining <= 30) {
      el.className = "master-timer-nums danger";
    } else if (state.stage3.secondsRemaining <= 60) {
      el.className = "master-timer-nums warning";
    } else {
      el.className = "master-timer-nums";
    }
  }

  function finalizeOpeningNameCheck() {
    state.stage3.openingCheck.checked = true;
    const badge = document.getElementById("nameCheckBadge");

    if (state.stage3.openingCheck.teacherDetected && state.stage3.openingCheck.studentDetected) {
      state.stage3.openingCheck.passed = true;
      if (badge) {
        badge.textContent = "✓ Names Check PASSED";
        badge.className = "status-pill pill-pass";
      }
    } else {
      state.stage3.openingCheck.passed = false;
      if (badge) {
        badge.textContent = "⚠️ Names Check FAILED (15s elapsed)";
        badge.className = "status-pill pill-critical-fail";
      }
    }
  }

  function renderLessonScriptGuide() {
    const container = document.getElementById("scriptLinesContainer");
    if (!container || !state.stage3.selectedScript) return;

    container.innerHTML = "";
    state.stage3.selectedScript.lines.forEach((line, idx) => {
      const card = document.createElement("div");
      card.id = "scriptLineCard_" + idx;
      card.className = "script-card future";

      let badgeHtml = "";
      if (line.speaker === "teacher") {
        badgeHtml = '<span class="card-speaker-badge badge-teacher">👩‍🏫 Teacher Cue</span>';
      } else {
        if (line.hasError) {
          badgeHtml = '<span class="card-speaker-badge badge-error-trap">⚠️ Planted Error Trap</span>';
        } else {
          badgeHtml = '<span class="card-speaker-badge badge-student">🧑‍🎓 Student Line</span>';
        }
      }

      let contentHtml = "";
      if (line.speaker === "teacher") {
        contentHtml = `
          <div class="card-instruction">${line.instruction}</div>
          <div class="card-speech-sample"><strong>Say:</strong> "${line.sampleSpeech.replace("[Your Name]", state.stage3.teacherName)}"</div>
          ${line.notes ? `<div class="card-notes">💡 ${line.notes}</div>` : ""}
        `;
      } else {
        contentHtml = `
          <div class="card-instruction"><strong>Student speaks:</strong> "${line.text}"</div>
          ${line.hasError ? `<div class="card-notes" style="color: #fca5a5;">🎯 Planted Mistake: "${line.errorPhrase}" &rarr; "${line.correctPhrase}"</div>` : ""}
        `;
      }

      card.innerHTML = badgeHtml + contentHtml;
      container.appendChild(card);
    });
  }

  function updateScriptLineCardsUI() {
    const lines = state.stage3.selectedScript.lines;
    lines.forEach((_, idx) => {
      const card = document.getElementById("scriptLineCard_" + idx);
      if (!card) return;
      card.classList.remove("completed", "active", "future");
      if (idx < state.stage3.currentLineIndex) {
        card.classList.add("completed");
      } else if (idx === state.stage3.currentLineIndex) {
        card.classList.add("active");
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        card.classList.add("future");
      }
    });

    const indicator = document.getElementById("lessonStepIndicator");
    if (indicator) {
      indicator.textContent = "Step " + (state.stage3.currentLineIndex + 1) + " of " + lines.length;
    }
  }

  function executeScriptLine(index) {
    if (state.stage3.autoAdvanceTimer) {
      clearTimeout(state.stage3.autoAdvanceTimer);
      state.stage3.autoAdvanceTimer = null;
    }

    if (index >= state.stage3.selectedScript.lines.length) {
      finishFullSimulationNormally();
      return;
    }

    state.stage3.currentLineIndex = index;
    updateScriptLineCardsUI();

    const line = state.stage3.selectedScript.lines[index];
    const captionEl = document.getElementById("liveCaptionText");
    const avatarWrap = document.getElementById("studentAvatarWrap");

    if (line.speaker === "student") {
      captionEl.textContent = 'Student: "' + line.text + '"';
      avatarWrap.classList.add("speaking-pulse");

      speakLine(
        line.text,
        () => {
          avatarWrap.classList.add("speaking-pulse");
        },
        () => {
          avatarWrap.classList.remove("speaking-pulse");
          if (line.hasError) {
            triggerPlantedErrorWindow(line);
          } else {
            if (state.stage3.autoAdvance && state.stage3.isRunning) {
              const pauseMs = (line.pauseAfterSec || 2) * 1000;
              state.stage3.autoAdvanceTimer = setTimeout(() => {
                advanceScriptLine();
              }, pauseMs);
            }
          }
        }
      );
    } else {
      avatarWrap.classList.remove("speaking-pulse");
      const cleanPrompt = line.sampleSpeech.replace("[Your Name]", state.stage3.teacherName);
      captionEl.textContent = 'Teacher Prompt: "' + cleanPrompt + '"';

      if (state.stage3.autoAdvance && state.stage3.isRunning) {
        state.stage3.autoAdvanceTimer = setTimeout(() => {
          advanceScriptLine();
        }, 7500);
      }
    }
  }

  window.advanceScriptLine = function () {
    if (!state.stage3.isRunning) return;
    if (state.stage3.autoAdvanceTimer) {
      clearTimeout(state.stage3.autoAdvanceTimer);
      state.stage3.autoAdvanceTimer = null;
    }
    executeScriptLine(state.stage3.currentLineIndex + 1);
  };

  window.previousScriptLine = function () {
    if (!state.stage3.isRunning || state.stage3.currentLineIndex <= 0) return;
    if (state.stage3.autoAdvanceTimer) {
      clearTimeout(state.stage3.autoAdvanceTimer);
      state.stage3.autoAdvanceTimer = null;
    }
    executeScriptLine(state.stage3.currentLineIndex - 1);
  };

  window.replayCurrentLineSpeech = function () {
    const line = state.stage3.selectedScript.lines[state.stage3.currentLineIndex];
    if (line && line.speaker === "student") {
      speakLine(line.text);
    }
  };

  function triggerPlantedErrorWindow(lineObj) {
    const overlay = document.getElementById("errorOverlay");
    const secBadge = document.getElementById("flagSecBadge");
    const miniBar = document.getElementById("flagMiniBar");

    overlay.classList.add("visible");
    playAlertTone();

    const durationMs = (lineObj.reactionWindowSec || 6) * 1000;
    const startTime = performance.now();

    const activeErrorState = {
      lineObj: lineObj,
      startTime: startTime,
      durationMs: durationMs,
      resolved: false,
      timer: null
    };

    state.stage3.activeError = activeErrorState;

    activeErrorState.timer = setInterval(() => {
      const elapsed = performance.now() - activeErrorState.startTime;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const pct = (remainingMs / durationMs) * 100;

      miniBar.style.width = pct + "%";
      secBadge.textContent = (remainingMs / 1000).toFixed(1) + "s";

      if (remainingMs <= 0) {
        clearInterval(activeErrorState.timer);
        activeErrorState.resolved = true;
        overlay.classList.remove("visible");
        recordPlantedErrorResult(lineObj.errorId, false, lineObj.reactionWindowSec || 6);
        state.stage3.activeError = null;

        if (state.stage3.autoAdvance && state.stage3.isRunning) {
          state.stage3.autoAdvanceTimer = setTimeout(() => {
            advanceScriptLine();
          }, 2000);
        }
      }
    }, 50);
  }

  window.handleSimulationErrorCatch = function () {
    if (!state.stage3.activeError || state.stage3.activeError.resolved) return;
    const active = state.stage3.activeError;
    active.resolved = true;
    clearInterval(active.timer);

    document.getElementById("errorOverlay").classList.remove("visible");
    const elapsedSec = Math.max(0.3, (performance.now() - active.startTime) / 1000);
    playSuccessChime();

    recordPlantedErrorResult(active.lineObj.errorId, true, elapsedSec);
    state.stage3.activeError = null;

    if (state.stage3.autoAdvance && state.stage3.isRunning) {
      state.stage3.autoAdvanceTimer = setTimeout(() => {
        advanceScriptLine();
      }, 2000);
    }
  };

  function recordPlantedErrorResult(errorId, caught, reactionTimeSec) {
    const target = state.stage3.plantedErrors.find(e => e.errorId === errorId);
    if (target) {
      target.caught = caught;
      target.reactionTimeSec = reactionTimeSec;
    }
  }

  // Session Termination Handlers
  window.endSessionPrompt = function () {
    if (confirm("Are you sure you want to end this rehearsal session early? Your current score and progress will be logged.")) {
      cleanupStage3Session("manual_end");
      showScorecard("manual_end");
    }
  };

  function forceEndDueToTimeout() {
    cleanupStage3Session("timeout");
    showScorecard("timeout");
  }

  function finishFullSimulationNormally() {
    cleanupStage3Session("finished");
    showScorecard("finished");
  }

  function cleanupStage3Session(completionStatus) {
    state.stage3.isRunning = false;
    state.stage3.completionStatus = completionStatus;
    state.stage3.sessionElapsedSeconds = 300 - state.stage3.secondsRemaining;

    if (!state.stage3.openingCheck.checked) {
      finalizeOpeningNameCheck();
    }

    clearInterval(state.stage3.masterTimer);
    if (state.stage3.autoAdvanceTimer) {
      clearTimeout(state.stage3.autoAdvanceTimer);
      state.stage3.autoAdvanceTimer = null;
    }

    if (state.stage3.activeError) {
      clearInterval(state.stage3.activeError.timer);
      document.getElementById("errorOverlay").classList.remove("visible");
    }

    if (state.stage3.mediaStream) {
      state.stage3.mediaStream.getTracks().forEach(t => t.stop());
      state.stage3.mediaStream = null;
    }

    if (state.stage3.speechRecognition) {
      try {
        state.stage3.speechRecognition.abort();
      } catch (e) {}
      state.stage3.speechRecognition = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // ------------------------------------------------------------------------
  // Scoring & Scorecard Modal
  // ------------------------------------------------------------------------
  function showScorecard(completionStatus) {
    const s3 = state.stage3;
    const nameCheckPassed = s3.openingCheck.passed;
    const errors = s3.plantedErrors;

    const err1 = errors[0] || { errorType: "Error 1", caught: false, reactionTimeSec: 6.0 };
    const err2 = errors[1] || { errorType: "Error 2", caught: false, reactionTimeSec: 6.0 };

    let score = 0;
    if (nameCheckPassed) score += 40;

    if (err1.caught) score += (err1.reactionTimeSec <= 3.5 ? 30 : 25);
    if (err2.caught) score += (err2.reactionTimeSec <= 3.5 ? 30 : 25);

    if (completionStatus === "timeout") {
      score = Math.min(score, 45);
    }

    const isOverallPass = nameCheckPassed && score >= 75 && completionStatus !== "timeout";

    const modal = document.getElementById("resultsModal");
    const badge = document.getElementById("resultScoreBadge");
    const title = document.getElementById("resultTitleText");
    const subtitle = document.getElementById("resultSubtitleText");
    const nameBanner = document.getElementById("resultNameCheckBanner");
    const tipEl = document.getElementById("resultActionableTip");

    if (isOverallPass) {
      badge.className = "score-badge-circle badge-pass-bg";
      badge.textContent = "✓";
      title.textContent = "Demo Interview Ready! (" + score + "%)";
      subtitle.textContent = "You met all platform requirements, caught planted errors, and stayed on pace.";
    } else {
      badge.className = "score-badge-circle badge-fail-bg";
      badge.textContent = "✕";
      title.textContent = "Needs Practice (" + score + "%)";
      subtitle.textContent = "Review the critical platform rules below and give it another rehearsal.";
    }

    if (!nameCheckPassed) {
      nameBanner.className = "critical-rule-banner";
      nameBanner.innerHTML = "<strong>CRITICAL FAILURE:</strong> You did not clearly state both your name and the student's name in the opening ~15 seconds. On Native Camp and Engoo, this is an automatic failing score.";
    } else {
      nameBanner.className = "info-banner";
      nameBanner.innerHTML = "<strong>✓ Opening Check Passed:</strong> Both your name ('" + s3.teacherName + "') and the student's name ('" + s3.studentName + "') were stated promptly.";
    }

    const resNames = document.getElementById("resColNames");
    resNames.innerHTML = nameCheckPassed
      ? '<span class="status-pill pill-pass">Passed</span>'
      : '<span class="status-pill pill-critical-fail">CRITICAL FAIL</span>';

    const resErr1 = document.getElementById("resColError1");
    resErr1.innerHTML = err1.caught
      ? '<span class="status-pill pill-pass">Caught (' + err1.reactionTimeSec.toFixed(1) + 's)</span>'
      : '<span class="status-pill pill-critical-fail">Missed</span>';

    const resErr2 = document.getElementById("resColError2");
    resErr2.innerHTML = err2.caught
      ? '<span class="status-pill pill-pass">Caught (' + err2.reactionTimeSec.toFixed(1) + 's)</span>'
      : '<span class="status-pill pill-critical-fail">Missed</span>';

    const resTime = document.getElementById("resColTime");
    const elapsedM = Math.floor(s3.sessionElapsedSeconds / 60);
    const elapsedS = s3.sessionElapsedSeconds % 60;
    resTime.textContent = elapsedM + "m " + elapsedS + "s / 5:00 (" + completionStatus + ")";

    if (!nameCheckPassed) {
      tipEl.textContent = "Practice Stage 1 (Name Drill) 3 times! Always begin the call with: 'Hello! My name is Teacher [Name]. Welcome to class, [Student]!'";
    } else if (!err1.caught || !err2.caught) {
      tipEl.textContent = "Interviews test whether you're listening actively or just reading the textbook. Always praise the student first, then gently model the correct phrase ('brother goes').";
    } else if (completionStatus === "timeout") {
      tipEl.textContent = "You ran out of time! Keep the warm-up conversation strictly under 1 minute so you have ample time for reading and review.";
    } else {
      tipEl.textContent = "Superb execution! You balanced teacher-talk time, caught both grammar traps swiftly, and finished with time to spare.";
    }

    const sessionRecord = {
      id: "sess_" + Date.now(),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString(),
      scriptTitle: s3.selectedScript.title,
      teacherName: s3.teacherName,
      studentName: s3.studentName,
      nameCheckPass: nameCheckPassed,
      error1Type: err1.errorType || "Error 1",
      error1Caught: err1.caught,
      error1ReactionSec: err1.reactionTimeSec.toFixed(1),
      error2Type: err2.errorType || "Error 2",
      error2Caught: err2.caught,
      error2ReactionSec: err2.reactionTimeSec.toFixed(1),
      timeElapsedSec: s3.sessionElapsedSeconds,
      completionType: completionStatus,
      overallScore: score,
      overallPass: isOverallPass
    };

    s3.latestSessionRecord = sessionRecord;
    saveSessionRecord(sessionRecord);

    modal.classList.add("open");
  }

  window.restartFromScorecard = function () {
    document.getElementById("resultsModal").classList.remove("open");
    initStage3Setup();
  };

  window.closeModalAndShowHistory = function () {
    document.getElementById("resultsModal").classList.remove("open");
    openHistoryModal();
  };

  // ------------------------------------------------------------------------
  // Data Persistence & Session History
  // ------------------------------------------------------------------------
  function loadSavedHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.history = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Error reading localStorage history:", e);
      state.history = [];
    }
    updateHistoryCounterBadge();
  }

  function saveSessionRecord(record) {
    state.history.unshift(record);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
    updateHistoryCounterBadge();
  }

  function updateHistoryCounterBadge() {
    const counter = document.getElementById("historyCounter");
    if (counter) counter.textContent = state.history.length;
  }

  window.openHistoryModal = function () {
    loadSavedHistory();
    renderHistoryTable();
    document.getElementById("historyModal").classList.add("open");
  };

  window.closeHistoryModal = function () {
    document.getElementById("historyModal").classList.remove("open");
  };

  function renderHistoryTable() {
    const container = document.getElementById("historyTableContainer");
    if (!container) return;

    if (state.history.length === 0) {
      container.innerHTML = `
        <div class="empty-history-box">
          <div class="empty-history-icon">📋</div>
          <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">No Rehearsal Records Yet</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 400px; margin: 0 auto;">
            Complete your first simulation session to track your reaction speeds, name checks, and pass rates over time.
          </p>
        </div>
      `;
      return;
    }

    let rowsHtml = state.history.map(item => {
      const passTag = item.overallPass
        ? '<span class="status-pill pill-pass">PASS</span>'
        : '<span class="status-pill pill-critical-fail">FAIL</span>';

      const nameTag = item.nameCheckPass
        ? '<span class="status-pill pill-pass">✓ Yes</span>'
        : '<span class="status-pill pill-critical-fail">✕ Missed</span>';

      const e1Tag = item.error1Caught ? "Caught (" + item.error1ReactionSec + "s)" : "Missed";
      const e2Tag = item.error2Caught ? "Caught (" + item.error2ReactionSec + "s)" : "Missed";

      const mins = Math.floor(item.timeElapsedSec / 60);
      const secs = item.timeElapsedSec % 60;
      const timeStr = mins + "m " + secs + "s";

      return `
        <tr>
          <td><small class="text-muted">${item.formattedDate}</small></td>
          <td><strong>${item.scriptTitle}</strong></td>
          <td>${nameTag}</td>
          <td>${e1Tag}</td>
          <td>${e2Tag}</td>
          <td>${timeStr}</td>
          <td><strong>${item.overallScore}%</strong></td>
          <td>${passTag}</td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <table class="score-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Curriculum</th>
            <th>Name Check</th>
            <th>Planted Error 1</th>
            <th>Planted Error 2</th>
            <th>Duration</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  window.clearAllHistory = function () {
    if (confirm("Are you sure you want to clear all rehearsal session records from your browser?")) {
      state.history = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      updateHistoryCounterBadge();
      renderHistoryTable();
    }
  };

  // ------------------------------------------------------------------------
  // CSV Export Functionality
  // ------------------------------------------------------------------------
  window.exportHistoryToCSV = function () {
    if (state.history.length === 0) {
      alert("No rehearsal records available to export yet. Complete a session first!");
      return;
    }

    const headers = [
      "Session ID",
      "Timestamp",
      "Lesson Script",
      "Teacher Name",
      "Student Name",
      "Opening Names Checked",
      "Error 1 Type",
      "Error 1 Caught",
      "Error 1 Reaction Time (s)",
      "Error 2 Type",
      "Error 2 Caught",
      "Error 2 Reaction Time (s)",
      "Time Elapsed (s)",
      "Completion Type",
      "Overall Score (%)",
      "Result"
    ];

    const rows = state.history.map(item => [
      item.id,
      item.timestamp,
      `"${(item.scriptTitle || '').replace(/"/g, '""')}"`,
      `"${(item.teacherName || '').replace(/"/g, '""')}"`,
      `"${(item.studentName || '').replace(/"/g, '""')}"`,
      item.nameCheckPass ? "PASS" : "CRITICAL_FAIL",
      `"${(item.error1Type || '').replace(/"/g, '""')}"`,
      item.error1Caught ? "CAUGHT" : "MISSED",
      item.error1ReactionSec,
      `"${(item.error2Type || '').replace(/"/g, '""')}"`,
      item.error2Caught ? "CAUGHT" : "MISSED",
      item.error2ReactionSec,
      item.timeElapsedSec,
      item.completionType,
      item.overallScore,
      item.overallPass ? "PASS" : "FAIL"
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    downloadBlob(csvContent, "demoready-rehearsal-history.csv", "text/csv;charset=utf-8;");
  };

  window.exportLatestSessionCSV = function () {
    const rec = state.stage3.latestSessionRecord;
    if (!rec) {
      exportHistoryToCSV();
      return;
    }

    const headers = [
      "Session ID", "Timestamp", "Lesson Script", "Teacher Name", "Student Name",
      "Opening Names Checked", "Error 1 Type", "Error 1 Caught", "Error 1 Reaction Time (s)",
      "Error 2 Type", "Error 2 Caught", "Error 2 Reaction Time (s)", "Time Elapsed (s)",
      "Completion Type", "Overall Score (%)", "Result"
    ];

    const row = [
      rec.id,
      rec.timestamp,
      `"${(rec.scriptTitle || '').replace(/"/g, '""')}"`,
      `"${(rec.teacherName || '').replace(/"/g, '""')}"`,
      `"${(rec.studentName || '').replace(/"/g, '""')}"`,
      rec.nameCheckPass ? "PASS" : "CRITICAL_FAIL",
      `"${(rec.error1Type || '').replace(/"/g, '""')}"`,
      rec.error1Caught ? "CAUGHT" : "MISSED",
      rec.error1ReactionSec,
      `"${(rec.error2Type || '').replace(/"/g, '""')}"`,
      rec.error2Caught ? "CAUGHT" : "MISSED",
      rec.error2ReactionSec,
      rec.timeElapsedSec,
      rec.completionType,
      rec.overallScore,
      rec.overallPass ? "PASS" : "FAIL"
    ];

    const csvContent = [headers.join(","), row.join(",")].join("\r\n");
    downloadBlob(csvContent, "demoready-session-" + rec.id + ".csv", "text/csv;charset=utf-8;");
  };

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ------------------------------------------------------------------------
  // Headless & Programmatic Testing Interface
  // ------------------------------------------------------------------------
  window.__DEMO_READY_TEST__ = {
    getState: () => state,
    switchStage: (n) => window.switchStage(n),
    startStage1: () => window.startStage1Drill(),
    typeStage1Greeting: (txt) => {
      document.getElementById("s1GreetingInput").value = txt;
      window.checkStage1InputGreeting();
    },
    startStage2: () => window.playStage2Line(),
    flagStage2: () => window.flagStage2Error(),
    startStage3: (tName, sName, scriptId) => {
      document.getElementById("simTeacherName").value = tName || "Sarah";
      document.getElementById("simStudentName").value = sName || "Kenji";
      document.getElementById("skipMediaToggle").checked = true;
      if (scriptId) state.stage3.selectedScriptId = scriptId;
      window.startFullSimulation();
    },
    flagSimulationError: () => window.handleSimulationErrorCatch(),
    advanceLine: () => window.advanceScriptLine(),
    sendTypedText: (txt) => {
      document.getElementById("typeCorrectionInput").value = txt;
      window.sendTypedCorrection();
    },
    endSessionNow: () => {
      cleanupStage3Session("finished");
      showScorecard("finished");
    }
  };

  // ------------------------------------------------------------------------
  // App Bootstrapping
  // ------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    loadSavedHistory();
    renderScriptPicker();
    validateStage1Inputs();
    validateSetupInputs();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  });

})();
