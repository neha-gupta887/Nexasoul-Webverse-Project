/* =========================================================
NEXASOUL — AURA DETECTOR
Interactive Aura Engine
========================================================= */

const questions = [
{
question: "Your friend says 'Bro, let's go out.' You:",
options: [
{ text: "Already ready 🚀", score: 10 },
{ text: "'Where?' 👀", score: 7 },
{ text: "'I'm broke bro 💀'", score: 5 },
{ text: "Leaves the message on seen 🤐", score: 2 }
]
},
{
question: "Your assignment is due tomorrow at 11:59 PM. You:",
options: [
{ text: "Finished it last week 🤓", score: 10 },
{ text: "Start today after lunch 💻", score: 7 },
{ text: "Start at 11:45 PM with adrenaline ⚡", score: 5 },
{ text: "'Bro, can you send yours?' 💀", score: 2 }
]
},
{
question: "Someone replies to your message with just 'K.' Your reaction:",
options: [
{ text: "Normal, it's just a letter 👍", score: 10 },
{ text: "'Are they angry?' 👀", score: 7 },
{ text: "Overthink everything for 3 hours 😭", score: 5 },
{ text: "Start a full FBI investigation 🕵️", score: 2 }
]
},
{
question: "An 8:00 AM class/lecture is scheduled. You:",
options: [
{ text: "Sit in the front row fully awake ☕", score: 10 },
{ text: "Reach 10 minutes late with iced coffee 🥤", score: 7 },
{ text: "Sleep in class with eyes open 😴", score: 5 },
{ text: "Turn off the alarm and continue dreaming 🛌", score: 2 }
]
},
{
question: "You walk past a group of people laughing on campus. You think:",
options: [
{ text: "They must have heard a funny joke 😂", score: 10 },
{ text: "Probably laughing at a meme 📲", score: 7 },
{ text: "'Are they laughing at my outfit?' 😳", score: 5 },
{ text: "Adjust your walk style immediately 🚶‍♂️", score: 2 }
]
},
{
question: "Your phone battery drops to 5%. You:",
options: [
{ text: "Quietly pull out your power bank 🔋", score: 10 },
{ text: "Go hunt for a charger around campus 🔌", score: 7 },
{ text: "Enter extreme battery saver mode & panic ⚠️", score: 5 },
{ text: "Let it die, peace at last ✌️", score: 2 }
]
},
{
question: "Someone asks you to explain a study/code concept. You:",
options: [
{ text: "Explain it clearly like a professor 👨‍🏫", score: 10 },
{ text: "'Bro it's easy, look at this example' 💡", score: 7 },
{ text: "'Honestly, I guessed and it worked' 😅", score: 5 },
{ text: "'Wait, we had a concept for that?' 😵", score: 2 }
]
},
{
question: "How do you handle group project work?",
options: [
{ text: "Carry the whole team single-handedly 🎒", score: 10 },
{ text: "Do your assigned part perfectly 🤝", score: 7 },
{ text: "Moral support and emotional backing 📢", score: 5 },
{ text: "Send thumbs up emojis in the group chat 👍", score: 2 }
]
},
{
question: "You see a photo of yourself taken by a friend. You say:",
options: [
{ text: "'Damn, I look great!' 😎", score: 10 },
{ text: "'Post it, it's good' 📸", score: 7 },
{ text: "'Delete that right now 🔫'", score: 5 },
{ text: "'Who is that creature?' 👹", score: 2 }
]
},
{
question: "The teacher says 'I'm picking a random student to answer.' You:",
options: [
{ text: "Make eye contact to show dominance 🗿", score: 10 },
{ text: "Smile and stay calm 😁", score: 7 },
{ text: "Suddenly look very deeply into your notebook 📖", score: 5 },
{ text: "Drop your pen on purpose to hide under the desk 🖊️", score: 2 }
]
}
];

/* =========================================================
AURA LEVELS
Original organizer scoring preserved
========================================================= */

