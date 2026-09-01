/* ==========================================================================
   NexaSoul Aura Lab — JavaScript Engine
   Full Personality Scanner, Live Aura Visualizer & Canvas Card Generator
   Created for NexaSoul Web Development Foundation Bootcamp
   ========================================================================== */

(function () {
    "use strict";

    /* ==========================================================================
       1. QUESTION DATA (10 Organiser Bootcamp Questions with Trait Weighting)
       ========================================================================== */
    const questions = [
        {
            scenario: "SCENARIO 01",
            question: "Q1. Your friend says 'Bro, let's go out.' You:",
            options: [
                { 
                    text: "Already ready 🚀", 
                    score: 10,
                    traits: { confidence: 10, creativity: 7, social: 10, calmness: 6, mainChar: 10 }
                },
                { 
                    text: "'Where?' 👀", 
                    score: 7,
                    traits: { confidence: 7, creativity: 8, social: 7, calmness: 8, mainChar: 6 }
                },
                { 
                    text: "'I'm broke bro 💀'", 
                    score: 5,
                    traits: { confidence: 5, creativity: 6, social: 5, calmness: 7, mainChar: 4 }
                },
                { 
                    text: "Leaves the message on seen 🤐", 
                    score: 2,
                    traits: { confidence: 4, creativity: 5, social: 2, calmness: 9, mainChar: 5 }
                }
            ]
        },
        {
            scenario: "SCENARIO 02",
            question: "Q2. Your assignment is due tomorrow at 11:59 PM. You:",
            options: [
                { 
                    text: "Finished it last week 🤓", 
                    score: 10,
                    traits: { confidence: 10, creativity: 8, social: 6, calmness: 10, mainChar: 8 }
                },
                { 
                    text: "Start today after lunch 💻", 
                    score: 7,
                    traits: { confidence: 8, creativity: 7, social: 7, calmness: 8, mainChar: 7 }
                },
                { 
                    text: "Start at 11:45 PM with adrenaline ⚡", 
                    score: 5,
                    traits: { confidence: 7, creativity: 9, social: 6, calmness: 3, mainChar: 9 }
                },
                { 
                    text: "'Bro, can you send yours?' 💀", 
                    score: 2,
                    traits: { confidence: 4, creativity: 4, social: 5, calmness: 5, mainChar: 3 }
                }
            ]
        },
        {
            scenario: "SCENARIO 03",
            question: "Q3. Someone replies to your message with just 'K.' Your reaction:",
            options: [
                { 
                    text: "Normal, it's just a letter 👍", 
                    score: 10,
                    traits: { confidence: 10, creativity: 6, social: 8, calmness: 10, mainChar: 8 }
                },
                { 
                    text: "'Are they angry?' 👀", 
                    score: 7,
                    traits: { confidence: 6, creativity: 7, social: 7, calmness: 6, mainChar: 5 }
                },
                { 
                    text: "Overthink everything for 3 hours 😭", 
                    score: 5,
                    traits: { confidence: 4, creativity: 8, social: 4, calmness: 3, mainChar: 6 }
                },
                { 
                    text: "Start a full FBI investigation 🕵️", 
                    score: 2,
                    traits: { confidence: 5, creativity: 10, social: 5, calmness: 2, mainChar: 8 }
                }
            ]
        },
        {
            scenario: "SCENARIO 04",
            question: "Q4. An 8:00 AM class/lecture is scheduled. You:",
            options: [
                { 
                    text: "Sit in the front row fully awake ☕", 
                    score: 10,
                    traits: { confidence: 10, creativity: 7, social: 9, calmness: 9, mainChar: 9 }
                },
                { 
                    text: "Reach 10 minutes late with iced coffee 🥤", 
                    score: 7,
                    traits: { confidence: 9, creativity: 8, social: 8, calmness: 7, mainChar: 10 }
                },
                { 
                    text: "Sleep in class with eyes open 😴", 
                    score: 5,
                    traits: { confidence: 5, creativity: 8, social: 5, calmness: 8, mainChar: 5 }
                },
                { 
                    text: "Turn off the alarm and continue dreaming 🛌", 
                    score: 2,
                    traits: { confidence: 4, creativity: 5, social: 3, calmness: 9, mainChar: 4 }
                }
            ]
        },
        {
            scenario: "SCENARIO 05",
            question: "Q5. You walk past a group laughing on campus. You think:",
            options: [
                { 
                    text: "They must have heard a funny joke 😂", 
                    score: 10,
                    traits: { confidence: 10, creativity: 7, social: 9, calmness: 10, mainChar: 8 }
                },
                { 
                    text: "Probably laughing at a meme 📲", 
                    score: 7,
                    traits: { confidence: 8, creativity: 8, social: 8, calmness: 8, mainChar: 7 }
                },
                { 
                    text: "'Are they laughing at my outfit?' 😳", 
                    score: 5,
                    traits: { confidence: 4, creativity: 6, social: 4, calmness: 4, mainChar: 5 }
                },
                { 
                    text: "Adjust your walk style immediately 🚶‍♂️", 
                    score: 2,
                    traits: { confidence: 3, creativity: 5, social: 3, calmness: 3, mainChar: 4 }
                }
            ]
        },
        {
            scenario: "SCENARIO 06",
            question: "Q6. Your phone battery drops to 5%. You:",
            options: [
                { 
                    text: "Quietly pull out your power bank 🔋", 
                    score: 10,
                    traits: { confidence: 10, creativity: 7, social: 7, calmness: 10, mainChar: 8 }
                },
                { 
                    text: "Go hunt for a charger around campus 🔌", 
                    score: 7,
                    traits: { confidence: 8, creativity: 8, social: 8, calmness: 6, mainChar: 7 }
                },
                { 
                    text: "Enter extreme battery saver mode & panic ⚠️", 
                    score: 5,
                    traits: { confidence: 5, creativity: 7, social: 5, calmness: 3, mainChar: 6 }
                },
                { 
                    text: "Let it die, peace at last ✌️", 
                    score: 2,
                    traits: { confidence: 7, creativity: 6, social: 4, calmness: 10, mainChar: 8 }
                }
            ]
        },
        {
            scenario: "SCENARIO 07",
            question: "Q7. Someone asks you to explain a study/code concept. You:",
            options: [
                { 
                    text: "Explain it clearly like a professor 👨‍🏫", 
                    score: 10,
                    traits: { confidence: 10, creativity: 9, social: 10, calmness: 9, mainChar: 9 }
                },
                { 
                    text: "'Bro it's easy, look at this example' 💡", 
                    score: 7,
                    traits: { confidence: 9, creativity: 8, social: 9, calmness: 8, mainChar: 8 }
                },
                { 
                    text: "'Honestly, I guessed and it worked' 😅", 
                    score: 5,
                    traits: { confidence: 6, creativity: 7, social: 7, calmness: 7, mainChar: 6 }
                },
                { 
                    text: "'Wait, we had a concept for that?' 😵", 
                    score: 2,
                    traits: { confidence: 3, creativity: 4, social: 4, calmness: 5, mainChar: 3 }
                }
            ]
        },
        {
            scenario: "SCENARIO 08",
            question: "Q8. How do you handle group project work?",
            options: [
                { 
                    text: "Carry the whole team single-handedly 🎒", 
                    score: 10,
                    traits: { confidence: 10, creativity: 9, social: 8, calmness: 8, mainChar: 10 }
                },
                { 
                    text: "Do your assigned part perfectly 🤝", 
                    score: 7,
                    traits: { confidence: 8, creativity: 8, social: 8, calmness: 9, mainChar: 7 }
                },
                { 
                    text: "Moral support and emotional backing 📢", 
                    score: 5,
                    traits: { confidence: 6, creativity: 7, social: 9, calmness: 7, mainChar: 6 }
                },
                { 
                    text: "Send thumbs up emojis in the group chat 👍", 
                    score: 2,
                    traits: { confidence: 4, creativity: 5, social: 5, calmness: 8, mainChar: 4 }
                }
            ]
        },
        {
            scenario: "SCENARIO 09",
            question: "Q9. You see a photo of yourself taken by a friend. You say:",
            options: [
                { 
                    text: "'Damn, I look great!' 😎", 
                    score: 10,
                    traits: { confidence: 10, creativity: 8, social: 9, calmness: 9, mainChar: 10 }
                },
                { 
                    text: "'Post it, it's good' 📸", 
                    score: 7,
                    traits: { confidence: 8, creativity: 7, social: 8, calmness: 8, mainChar: 8 }
                },
                { 
                    text: "'Delete that right now 🔫'", 
                    score: 5,
                    traits: { confidence: 5, creativity: 7, social: 5, calmness: 4, mainChar: 6 }
                },
                { 
                    text: "'Who is that creature?' 👹", 
                    score: 2,
                    traits: { confidence: 3, creativity: 6, social: 4, calmness: 4, mainChar: 3 }
                }
            ]
        },
        {
            scenario: "SCENARIO 10",
            question: "Q10. The teacher says 'I'm picking a random student to answer.' You:",
            options: [
                { 
                    text: "Make eye contact to show dominance 🗿", 
                    score: 10,
                    traits: { confidence: 10, creativity: 9, social: 9, calmness: 10, mainChar: 10 }
                },
                { 
                    text: "Smile and stay calm 😁", 
                    score: 7,
                    traits: { confidence: 8, creativity: 7, social: 8, calmness: 9, mainChar: 7 }
                },
                { 
                    text: "Suddenly look very deeply into your notebook 📖", 
                    score: 5,
                    traits: { confidence: 4, creativity: 6, social: 5, calmness: 5, mainChar: 4 }
                },
                { 
                    text: "Drop your pen on purpose to hide under the desk 🖊️", 
                    score: 2,
                    traits: { confidence: 3, creativity: 7, social: 4, calmness: 3, mainChar: 5 }
                }
            ]
        }
    ];

    /* Dynamic Microcopy Prompts */
    const vibeMicrocopy = [
        "Scanning your vibe...",
        "Interesting choice detected.",
        "Calibrating aura frequency...",
        "Your signal is getting louder ⚡",
        "Aura harmonics shifting...",
        "Strong vibe signature found.",
        "Analyzing social confidence...",
        "Frequency peaking nicely...",
        "Almost there, final readings...",
        "Decrypting your ultimate aura profile 🔮"
    ];

    /* ==========================================================================
       2. STATE VARIABLES
       ========================================================================== */
    let currentQuestionIndex = 0;
    let totalScore = 0;
    let selectedOptionScore = null;
    let selectedOptionTraits = null;
    let selectedOptionIndex = null;
    let userAnswers = [];
    let scanStartTime = null;
    let scanDurationSeconds = 42;

    let accumulatedTraits = {
        confidence: 0,
        creativity: 0,
        social: 0,
        calmness: 0,
        mainChar: 0
    };

    /* ==========================================================================
       3. DOM ELEMENTS
       ========================================================================== */
    const startBtn = document.getElementById("start-btn");
    const navScanBtn = document.getElementById("nav-scan-btn");
    const nextBtn = document.getElementById("next-btn");
    const retryBtn = document.getElementById("retry-btn");
    const copyResultBtn = document.getElementById("copy-result-btn");
    const shareAuraBtn = document.getElementById("share-aura-btn");
    const downloadCardBtn = document.getElementById("download-card-btn");

    const heroSection = document.getElementById("hero");
    const howSection = document.getElementById("how-it-works");
    const aboutSection = document.getElementById("about");
    const challengeSection = document.getElementById("challenge");
    const quizContainer = document.getElementById("quiz-container");
    const resultContainer = document.getElementById("result-container");

    const scenarioTag = document.getElementById("scenario-tag");
    const questionProgressText = document.getElementById("question-progress");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressPercentText = document.getElementById("progress-percent");
    const progressSubtext = document.getElementById("progress-subtext");
    const liveVibeMsg = document.getElementById("live-vibe-msg");
    const liveAuraOrb = document.getElementById("live-aura-orb");

    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const warningMsg = document.getElementById("warning-msg");

    const finalScoreElement = document.getElementById("final-score");
    const auraLevelTitle = document.getElementById("aura-level-title");
    const auraLevelDesc = document.getElementById("aura-level-desc");
    const resultOrbIcon = document.getElementById("result-orb-icon");
    const resultAuraOrb = document.getElementById("result-aura-orb");

    const traitValConfidence = document.getElementById("trait-val-confidence");
    const traitValCreativity = document.getElementById("trait-val-creativity");
    const traitValSocial = document.getElementById("trait-val-social");
    const traitValCalmness = document.getElementById("trait-val-calmness");
    const traitValMainChar = document.getElementById("trait-val-mainchar");

    const traitBarConfidence = document.getElementById("trait-bar-confidence");
    const traitBarCreativity = document.getElementById("trait-bar-creativity");
    const traitBarSocial = document.getElementById("trait-bar-social");
    const traitBarCalmness = document.getElementById("trait-bar-calmness");
    const traitBarMainChar = document.getElementById("trait-bar-mainchar");

    const shareScoreDisplay = document.getElementById("share-score-display");
    const shareArchetypeTitle = document.getElementById("share-archetype-title");
    const shareScanTime = document.getElementById("share-scan-time");
    const shareTraitsPills = document.getElementById("share-traits-pills");
    const toastMsg = document.getElementById("toast-msg");
    const exportCanvas = document.getElementById("export-canvas");

    /* ==========================================================================
       4. INITIALIZATION & EVENT BINDINGS
       ========================================================================== */
    function init() {
        if (startBtn) startBtn.addEventListener("click", startQuiz);
        if (navScanBtn) navScanBtn.addEventListener("click", startQuiz);
        if (nextBtn) nextBtn.addEventListener("click", handleNextQuestion);
        if (retryBtn) retryBtn.addEventListener("click", resetQuiz);
        if (copyResultBtn) copyResultBtn.addEventListener("click", copyResult);
        if (shareAuraBtn) shareAuraBtn.addEventListener("click", shareResult);
        if (downloadCardBtn) downloadCardBtn.addEventListener("click", downloadAuraCard);

        // Keyboard Shortcuts Navigation: 1-4 or A-D to select, Enter to proceed
        window.addEventListener("keydown", handleKeyNavigation);
    }

    function handleKeyNavigation(e) {
        if (!quizContainer || quizContainer.style.display === "none") return;

        const key = e.key.toUpperCase();
        let targetIndex = null;

        if (key === "1" || key === "A") targetIndex = 0;
        else if (key === "2" || key === "B") targetIndex = 1;
        else if (key === "3" || key === "C") targetIndex = 2;
        else if (key === "4" || key === "D") targetIndex = 3;
        else if (e.key === "Enter") {
            e.preventDefault();
            if (nextBtn && !nextBtn.disabled) {
                handleNextQuestion();
            }
            return;
        }

        if (targetIndex !== null && optionsContainer) {
            const buttons = optionsContainer.querySelectorAll(".option-btn");
            if (buttons && buttons[targetIndex]) {
                buttons[targetIndex].click();
            }
        }
    }

    /* ==========================================================================
       5. QUIZ ENGINE LOGIC
       ========================================================================== */
    function startQuiz() {
        // Hide Hero, How-It-Works, and About sections
        if (heroSection) heroSection.style.display = "none";
        if (howSection) howSection.style.display = "none";
        if (aboutSection) aboutSection.style.display = "none";
        if (challengeSection) challengeSection.style.display = "none";
        if (resultContainer) resultContainer.style.display = "none";

        // Show Quiz section
        if (quizContainer) {
            quizContainer.style.display = "block";
            quizContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Reset state variables
        currentQuestionIndex = 0;
        totalScore = 0;
        userAnswers = [];
        accumulatedTraits = { confidence: 0, creativity: 0, social: 0, calmness: 0, mainChar: 0 };
        scanStartTime = Date.now();

        // Load first question
        loadQuestion();
    }

    function loadQuestion() {
        selectedOptionScore = null;
        selectedOptionTraits = null;
        selectedOptionIndex = null;

        if (warningMsg) warningMsg.style.display = "none";
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = (currentQuestionIndex === questions.length - 1)
                ? '<span>Submit & Reveal Aura</span> <span class="btn-arrow">🔮</span>'
                : '<span>Next Question</span> <span class="btn-arrow">→</span>';
        }

        const currentQ = questions[currentQuestionIndex];
        if (!currentQ) return;

        // Update Progress Tracker
        if (scenarioTag) scenarioTag.textContent = currentQ.scenario || `SCENARIO 0${currentQuestionIndex + 1}`;
        if (questionProgressText) {
            const formattedCurrent = String(currentQuestionIndex + 1).padStart(2, "0");
            const formattedTotal = String(questions.length).padStart(2, "0");
            questionProgressText.textContent = `Question ${formattedCurrent} of ${formattedTotal}`;
        }

        const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
        if (progressPercentText) progressPercentText.textContent = `${progressPercent}%`;
        if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;
        if (progressSubtext) progressSubtext.textContent = `Analyzing frequency level ${progressPercent}%...`;

        // Update Live Aura Message
        if (liveVibeMsg) {
            liveVibeMsg.textContent = vibeMicrocopy[currentQuestionIndex] || "Scanning vibe signal...";
        }

        // Update Question Text
        if (questionText) questionText.textContent = currentQ.question;

        // Clear and populate options
        if (optionsContainer) {
            optionsContainer.innerHTML = "";
            const optionKeys = ["A", "B", "C", "D"];

            currentQ.options.forEach((option, idx) => {
                const btn = document.createElement("button");
                btn.className = "option-btn";
                btn.setAttribute("type", "button");
                btn.setAttribute("role", "radio");
                btn.setAttribute("aria-checked", "false");

                btn.innerHTML = `
                    <span class="option-key-badge">${optionKeys[idx]}</span>
                    <span class="option-text">${option.text}</span>
                `;

                btn.addEventListener("click", () => {
                    selectOption(btn, option.score, option.traits, idx);
                });

                optionsContainer.appendChild(btn);
            });
        }
    }

    function selectOption(selectedBtn, score, traits, index) {
        selectedOptionScore = score;
        selectedOptionTraits = traits;
        selectedOptionIndex = index;

        if (warningMsg) warningMsg.style.display = "none";
        if (nextBtn) nextBtn.disabled = false;

        // Remove active class from other buttons
        if (optionsContainer) {
            const allButtons = optionsContainer.querySelectorAll(".option-btn");
            allButtons.forEach((b) => {
                b.classList.remove("selected");
                b.setAttribute("aria-checked", "false");
            });
        }

        // Highlight selected
        selectedBtn.classList.add("selected");
        selectedBtn.setAttribute("aria-checked", "true");

        // Dynamically shift Live Aura Orb Color & Frequency
        updateLiveAura(index);
    }

    function updateLiveAura(optionIndex) {
        if (!liveAuraOrb) return;

        const auraGradients = [
            "radial-gradient(circle at 35% 35%, #ec4899 0%, #a855f7 50%, #06b6d4 100%)", // Ready / Dominant
            "radial-gradient(circle at 35% 35%, #06b6d4 0%, #8b5cf6 60%, #3b82f6 100%)", // Curious / Chill
            "radial-gradient(circle at 35% 35%, #f59e0b 0%, #ec4899 50%, #a855f7 100%)", // Adrenaline / Chaos
            "radial-gradient(circle at 35% 35%, #64748b 0%, #a855f7 60%, #0f172a 100%)"  // Seen / Observer
        ];

        liveAuraOrb.style.background = auraGradients[optionIndex] || auraGradients[0];
        liveAuraOrb.style.transform = "scale(1.25)";
        setTimeout(() => {
            if (liveAuraOrb) liveAuraOrb.style.transform = "scale(1)";
        }, 250);
    }

    function handleNextQuestion() {
        if (selectedOptionScore === null) {
            if (warningMsg) warningMsg.style.display = "block";
            return;
        }

        // Accumulate score and traits
        totalScore += selectedOptionScore;
        userAnswers.push(selectedOptionIndex);

        if (selectedOptionTraits) {
            accumulatedTraits.confidence += selectedOptionTraits.confidence || 7;
            accumulatedTraits.creativity += selectedOptionTraits.creativity || 7;
            accumulatedTraits.social += selectedOptionTraits.social || 7;
            accumulatedTraits.calmness += selectedOptionTraits.calmness || 7;
            accumulatedTraits.mainChar += selectedOptionTraits.mainChar || 7;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    /* ==========================================================================
       6. RESULT PROFILE CALCULATION & ANIMATIONS
       ========================================================================== */
    function calculateArchetype(score) {
        if (score <= 39) {
            return {
                title: "😶 NPC ENERGY",
                icon: "😶",
                description: "You're living on default settings bro! Lowkey observing from the sidelines. Time to make some chaotic main-character choices and get your aura up.",
                pills: ["💤 Stealth Mode", "🤫 Quiet Presence", "📈 Aura In Progress"],
                color: "#94a3b8"
            };
        } else if (score <= 59) {
            return {
                title: "😐 AVERAGE AURA",
                icon: "⚡",
                description: "Holding down the fort smoothly. Balanced, reliable, and solid. There is a legendary vibe builder waiting to unlock full power.",
                pills: ["⚖️ Balanced Vibe", "🛡️ Solid Defense", "✨ High Potential"],
                color: "#38bdf8"
            };
        } else if (score <= 69) {
            return {
                title: "😎 COOL AURA",
                icon: "😎",
                description: "Chilled out, effortless, and undeniably smooth. You don't try too hard, yet you stay unbothered and cool under campus pressure.",
                pills: ["🧊 Unbothered", "🕶️ Smooth Energy", "☕ Strategic Chill"],
                color: "#22d3ee"
            };
        } else if (score <= 79) {
            return {
                title: "🔥 PRO AURA",
                icon: "🔥",
                description: "Magnetic presence! You walk into chaos with pure confidence and make things look easy. Everyone knows you're in the room.",
                pills: ["🔥 High Voltage", "🧠 Street Smart", "🤝 Instant Vibe"],
                color: "#f43f5e"
            };
        } else if (score <= 89) {
            return {
                title: "🗿 SAVAGE AURA",
                icon: "🗿",
                description: "Unshakable mindset. You handle deadlines, awkward texts, and 8 AM lectures like a walk in the park. Maximum respect unlocked.",
                pills: ["🗿 Sigma Grind", "🛡️ Bulletproof Chill", "🏆 Natural Leader"],
                color: "#a855f7"
            };
        } else {
            return {
                title: "👑 UNLIMITED AURA",
                icon: "👑",
                description: "Absolute Main Character energy! The room's gravity shifts when you arrive. Infinite charisma, unmatched presence, zero hesitation.",
                pills: ["👑 Main Character", "⚡ Infinite Presence", "🌟 Apex Aura"],
                color: "#ec4899"
            };
        }
    }

    function showResults() {
        if (quizContainer) quizContainer.style.display = "none";
        if (resultContainer) {
            resultContainer.style.display = "block";
            resultContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Calculate total scan time
        const elapsedSecs = scanStartTime ? Math.max(12, Math.round((Date.now() - scanStartTime) / 1000)) : 42;
        scanDurationSeconds = elapsedSecs;

        const archetype = calculateArchetype(totalScore);

        // Update Archetype & Narrative
        if (auraLevelTitle) auraLevelTitle.textContent = archetype.title;
        if (auraLevelDesc) auraLevelDesc.textContent = archetype.description;
        if (resultOrbIcon) resultOrbIcon.textContent = archetype.icon;

        // Share Card elements
        if (shareArchetypeTitle) shareArchetypeTitle.textContent = archetype.title.replace(/^[^\w\s]+/, "").trim();
        if (shareScanTime) shareScanTime.textContent = `SCANNED IN ${scanDurationSeconds}s`;

        if (shareTraitsPills) {
            shareTraitsPills.innerHTML = "";
            archetype.pills.forEach((pillText) => {
                const span = document.createElement("span");
                span.className = "share-pill";
                span.textContent = pillText;
                shareTraitsPills.appendChild(span);
            });
        }

        // Animate Score Counter (0 -> totalScore)
        animateScore(totalScore);

        // Calculate and animate Trait Percentages
        // Normalizing trait totals out of 100 (max possible per trait is 100)
        const computePercent = (val) => Math.min(100, Math.max(25, Math.round(val)));

        const cPercent = computePercent(accumulatedTraits.confidence);
        const crPercent = computePercent(accumulatedTraits.creativity);
        const sPercent = computePercent(accumulatedTraits.social);
        const clPercent = computePercent(accumulatedTraits.calmness);
        const mPercent = computePercent(accumulatedTraits.mainChar);

        setTimeout(() => {
            if (traitValConfidence) traitValConfidence.textContent = `${cPercent}%`;
            if (traitBarConfidence) traitBarConfidence.style.width = `${cPercent}%`;

            if (traitValCreativity) traitValCreativity.textContent = `${crPercent}%`;
            if (traitBarCreativity) traitBarCreativity.style.width = `${crPercent}%`;

            if (traitValSocial) traitValSocial.textContent = `${sPercent}%`;
            if (traitBarSocial) traitBarSocial.style.width = `${sPercent}%`;

            if (traitValCalmness) traitValCalmness.textContent = `${clPercent}%`;
            if (traitBarCalmness) traitBarCalmness.style.width = `${clPercent}%`;

            if (traitValMainChar) traitValMainChar.textContent = `${mPercent}%`;
            if (traitBarMainChar) traitBarMainChar.style.width = `${mPercent}%`;
        }, 300);
    }

    function animateScore(targetValue) {
        if (!finalScoreElement) return;

        let current = 0;
        const duration = 1400;
        const startTime = performance.now();

        function updateScore(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            current = Math.round(targetValue * easeOut);

            finalScoreElement.textContent = String(current);
            if (shareScoreDisplay) shareScoreDisplay.textContent = String(current);

            if (progress < 1) {
                requestAnimationFrame(updateScore);
            } else {
                finalScoreElement.textContent = String(targetValue);
                if (shareScoreDisplay) shareScoreDisplay.textContent = String(targetValue);
            }
        }

        requestAnimationFrame(updateScore);
    }

    /* ==========================================================================
       7. SHARING & EXPORT UTILITIES
       ========================================================================== */
    function generateShareText() {
        const archetype = calculateArchetype(totalScore);
        return `🔮 NEXASOUL AURA LAB REPORT\n` +
               `Score: ${totalScore}/100\n` +
               `Archetype: ${archetype.title}\n` +
               `Scanned in: ${scanDurationSeconds}s\n` +
               `Vibe: ${archetype.pills.join(" | ")}\n\n` +
               `Take the Aura Test: NexaSoul Web Development Foundation Bootcamp`;
    }

    function showToast(message) {
        if (!toastMsg) return;
        toastMsg.innerHTML = `<span>${message}</span>`;
        toastMsg.style.display = "block";

        setTimeout(() => {
            if (toastMsg) toastMsg.style.display = "none";
        }, 3500);
    }

    function copyResult() {
        const text = generateShareText();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast("✨ Result copied to clipboard! Ready to flex.");
            }).catch(() => {
                fallbackCopyText(text);
            });
        } else {
            fallbackCopyText(text);
        }
    }

    function fallbackCopyText(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast("✨ Result copied to clipboard! Ready to flex.");
        } catch (e) {
            showToast("⚠️ Could not copy automatically. Please copy manually.");
        }
        document.body.removeChild(textarea);
    }

    function shareResult() {
        const archetype = calculateArchetype(totalScore);
        if (navigator.share) {
            navigator.share({
                title: "My NexaSoul Aura Score",
                text: generateShareText(),
                url: window.location.href
            }).catch((err) => {
                if (err.name !== "AbortError") {
                    copyResult();
                }
            });
        } else {
            copyResult();
        }
    }

    /* Native HTML5 Canvas Share Card Exporter */
    function downloadAuraCard() {
        if (!exportCanvas) return;
        const ctx = exportCanvas.getContext("2d");
        const archetype = calculateArchetype(totalScore);

        const width = 1080;
        const height = 1350;
        exportCanvas.width = width;
        exportCanvas.height = height;

        // Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#07070b");
        bgGrad.addColorStop(0.5, "#100d1e");
        bgGrad.addColorStop(1, "#07070b");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Glow Orbs on canvas
        const orb1 = ctx.createRadialGradient(200, 250, 0, 200, 250, 450);
        orb1.addColorStop(0, "rgba(139, 92, 246, 0.4)");
        orb1.addColorStop(1, "transparent");
        ctx.fillStyle = orb1;
        ctx.fillRect(0, 0, width, height);

        const orb2 = ctx.createRadialGradient(880, 850, 0, 880, 850, 450);
        orb2.addColorStop(0, "rgba(236, 72, 153, 0.35)");
        orb2.addColorStop(1, "transparent");
        ctx.fillStyle = orb2;
        ctx.fillRect(0, 0, width, height);

        // Glass Card Container
        const cardX = 80;
        const cardY = 100;
        const cardW = width - 160;
        const cardH = height - 200;
        const radius = 40;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cardX + radius, cardY);
        ctx.lineTo(cardX + cardW - radius, cardY);
        ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
        ctx.lineTo(cardX + cardW, cardY + cardH - radius);
        ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
        ctx.lineTo(cardX + radius, cardY + cardH);
        ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
        ctx.lineTo(cardX, cardY + radius);
        ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
        ctx.closePath();

        ctx.fillStyle = "rgba(18, 18, 32, 0.85)";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
        ctx.stroke();
        ctx.restore();

        // Top Accent Line
        const topGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
        topGrad.addColorStop(0, "#8b5cf6");
        topGrad.addColorStop(0.5, "#ec4899");
        topGrad.addColorStop(1, "#06b6d4");
        ctx.fillStyle = topGrad;
        ctx.fillRect(cardX + 40, cardY, cardW - 80, 6);

        // Header Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px 'Space Grotesk', sans-serif";
        ctx.fillText("NEXASOUL AURA LAB", cardX + 50, cardY + 80);

        ctx.fillStyle = "#22d3ee";
        ctx.font = "bold 24px 'Space Grotesk', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`SCANNED IN ${scanDurationSeconds}s`, cardX + cardW - 50, cardY + 80);

        // Score Badge Circle
        ctx.textAlign = "center";
        const scoreCenterX = width / 2;
        const scoreCenterY = cardY + 310;

        const scoreHalo = ctx.createRadialGradient(scoreCenterX, scoreCenterY, 50, scoreCenterX, scoreCenterY, 160);
        scoreHalo.addColorStop(0, "rgba(236, 72, 153, 0.5)");
        scoreHalo.addColorStop(1, "transparent");
        ctx.fillStyle = scoreHalo;
        ctx.beginPath();
        ctx.arc(scoreCenterX, scoreCenterY, 160, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(scoreCenterX, scoreCenterY, 110, 0, Math.PI * 2);
        ctx.fillStyle = "linear-gradient(135deg, #9333ea, #ec4899)";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 96px 'Space Grotesk', sans-serif";
        ctx.fillText(String(totalScore), scoreCenterX, scoreCenterY + 28);

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 24px 'Space Grotesk', sans-serif";
        ctx.fillText("OUT OF 100", scoreCenterX, scoreCenterY + 70);

        // Archetype Title
        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 26px 'Space Grotesk', sans-serif";
        ctx.fillText("CLASSIFIED ARCHETYPE", scoreCenterX, scoreCenterY + 160);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 56px 'Space Grotesk', sans-serif";
        ctx.fillText(archetype.title, scoreCenterX, scoreCenterY + 225);

        // Pills
        ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
        const pillY = scoreCenterY + 300;
        const pillW = 260;
        const pillH = 54;
        const startPillX = scoreCenterX - 300;

        archetype.pills.forEach((pText, i) => {
            const pX = startPillX + (i * 300);
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.beginPath();
            ctx.roundRect(pX - pillW/2, pillY - pillH/2, pillW, pillH, 27);
            ctx.fill();
            ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.fillText(pText, pX, pillY + 8);
        });

        // Bottom Footer Watermark
        ctx.textAlign = "center";
        ctx.fillStyle = "#94a3b8";
        ctx.font = "24px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Verified by NexaSoul Web Development Foundation Bootcamp", scoreCenterX, cardY + cardH - 70);

        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 20px 'Space Grotesk', sans-serif";
        ctx.fillText("CODE • CONNECT • CONQUER", scoreCenterX, cardY + cardH - 35);

        // Trigger Download
        try {
            const dataUrl = exportCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `nexasoul-aura-${totalScore}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("📥 Aura Pass downloaded as PNG!");
        } catch (e) {
            showToast("⚠️ Could not generate image file directly.");
        }
    }

    /* ==========================================================================
       8. RESET / RETAKE FLOW
       ========================================================================== */
    function resetQuiz() {
        if (resultContainer) resultContainer.style.display = "none";
        if (quizContainer) quizContainer.style.display = "none";

        if (heroSection) heroSection.style.display = "block";
        if (howSection) howSection.style.display = "block";
        if (aboutSection) aboutSection.style.display = "block";
        if (challengeSection) challengeSection.style.display = "block";

        currentQuestionIndex = 0;
        totalScore = 0;
        selectedOptionScore = null;
        selectedOptionTraits = null;
        selectedOptionIndex = null;
        userAnswers = [];

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();