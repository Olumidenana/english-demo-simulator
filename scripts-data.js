// English Demo Lesson Scripts Data for Rehearsal Simulator
// Modeled after authentic demo interview curricula (e.g., Native Camp, Engoo)

const LESSON_SCRIPTS = [
  {
    id: "script_daily_routines",
    title: "Lesson 1: Daily Routines & Hobbies",
    level: "Beginner (A2)",
    targetStudent: "Kenji (Japan)",
    defaultStudentName: "Kenji",
    description: "Focuses on everyday habits, simple present tense, and weekend activities. Contains subject-verb agreement and preposition traps.",
    plantedErrorsCount: 2,
    lines: [
      {
        id: 1,
        speaker: "teacher",
        type: "greeting",
        instruction: "Step 1: Introduction. Greet the student warmly, state your name, and ask for their name.",
        sampleSpeech: "Hello! Welcome to our lesson today. My name is [Your Name]. May I have your name, please?",
        notes: "CRITICAL: You must say your own name and the student's name within the first 15 seconds."
      },
      {
        id: 2,
        speaker: "student",
        type: "response",
        text: "Hello teacher! Nice to meet you. My name is Kenji. I am happy to take your class.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 3,
        speaker: "teacher",
        type: "warmup",
        instruction: "Step 2: Warm-up. Ask Kenji how his day was or what time he usually wakes up.",
        sampleSpeech: "Nice to meet you, Kenji! How are you today? What time did you wake up this morning?",
        notes: "Keep warm-up under 45 seconds to stay on schedule."
      },
      {
        id: 4,
        speaker: "student",
        type: "response",
        text: "I am fine! I woke up at 7 AM today. The weather is very nice outside.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 5,
        speaker: "teacher",
        type: "reading_cue",
        instruction: "Step 3: Reading Practice. Ask Kenji to read sentence 1 aloud from the textbook.",
        sampleSpeech: "Great! Let's move to our textbook. Kenji, please read Sentence 1 aloud for me.",
        notes: "Listen carefully for pronunciation and grammar slips."
      },
      {
        id: 6,
        speaker: "student",
        type: "exercise",
        text: "Every morning, my brother go to work by train at eight o'clock.",
        hasError: true,
        errorId: "err_1",
        errorPhrase: "brother go",
        correctPhrase: "brother goes",
        errorType: "Subject-Verb Agreement",
        explanation: "'Brother' is 3rd-person singular (he). The verb must take '-s' or '-es' -> 'brother goes'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 7,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Praise the student, gently model the correct phrase ('brother goes'), and ask them to repeat the full sentence.",
        sampleSpeech: "Good effort! Please repeat after me: 'My brother goes to work'.",
        notes: "Ensure the student repeats the corrected sentence before moving on."
      },
      {
        id: 8,
        speaker: "student",
        type: "repeat",
        text: "Ah, my brother goes to work by train. Thank you, teacher!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 9,
        speaker: "teacher",
        type: "dialogue_cue",
        instruction: "Step 4: Dialogue. Ask Kenji: 'What do you like to do on weekends when you are free?'",
        sampleSpeech: "Excellent! Now let's talk about your hobbies. Kenji, what do you usually do on weekends?",
        notes: "Keep your ears sharp for the second planted error."
      },
      {
        id: 10,
        speaker: "student",
        type: "exercise",
        text: "On weekends, I usually listen music with my headphones and read books.",
        hasError: true,
        errorId: "err_2",
        errorPhrase: "listen music",
        correctPhrase: "listen to music",
        errorType: "Missing Preposition",
        explanation: "The verb 'listen' requires the preposition 'to' before an object -> 'listen to music'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 11,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Catch and clarify: remind Kenji that we say 'listen TO music'. Have him repeat it.",
        sampleSpeech: "Almost perfect! Remember, we say 'listen TO music'. Can you say that sentence again?",
        notes: "Real interviewers give high marks for immediate, friendly corrections."
      },
      {
        id: 12,
        speaker: "student",
        type: "repeat",
        text: "I understand! I usually listen to music with my headphones. Thank you!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 13,
        speaker: "teacher",
        type: "wrapup",
        instruction: "Step 5: Lesson Wrap-up. Give positive feedback, summarize the two key points (goes, listen to), and say goodbye.",
        sampleSpeech: "You did a fantastic job today, Kenji! Keep practicing 'he goes' and 'listen to'. Have a great day!",
        notes: "Make sure to finish before the 5:00 mark."
      },
      {
        id: 14,
        speaker: "student",
        type: "goodbye",
        text: "Thank you very much for the lesson, teacher! You are very kind. See you next time!",
        hasError: false,
        pauseAfterSec: 1
      }
    ]
  },
  {
    id: "script_travel_vacations",
    title: "Lesson 2: Travel & Vacations",
    level: "Intermediate (B1)",
    targetStudent: "Maria (Brazil)",
    defaultStudentName: "Maria",
    description: "Discusses past trips and memorable holiday experiences. Focuses on past tense irregular verbs and countable noun plurals.",
    plantedErrorsCount: 2,
    lines: [
      {
        id: 1,
        speaker: "teacher",
        type: "greeting",
        instruction: "Step 1: Introduction. Introduce yourself by name and welcome Maria to the class.",
        sampleSpeech: "Good day! Welcome to our English class. My name is [Your Name]. Is your name Maria?",
        notes: "Remember: State both names clearly right at the start."
      },
      {
        id: 2,
        speaker: "student",
        type: "response",
        text: "Hi teacher! Yes, my name is Maria. It is a pleasure to meet you today.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 3,
        speaker: "teacher",
        type: "warmup",
        instruction: "Step 2: Warm-up. Ask Maria if she enjoys traveling and what country she wants to visit.",
        sampleSpeech: "It's wonderful to meet you Maria! Do you like traveling? Have you been on a trip recently?",
        notes: "Engage with warmth and energy."
      },
      {
        id: 4,
        speaker: "student",
        type: "response",
        text: "Yes, I love traveling! I really like exploring new cities and trying local foods.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 5,
        speaker: "teacher",
        type: "reading_cue",
        instruction: "Step 3: Reading. Ask Maria to read Sentence 1 about her last vacation.",
        sampleSpeech: "Awesome! Let's look at section 1 of the lesson sheet. Maria, please read Sentence A.",
        notes: "Listen for the irregular past tense error."
      },
      {
        id: 6,
        speaker: "student",
        type: "exercise",
        text: "Last summer, I go to Rome with my family and we stayed there for one week.",
        hasError: true,
        errorId: "err_1",
        errorPhrase: "I go to Rome",
        correctPhrase: "I went to Rome",
        errorType: "Irregular Past Tense",
        explanation: "The past tense of 'go' is 'went'. With 'Last summer', the sentence requires past simple.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 7,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Flag the tense shift: 'Last summer' means we need past tense 'went'. Ask her to repeat.",
        sampleSpeech: "Well read! Just watch the past tense: 'Last summer, I WENT to Rome'. Could you try that sentence?",
        notes: "Clear and positive correction."
      },
      {
        id: 8,
        speaker: "student",
        type: "repeat",
        text: "Oh right! Last summer, I went to Rome with my family. Thank you!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 9,
        speaker: "teacher",
        type: "dialogue_cue",
        instruction: "Step 4: Dialogue. Ask Maria what she bought or did while she was in Rome.",
        sampleSpeech: "Much better! And Maria, what kind of things did you buy while you were traveling?",
        notes: "Listen for the noun plural error."
      },
      {
        id: 10,
        speaker: "student",
        type: "exercise",
        text: "I bought many souvenir for my friends at the market.",
        hasError: true,
        errorId: "err_2",
        errorPhrase: "many souvenir",
        correctPhrase: "many souvenirs",
        errorType: "Plural Countable Noun",
        explanation: "'Many' modifies plural countable nouns, so 'souvenir' must be plural -> 'many souvenirs'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 11,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Gently highlight 'many souvenirs' with the plural 's'.",
        sampleSpeech: "Great job! Since you bought more than one, remember to say 'many souvenirS'. Let's repeat together!",
        notes: "Check pronunciation of the final 's' sound."
      },
      {
        id: 12,
        speaker: "student",
        type: "repeat",
        text: "I bought many souvenirs for my friends. Got it!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 13,
        speaker: "teacher",
        type: "wrapup",
        instruction: "Step 5: Review & Farewell. Praise Maria's pronunciation and wrap up the lesson smoothly.",
        sampleSpeech: "Terrific work today, Maria! You caught 'went' and 'souvenirs' quickly. Keep up the great work!",
        notes: "Finish before 5:00."
      },
      {
        id: 14,
        speaker: "student",
        type: "goodbye",
        text: "Thank you so much teacher! That was very helpful. Have a wonderful day!",
        hasError: false,
        pauseAfterSec: 1
      }
    ]
  },
  {
    id: "script_ordering_cafe",
    title: "Lesson 3: Ordering at a Cafe",
    level: "Beginner (A2)",
    targetStudent: "Yuki (Japan)",
    defaultStudentName: "Yuki",
    description: "Roleplay simulation at a coffee shop. Tests student handling of countable vs uncountable food nouns and comparative adjectives.",
    plantedErrorsCount: 2,
    lines: [
      {
        id: 1,
        speaker: "teacher",
        type: "greeting",
        instruction: "Step 1: Introduction. State your name clearly and greet Yuki.",
        sampleSpeech: "Good morning! Welcome to the lesson. My name is [Your Name]. Is your name Yuki?",
        notes: "Say both names within 15 seconds."
      },
      {
        id: 2,
        speaker: "student",
        type: "response",
        text: "Good morning teacher! Yes, my name is Yuki. Nice to meet you today.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 3,
        speaker: "teacher",
        type: "warmup",
        instruction: "Step 2: Warm-up. Ask Yuki if she drinks coffee or tea in the morning.",
        sampleSpeech: "Nice to meet you, Yuki! Do you usually drink coffee or tea in the morning?",
        notes: "Keep warm-up brief."
      },
      {
        id: 4,
        speaker: "student",
        type: "response",
        text: "I always drink hot green tea every morning. It helps me wake up.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 5,
        speaker: "teacher",
        type: "reading_cue",
        instruction: "Step 3: Cafe Roleplay. You play the barista; Yuki plays the customer placing an order.",
        sampleSpeech: "Welcome to Sunrise Cafe! What can I get started for you today, Yuki?",
        notes: "Listen for the uncountable noun mistake."
      },
      {
        id: 6,
        speaker: "student",
        type: "exercise",
        text: "Can I please have two coffees and three breads for breakfast?",
        hasError: true,
        errorId: "err_1",
        errorPhrase: "three breads",
        correctPhrase: "three pieces of bread / three rolls",
        errorType: "Uncountable Noun",
        explanation: "'Bread' is uncountable in English. Say 'three pieces/slices of bread' or 'three rolls/pastries', not 'three breads'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 7,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Barista correction: explain that 'bread' is uncountable. Suggest 'three slices of bread' or 'three rolls'.",
        sampleSpeech: "Certainly! By the way, in English bread is uncountable, so we say 'three pieces of bread'. Let's practice that!",
        notes: "Be supportive and encouraging."
      },
      {
        id: 8,
        speaker: "student",
        type: "repeat",
        text: "Oh, I see! Can I have two coffees and three pieces of bread, please?",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 9,
        speaker: "teacher",
        type: "dialogue_cue",
        instruction: "Step 4: Continue Roleplay. Ask Yuki if she would like iced tea or hot tea with her breakfast.",
        sampleSpeech: "Sure thing! Would you prefer iced tea or hot tea to drink?",
        notes: "Listen for the double comparative trap."
      },
      {
        id: 10,
        speaker: "student",
        type: "exercise",
        text: "I will take iced tea because it is more better than hot tea today.",
        hasError: true,
        errorId: "err_2",
        errorPhrase: "more better",
        correctPhrase: "much better / better",
        errorType: "Double Comparative",
        explanation: "'Better' is already the comparative form of 'good'. Never say 'more better' - say 'better' or 'much better'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 11,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Correct 'more better': explain we just say 'much better' or 'better'.",
        sampleSpeech: "Good choice! Remember, we just say 'it is better' or 'much better', without 'more'. Can you say that again?",
        notes: "Confirm understanding."
      },
      {
        id: 12,
        speaker: "student",
        type: "repeat",
        text: "Iced tea is much better than hot tea today. Thank you teacher!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 13,
        speaker: "teacher",
        type: "wrapup",
        instruction: "Step 5: Wrap up. Confirm the order, congratulate Yuki on great ordering skills.",
        sampleSpeech: "Your order is ready, Yuki! You did wonderful work practicing cafe vocabulary today.",
        notes: "Final positive reinforcement."
      },
      {
        id: 14,
        speaker: "student",
        type: "goodbye",
        text: "Thank you for the fun lesson, teacher! Have a wonderful day!",
        hasError: false,
        pauseAfterSec: 1
      }
    ]
  },
  {
    id: "script_job_interview",
    title: "Lesson 4: Work & Career Experiences",
    level: "Intermediate (B1+)",
    targetStudent: "Alex (Germany)",
    defaultStudentName: "Alex",
    description: "Professional workplace English and interview prep. Tests present perfect tense duration and modal verbs followed by base verbs.",
    plantedErrorsCount: 2,
    lines: [
      {
        id: 1,
        speaker: "teacher",
        type: "greeting",
        instruction: "Step 1: Introduction. State your name and greet Alex professionally.",
        sampleSpeech: "Hello and welcome to today's business English session! My name is [Your Name]. Is your name Alex?",
        notes: "Opening name check: State both names within 15 seconds."
      },
      {
        id: 2,
        speaker: "student",
        type: "response",
        text: "Hello! Yes, my name is Alex. Thank you for having me in this lesson.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 3,
        speaker: "teacher",
        type: "warmup",
        instruction: "Step 2: Warm-up. Ask Alex what field or industry he currently works in.",
        sampleSpeech: "Pleasure to meet you, Alex! What kind of work do you do at your company?",
        notes: "Keep pacing active."
      },
      {
        id: 4,
        speaker: "student",
        type: "response",
        text: "I work in software design and project coordination. We build mobile applications.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 5,
        speaker: "teacher",
        type: "reading_cue",
        instruction: "Step 3: Resume Review. Ask Alex to describe how long he has been in his current position.",
        sampleSpeech: "That sounds interesting! Alex, could you tell me how long you have been with your current employer?",
        notes: "Listen for the tense and preposition error ('work here since')."
      },
      {
        id: 6,
        speaker: "student",
        type: "exercise",
        text: "I work at this company since three years and I really enjoy the team.",
        hasError: true,
        errorId: "err_1",
        errorPhrase: "work at this company since three years",
        correctPhrase: "have worked here for three years",
        errorType: "Present Perfect + For/Since",
        explanation: "Action starting in the past and continuing to present requires Present Perfect ('have worked'). Use 'for' with duration ('for three years'), not 'since'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 7,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Point out: Use 'have worked' + 'for three years' for ongoing duration. Ask him to restate.",
        sampleSpeech: "Good explanation! For an ongoing period, we say: 'I HAVE WORKED here FOR three years'. Let's try that together.",
        notes: "Make sure Alex pronounces 'have worked'."
      },
      {
        id: 8,
        speaker: "student",
        type: "repeat",
        text: "Understood! I have worked at this company for three years. That makes sense.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 9,
        speaker: "teacher",
        type: "dialogue_cue",
        instruction: "Step 4: Team Skills. Ask Alex about his team members and their communication skills.",
        sampleSpeech: "Great job! And how does your team handle international clients?",
        notes: "Listen for the modal verb error ('can speaks')."
      },
      {
        id: 10,
        speaker: "student",
        type: "exercise",
        text: "My team leader can speaks three foreign languages including Spanish and English.",
        hasError: true,
        errorId: "err_2",
        errorPhrase: "can speaks",
        correctPhrase: "can speak",
        errorType: "Modal Verb + Base Form",
        explanation: "Modal verbs ('can', 'could', 'should', 'must') must be followed by the base form of the verb without '-s' -> 'can speak'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 11,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Correct modal verb agreement: 'can' is followed by the bare infinitive 'speak'.",
        sampleSpeech: "Very impressive! Just remember: after the modal 'can', use the base verb: 'can SPEAK'. Let's repeat that phrase.",
        notes: "Encourage and reinforce base verb rule."
      },
      {
        id: 12,
        speaker: "student",
        type: "repeat",
        text: "Ah, my team leader can speak three languages. Thank you teacher!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 13,
        speaker: "teacher",
        type: "wrapup",
        instruction: "Step 5: Lesson Closing. Praise Alex's vocabulary and professional delivery.",
        sampleSpeech: "You did remarkably well, Alex! Both corrections were clear. Best of luck with your projects!",
        notes: "Finish smoothly before 5:00."
      },
      {
        id: 14,
        speaker: "student",
        type: "goodbye",
        text: "Thank you for the excellent feedback, teacher. See you in the next class!",
        hasError: false,
        pauseAfterSec: 1
      }
    ]
  },
  {
    id: "script_shopping_weekend",
    title: "Lesson 5: Weekend Shopping & Fashion",
    level: "Intermediate (B1)",
    targetStudent: "Elena (Spain)",
    defaultStudentName: "Elena",
    description: "Discusses shopping at local markets, buying clothing, and gift selection. Tests plural verb agreement ('does these shoes cost') and pair noun structures ('two jeans').",
    plantedErrorsCount: 2,
    lines: [
      {
        id: 1,
        speaker: "teacher",
        type: "greeting",
        instruction: "Step 1: Introduction. Greet Elena with high energy and state both names right away.",
        sampleSpeech: "Good day! Welcome to our English class. My name is [Your Name]. Is your name Elena?",
        notes: "Opening name check: Say both your name and Elena within 15 seconds."
      },
      {
        id: 2,
        speaker: "student",
        type: "response",
        text: "Hello teacher! Yes, my name is Elena. Nice to meet you today!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 3,
        speaker: "teacher",
        type: "warmup",
        instruction: "Step 2: Warm-up. Ask Elena if she enjoys going shopping on the weekend.",
        sampleSpeech: "Nice to meet you, Elena! Do you like going shopping when you have free time on the weekend?",
        notes: "Build rapport quickly."
      },
      {
        id: 4,
        speaker: "student",
        type: "response",
        text: "Yes, I really love going shopping with my friends downtown, especially for new clothes.",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 5,
        speaker: "teacher",
        type: "reading_cue",
        instruction: "Step 3: Dialogue Practice. Ask Elena to roleplay asking a store clerk about the price of running shoes.",
        sampleSpeech: "Great! Let's practice a dialogue in a shoe shop. Elena, please ask me how much the sneakers cost.",
        notes: "Listen for auxiliary verb agreement ('does these shoes cost')."
      },
      {
        id: 6,
        speaker: "student",
        type: "exercise",
        text: "Excuse me, how much does these shoes cost in the window display?",
        hasError: true,
        errorId: "err_1",
        errorPhrase: "does these shoes cost",
        correctPhrase: "do these shoes cost",
        errorType: "Plural Demonstrative & Auxiliary Agreement",
        explanation: "'These shoes' is plural, so the question requires the auxiliary verb 'do', not 'does' -> 'How much DO these shoes cost?'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 7,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Correct gently: 'these shoes' is plural, so use 'do'. Ask Elena to repeat the question.",
        sampleSpeech: "Almost! Because 'shoes' is plural, we ask: 'How much DO these shoes cost?'. Could you repeat that for me?",
        notes: "Emphasize 'DO' vs 'DOES'."
      },
      {
        id: 8,
        speaker: "student",
        type: "repeat",
        text: "Oh! How much DO these shoes cost? Thank you for correcting me, teacher!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 9,
        speaker: "teacher",
        type: "dialogue_cue",
        instruction: "Step 4: Clothing Items. Ask Elena what items she bought during her recent shopping trip.",
        sampleSpeech: "Well done! And Elena, what did you buy the last time you visited the clothing mall?",
        notes: "Listen for the pair noun error ('two jeans')."
      },
      {
        id: 10,
        speaker: "student",
        type: "exercise",
        text: "I visited the department store and I bought two jeans and a warm jacket.",
        hasError: true,
        errorId: "err_2",
        errorPhrase: "two jeans",
        correctPhrase: "two pairs of jeans",
        errorType: "Pair Noun (Countability)",
        explanation: "'Jeans', 'pants', 'trousers', and 'glasses' are pair nouns. We count them using 'pairs of' -> 'two pairs of jeans', not 'two jeans'.",
        reactionWindowSec: 6,
        pauseAfterSec: 4
      },
      {
        id: 11,
        speaker: "teacher",
        type: "correction_prompt",
        instruction: "Explain pair nouns: say 'two pairs of jeans'. Have Elena practice repeating.",
        sampleSpeech: "Nice choices! Remember, for jeans we say: 'two PAIRS OF jeans'. Please try saying that sentence again.",
        notes: "Reinforce 'pairs of'."
      },
      {
        id: 12,
        speaker: "student",
        type: "repeat",
        text: "I bought two pairs of jeans and a warm jacket. Thank you teacher, I will remember that!",
        hasError: false,
        pauseAfterSec: 2
      },
      {
        id: 13,
        speaker: "teacher",
        type: "wrapup",
        instruction: "Step 5: Lesson Wrap-up. Commend Elena on both grammar catches and close the lesson.",
        sampleSpeech: "Fantastic job today, Elena! Your shopping vocabulary is great and you caught the grammar nuances nicely!",
        notes: "Wrap up before 5:00 timer."
      },
      {
        id: 14,
        speaker: "student",
        type: "goodbye",
        text: "Thank you so much, teacher! This lesson was very helpful. Have a wonderful weekend!",
        hasError: false,
        pauseAfterSec: 1
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.LESSON_SCRIPTS = LESSON_SCRIPTS;
}