const levels = [
{
max: 39,
title: "😶 NPC ENERGY",
desc: "You're living on default settings bro! Time to make some main character choices and get your aura up.",
quote: "Default settings detected. Time for a software update."
},
{
max: 59,
title: "😐 AVERAGE AURA",
desc: "Not bad, not crazy. You're holding down the fort, but there's a main character waiting to break free.",
quote: "Stable energy. Untapped potential detected."
},
{
max: 69,
title: "😎 COOL AURA",
desc: "Chilled out, relaxed, and smooth. You don't try too hard, yet you keep your cool under pressure.",
quote: "Low effort. High vibe."
},
{
max: 79,
title: "🔥 PRO AURA",
desc: "You know what you're doing. You walk into situations with confidence and somehow make it work. That's some serious aura!",
quote: "You don't chase the vibe. You create it."
},
{
max: 89,
title: "🗿 SAVAGE AURA",
desc: "Unshakable mindset. You handle campus chaos like a walk in the park. Respect maxed out!",
quote: "Unshakable. Campus chaos can't touch you."
},
{
max: 100,
title: "👑 UNLIMITED AURA",
desc: "Absolute Main Character energy! The room shifts when you walk in. You possess unmatched aura!",
quote: "Main character protocol fully activated."
}
];

/* =========================================================
STATE
========================================================= */

let currentQuestionIndex = 0;
let totalScore = 0;
let selectedOptionScore = null;
let answerHistory = [];

/* =========================================================
DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const startBtn = $("start-btn");
const nextBtn = $("next-btn");
const retryBtn = $("retry-btn");
const shareBtn = $("share-btn");

const hero = $("hero");
const about = $("about");
const quiz = $("quiz-container");
const analysis = $("analysis-overlay");
const result = $("result-container");

const optionsContainer = $("options-container");
const questionText = $("question-text");
const questionProgress = $("question-progress");
const progressBar = $("progress-bar-fill");
const progressPercent = $("progress-percent");

const warning = $("warning-msg");

const finalScore = $("final-score");
const auraTitle = $("aura-level-title");
const auraDescription = $("aura-level-desc");

const scoreProgress = $("score-progress");

const energyValue = $("energy-value");
const confidenceValue = $("confidence-value");
const chaosValue = $("chaos-value");

const energyBar = $("energy-bar");
const confidenceBar = $("confidence-bar");
const chaosBar = $("chaos-bar");

const toast = $("toast");

/* =========================================================
SAFE HELPERS
========================================================= */

function show(element) {
if (!element) return;

```
element.style.display = "";
element.hidden = false;
```

}

function hide(element) {
if (!element) return;

```
element.style.display = "none";
element.hidden = true;
```

}

function scrollTop() {
window.scrollTo({
top: 0,
behavior: "smooth"
});
}

/* =========================================================
PARTICLE SYSTEM
========================================================= */

function createParticles() {

```
const existing = document.querySelector(".dynamic-particles");

if (existing) {
    existing.remove();
}

const field = document.createElement("div");

field.className = "dynamic-particles";
field.setAttribute("aria-hidden", "true");

for (let i = 0; i < 35; i++) {

    const particle = document.createElement("span");

    particle.className = "dynamic-particle";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    particle.style.animationDelay =
        `${Math.random() * 8}s`;

    particle.style.animationDuration =
        `${6 + Math.random() * 8}s`;

    const size = 1 + Math.random() * 3;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    field.appendChild(particle);
}

document.body.prepend(field);
```

}

/* =========================================================
START QUIZ
========================================================= */

function startQuiz() {

```
currentQuestionIndex = 0;
totalScore = 0;
selectedOptionScore = null;
answerHistory = [];

hide(hero);
hide(about);
hide(result);
hide(analysis);

show(quiz);

loadQuestion();

scrollTop();
```

}

/* =========================================================
LOAD QUESTION
========================================================= */

function loadQuestion() {

```
const question = questions[currentQuestionIndex];

if (!question) return;

selectedOptionScore = null;

if (warning) {
    warning.style.display = "none";
}

const number = currentQuestionIndex + 1;
const total = questions.length;

const percent = Math.round(
    (number / total) * 100
);

if (questionProgress) {
    questionProgress.textContent =
        `Question ${number} of ${total}`;
}

if (progressPercent) {
    progressPercent.textContent =
        `${percent}%`;
}

if (progressBar) {
    progressBar.style.width =
        `${percent}%`;
}

if (questionText) {
    questionText.textContent =
        question.question;
}

if (!optionsContainer) return;

optionsContainer.innerHTML = "";

question.options.forEach((option, index) => {

    const button = document.createElement("button");

    button.type = "button";

    button.className = "option-btn";

    button.dataset.key =
        String.fromCharCode(65 + index);

    button.setAttribute(
        "aria-label",
        `Option ${index + 1}: ${option.text}`
    );

    button.innerHTML = `
        <span class="option-key">
            ${String.fromCharCode(65 + index)}
        </span>

        <span class="option-text">
            ${escapeHtml(option.text)}
        </span>

        <span class="option-check">
            ✓
        </span>
    `;

    button.addEventListener(
        "click",
        () => selectOption(button, option.score)
    );

    optionsContainer.appendChild(button);
});


if (nextBtn) {

    const isLast =
        currentQuestionIndex === questions.length - 1;

    nextBtn.innerHTML = isLast
        ? `<span>REVEAL MY AURA</span><span>✦</span>`
        : `<span>NEXT QUESTION</span><span>→</span>`;
}


/* Question entrance animation */

const questionBox =
    document.querySelector(".question-box");

if (questionBox && questionBox.animate) {

    questionBox.animate(
        [
            {
                opacity: 0,
                transform: "translateY(15px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],
        {
            duration: 420,
            easing: "cubic-bezier(.2,.8,.2,1)"
        }
    );
}
```

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHtml(value) {

```
const div = document.createElement("div");

div.textContent = value;

return div.innerHTML;
```

}

/* =========================================================
SELECT OPTION
========================================================= */

function selectOption(button, score) {

```
selectedOptionScore = score;

if (warning) {
    warning.style.display = "none";
}

const buttons =
    optionsContainer.querySelectorAll(".option-btn");

buttons.forEach((item) => {

    item.classList.remove("selected");

    item.setAttribute(
        "aria-pressed",
        "false"
    );
});

button.classList.add("selected");

button.setAttribute(
    "aria-pressed",
    "true"
);

/* Tiny selection animation */

if (button.animate) {

    button.animate(
        [
            {
                transform: "scale(.98)"
            },
            {
                transform: "scale(1.02)"
            },
            {
                transform: "scale(1)"
            }
        ],
        {
            duration: 220,
            easing: "ease-out"
        }
    );
}
```

}

/* =========================================================
NEXT QUESTION
========================================================= */

function handleNext() {

```
if (selectedOptionScore === null) {

    if (warning) {
        warning.style.display = "block";
    }

    if (optionsContainer) {

        optionsContainer.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(-5px)" },
                { transform: "translateX(5px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 250
            }
        );
    }

    return;
}


totalScore += selectedOptionScore;

answerHistory.push(
    selectedOptionScore
);

currentQuestionIndex++;


if (currentQuestionIndex < questions.length) {

    loadQuestion();

} else {

    beginAnalysis();
}
```

}

/* =========================================================
AURA ANALYSIS
========================================================= */

function beginAnalysis() {

```
hide(quiz);

show(analysis);

scrollTop();


const status =
    analysis?.querySelector(".analysis-status");

const progress =
    analysis?.querySelector(".analysis-progress span");


const messages = [
    "Reading social frequency",
    "Mapping confidence vectors",
    "Checking chaos levels",
    "Finalizing aura signature"
];


let index = 0;

if (status) {
    status.textContent = messages[0];
}


if (progress) {
    progress.style.width = "8%";
}


const timer = setInterval(() => {

    index++;

    if (index < messages.length) {

        if (status) {
            status.textContent =
                messages[index];
        }

        if (progress) {

            progress.style.width =
                `${25 + index * 23}%`;
        }

    } else {

        clearInterval(timer);

        if (progress) {
            progress.style.width = "100%";
        }

        setTimeout(
            showResults,
            450
        );
    }

}, 420);
```

}

/* =========================================================
GET AURA LEVEL
========================================================= */

function getLevel(score) {

```
return (
    levels.find(level =>
        score <= level.max
    ) || levels[levels.length - 1]
);
```

}

/* =========================================================
SCORE ANIMATION
========================================================= */

function animateNumber(
element,
target,
duration = 1200
) {

```
if (!element) return;

const startTime =
    performance.now();

function frame(now) {

    const progress =
        Math.min(
            (now - startTime) / duration,
            1
        );

    const eased =
        1 - Math.pow(1 - progress, 3);

    element.textContent =
        Math.round(target * eased);

    if (progress < 1) {

        requestAnimationFrame(frame);

    } else {

        element.textContent =
            target;
    }
}

requestAnimationFrame(frame);
```

}

/* =========================================================
DERIVED AURA METRICS
========================================================= */

function calculateMetrics() {

```
const average =
    totalScore / questions.length;


const highEnergyAnswers =
    answerHistory.filter(
        score => score >= 7
    ).length;


const chaoticAnswers =
    answerHistory.filter(
        score => score <= 5
    ).length;


const variation =
    answerHistory.reduce(
        (total, score, index) =>
            total + score * (index + 1),
        0
    ) % 11;


const energy =
    Math.min(
        99,
        Math.round(
            average * 8.7 +
            variation
        )
    );


const confidence =
    Math.min(
        99,
        Math.round(
            average * 7.9 +
            highEnergyAnswers * 2
        )
    );


const chaos =
    Math.min(
        99,
        Math.max(
            12,
            Math.round(
                100 -
                average * 6.4 +
                chaoticAnswers * 4
            )
        )
    );


return {
    energy,
    confidence,
    chaos
};
```

}

/* =========================================================
RESULT SCREEN
========================================================= */

function showResults() {

```
hide(analysis);

show(result);

const level =
    getLevel(totalScore);

const metrics =
    calculateMetrics();


/* Main result */

if (auraTitle) {
    auraTitle.textContent =
        level.title;
}


if (auraDescription) {
    auraDescription.textContent =
        level.desc;
}


/* Score */

animateNumber(
    finalScore,
    totalScore,
    1200
);


/* Circular score */

if (scoreProgress) {

    const radius = 96;

    const circumference =
        2 * Math.PI * radius;

    scoreProgress.style.strokeDasharray =
        circumference;

    scoreProgress.style.strokeDashoffset =
        circumference;

    requestAnimationFrame(() => {

        const offset =
            circumference -
            (totalScore / 100) *
            circumference;

        scoreProgress.style.strokeDashoffset =
            offset;
    });
}


/* Metrics */

setTimeout(() => {

    updateMetric(
        energyValue,
        energyBar,
        metrics.energy
    );

    updateMetric(
        confidenceValue,
        confidenceBar,
        metrics.confidence
    );

    updateMetric(
        chaosValue,
        chaosBar,
        metrics.chaos
    );

}, 300);


/* Save best score */

const oldBest =
    Number(
        localStorage.getItem(
            "nexaAuraBest"
        ) || 0
    );

if (totalScore > oldBest) {

    localStorage.setItem(
        "nexaAuraBest",
        totalScore
    );
}


/* Add dynamic result quote */

createResultQuote(level.quote);


/* High score celebration */

if (totalScore >= 80) {

    setTimeout(
        celebrate,
        700
    );
}


scrollTop();
```

}

/* =========================================================
UPDATE METRIC
========================================================= */

function updateMetric(
valueElement,
barElement,
value
) {

```
if (valueElement) {

    animateNumber(
        valueElement,
        value,
        700
    );

    setTimeout(() => {

        valueElement.textContent =
            `${value}%`;

    }, 720);
}


if (barElement) {

    barElement.style.width = "0%";

    setTimeout(() => {

        barElement.style.width =
            `${value}%`;

    }, 100);
}
```

}

/* =========================================================
RESULT QUOTE
========================================================= */

function createResultQuote(quote) {

```
if (!quote) return;


const existing =
    document.querySelector(
        ".dynamic-result-quote"
    );

if (existing) {
    existing.remove();
}


const resultContent =
    document.querySelector(
        ".result-content"
    );


if (!resultContent) return;


const quoteBox =
    document.createElement("div");

quoteBox.className =
    "dynamic-result-quote";


quoteBox.innerHTML = `
    <span class="quote-mark">“</span>
    <p>${escapeHtml(quote)}</p>
`;


const stats =
    document.querySelector(
        ".profile-stats"
    );


if (stats) {

    stats.insertAdjacentElement(
        "afterend",
        quoteBox
    );

} else {

    resultContent.appendChild(
        quoteBox
    );
}
```

}

/* =========================================================
RESET / RETAKE
========================================================= */

function resetQuiz() {

```
currentQuestionIndex = 0;
totalScore = 0;
selectedOptionScore = null;
answerHistory = [];


hide(result);
hide(quiz);
hide(analysis);

show(hero);
show(about);

scrollTop();
```

}

/* =========================================================
SHARE RESULT
========================================================= */

async function shareResult() {

```
const level =
    getLevel(totalScore);


const text =
    `I just discovered my aura: ${level.title} — ${totalScore}/100. What's yours? #AuraDetector #NexaSoul`;


try {

    if (
        navigator.share &&
        typeof navigator.share === "function"
    ) {

        await navigator.share({
            title: "My Aura Result",
            text: text
        });

        return;
    }


    await copyToClipboard(text);

    showToast(
        "Aura result copied ✦"
    );

} catch (error) {

    if (
        error &&
        error.name === "AbortError"
    ) {
        return;
    }


    try {

        await copyToClipboard(text);

        showToast(
            "Aura result copied ✦"
        );

    } catch {

        showToast(
            "Your aura is share-worthy ✦"
        );
    }
}
```

}

/* =========================================================
CLIPBOARD
========================================================= */

async function copyToClipboard(text) {

```
if (
    navigator.clipboard &&
    navigator.clipboard.writeText
) {

    await navigator.clipboard.writeText(
        text
    );

    return;
}


const textarea =
    document.createElement("textarea");

textarea.value = text;

textarea.style.position =
    "fixed";

textarea.style.opacity = "0";

document.body.appendChild(
    textarea
);

textarea.select();

document.execCommand(
    "copy"
);

textarea.remove();
```

}

/* =========================================================
TOAST
========================================================= */

function showToast(message) {

```
if (!toast) return;

toast.textContent = message;

toast.classList.add("show");


clearTimeout(
    showToast.timer
);


showToast.timer =
    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2400);
```

}

/* =========================================================
HIGH SCORE CELEBRATION
========================================================= */

function celebrate() {

```
const particleCount = 42;


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const particle =
        document.createElement("span");

    particle.className =
        "celebration-particle";


    particle.style.left =
        "50%";

    particle.style.top =
        "45%";


    const angle =
        Math.random() *
        Math.PI * 2;


    const distance =
        100 +
        Math.random() * 300;


    particle.style.setProperty(
        "--x",
        `${Math.cos(angle) * distance}px`
    );


    particle.style.setProperty(
        "--y",
        `${Math.sin(angle) * distance}px`
    );


    particle.style.setProperty(
        "--r",
        `${Math.random() * 720 - 360}deg`
    );


    particle.style.animationDelay =
        `${Math.random() * 120}ms`;


    document.body.appendChild(
        particle
    );


    setTimeout(() => {

        particle.remove();

    }, 1400);
}
```

}

/* =========================================================
KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
"keydown",
(event) => {

```
    if (
        !quiz ||
        quiz.style.display === "none" ||
        quiz.hidden
    ) {
        return;
    }


    /* 1-4 select options */

    if (
        ["1", "2", "3", "4"]
            .includes(event.key)
    ) {

        const index =
            Number(event.key) - 1;


        const buttons =
            optionsContainer
                ?.querySelectorAll(
                    ".option-btn"
                );


        if (
            buttons &&
            buttons[index]
        ) {

            buttons[index].click();
        }
    }


    /* Enter = next */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        handleNext();
    }
}
```

);

/* =========================================================
BUTTON EVENTS
========================================================= */

if (startBtn) {

```
startBtn.addEventListener(
    "click",
    startQuiz
);
```

}

if (nextBtn) {

```
nextBtn.addEventListener(
    "click",
    handleNext
);
```

}

if (retryBtn) {

```
retryBtn.addEventListener(
    "click",
    resetQuiz
);
```

}

if (shareBtn) {

```
shareBtn.addEventListener(
    "click",
    shareResult
);
```

}

/* =========================================================
SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll(
'a[href^="#"]'
).forEach(link => {

```
link.addEventListener(
    "click",
    event => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(
                targetId
            );


        if (!target) return;


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);
```

});

/* =========================================================
INITIALIZE
========================================================= */

createParticles();

/* Accessibility */

if (optionsContainer) {

```
optionsContainer.setAttribute(
    "role",
    "group"
);

optionsContainer.setAttribute(
    "aria-label",
    "Aura answer options"
);
```

}

/* =========================================================
END
========================================================= */
