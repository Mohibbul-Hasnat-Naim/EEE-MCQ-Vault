// ======================================================
// BUILD 004A
// ======================================================

// ===== Global State =====
let currentSession = [];


// ===== Initialize =====

document.addEventListener("DOMContentLoaded", init);

async function init() {

    await buildDashboard();
    addBookmarkDashboardCard();
}


// ===== Dashboard =====

async function buildDashboard() {

    const container = document.getElementById("topicsContainer");

    container.innerHTML = "";

    let totalQuestions = 0;

    for (const topic of MCQ_CONFIG.topics) {

        let topicCount = 0;

        for (const sub of topic.subtopics) {

            try {

                const data = await loadQuestionFile(topic.folder, sub.file);

                topicCount += data.length;
                totalQuestions += data.length;

            } catch (err) {

                console.warn(`Cannot load ${sub.file}`);

            }

        }

        container.appendChild(createTopicCard(topic, topicCount));

    }

    document.getElementById("totalQuestions").textContent = totalQuestions;

}


// ===== Create Topic Card =====

function createTopicCard(topic, count) {

    const card = document.createElement("div");
    card.className = "topic-card";

    const buttons = topic.subtopics.map(sub => `
        <button class="subtopic-btn"
            data-topic="${topic.id}"
            data-sub="${sub.id}">
            ${sub.name}
        </button>
    `).join("");

    card.innerHTML = `
        <div class="topic-header">
            <div>
                <div class="topic-title">${topic.icon} ${topic.name}</div>
                <div class="topic-count">${count} Questions</div>
            </div>
        </div>

        <button class="practice-btn"
            data-practice-all="${topic.id}">
            Practice All
        </button>

        <div class="subtopics">
            ${buttons}
        </div>
    `;

    return card;

}


// ===== Load JSON =====

async function loadQuestionFile(folder, file) {

    const res = await fetch(`data/${folder}/${file}`);

    if (!res.ok)
        throw new Error(file);

    return await res.json();

}


// ===== Shuffle Engine =====

function shuffle(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];

    }

    return copy;

}

// ======================================================
// BUILD 004B
// ======================================================

// ===== Event Listeners =====

document.addEventListener("click", async function (e) {

    // Practice All
    const practiceAll = e.target.closest("[data-practice-all]");

    if (practiceAll) {

        const topicId = practiceAll.dataset.practiceAll;
        await startTopicPractice(topicId);
        return;
    }

    // Subtopic Practice
    const subBtn = e.target.closest("[data-topic][data-sub]");

    if (subBtn) {

        await startSubtopicPractice(
            subBtn.dataset.topic,
            subBtn.dataset.sub
        );
        return;
    }

    // Restart
    if (e.target.closest("#restartPractice")) {

        restartCurrentSession();
    }

});


// ===== Start Practice =====

async function startTopicPractice(topicId){

    const topic = MCQ_CONFIG.topics.find(t => t.id === topicId);

    if(!topic) return;

    let questions = [];

    for(const sub of topic.subtopics){

        try{

            const data = await loadQuestionFile(topic.folder, sub.file);
            questions.push(...data);

        }catch(err){

            // Skip missing question files silently

        }

    }

    if(questions.length === 0) return;

    startSession(topic.name, "Practice All", questions);

}

async function startSubtopicPractice(topicId, subId) {

    const topic = MCQ_CONFIG.topics.find(t => t.id === topicId);

    const sub = topic.subtopics.find(s => s.id === subId);

    const questions = await loadQuestionFile(topic.folder, sub.file);

    startSession(topic.name, sub.name, questions);

}


// ===== Session =====

function startSession(topicName, subtopicName, questions) {

    currentSession = shuffle(questions);

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("practiceScreen").classList.remove("hidden");

    enterPracticeHistory();

    renderPracticeHeader(topicName, subtopicName);
    renderQuestions();

}


// ===== Header =====

function renderPracticeHeader(topic, subtopic){

    const header = document.getElementById("practiceHeader");

    header.innerHTML = `

        <div class="practice-top">

            <button id="backDashboard">
                ←
            </button>

            <div class="practice-title">
                <strong>${subtopic}</strong>
                <span>${topic}</span>
            </div>

            <button id="restartPractice">
                ↻
            </button>

        </div>

        <div class="session-stats">

            <div class="session-stat correct-stat">
                <strong id="correctCount">0</strong>
                <span>Correct</span>
            </div>

            <div class="session-stat wrong-stat">
                <strong id="wrongCount">0</strong>
                <span>Wrong</span>
            </div>

            <div class="session-stat progress-stat">
                <strong id="progressText">
                    0 / ${currentSession.length}
                </strong>
                <span>Done</span>
            </div>

        </div>

        <div class="progress-bar">
            <div id="progressFill"></div>
        </div>
    `;

}

// ===== Render Questions =====

function renderQuestions() {

    const container = document.getElementById("questionContainer");

    container.innerHTML = "";

    currentSession.forEach((q, index) => {

        const options = q.options.map((opt, i) => `
            <div class="option"
                 data-question="${index}"
                 data-option="${i}">
                 ${String.fromCharCode(65 + i)}. ${opt}
            </div>
        `).join("");

        container.innerHTML += `
            <div class="question-card">

                <div class="question-top">

                    <span class="question-id">${q.id}</span>

                    <span class="bookmark"
                        data-bookmark="${q.id}">
                        ${getBookmarks().includes(q.id) ? "★" : "☆"}
                    </span>

                </div>

                <div class="question-text">

                    ${q.image ? `<img src="${q.image}" class="question-image">` : ""}

                    ${q.question}

                </div>

                <div class="options">

                    ${options}

                </div>

                <details>

                    <summary>Explanation</summary>

                    <p>${q.explanation}</p>

                </details>

            </div>
        `;

    });

}


// ===== Restart =====

function restartCurrentSession() {

    currentSession = shuffle(currentSession);

    renderPracticeHeader(
        document.querySelector(".practice-title strong").textContent,
        document.querySelector(".practice-title span").textContent
    );

    renderQuestions();

}

// ======================================================
// BUILD 004C + 004D
// Answer Engine, Progress, Back, Restart, Bookmark
// ======================================================


// ---------- Bookmarks ----------

const BOOKMARK_KEY = "eee_mcq_bookmarks";

function getBookmarks() {

    return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");

}

function saveBookmarks(list) {

    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));

}

function toggleBookmark(id, element) {

    let list = getBookmarks();

    if (list.includes(id)) {

        list = list.filter(x => x !== id);
        element.textContent="☆";
        element.classList.remove("active");

    } else {

        list.push(id);
        element.textContent="★";
        element.classList.add("active");
    }

    saveBookmarks(list);

}


// ---------- Progress ----------

function updateProgress(){

    const cards =
        document.querySelectorAll(".question-card");

    let answered = 0;
    let correct = 0;
    let wrong = 0;

    cards.forEach(card => {

        if(card.dataset.answered === "true"){

            answered++;

            if(card.classList.contains("answered-correct")){

                correct++;

            }else{

                wrong++;

            }

        }

    });

    const total = currentSession.length;

    document.getElementById("progressText").textContent =
        `${answered} / ${total}`;

    document.getElementById("correctCount").textContent =
        correct;

    document.getElementById("wrongCount").textContent =
        wrong;

    document.getElementById("progressFill").style.width =
        `${answered / total * 100}%`;

}

// ---------- Global Click Engine ----------

document.addEventListener("click", function (e) {

    // Answer Checking

    const option = e.target.closest(".option");

    if (option) {

        const card = option.closest(".question-card");

        if (card.dataset.answered === "true") return;

        const qIndex = Number(option.dataset.question);
        const selected = Number(option.dataset.option);
        const correct = currentSession[qIndex].answer;

        card.dataset.answered = "true";

        if(selected===correct){
            card.classList.add("answered-correct");
        }else{
            card.classList.add("answered-wrong");
        }

        card.querySelectorAll(".option").forEach(opt => {

            const value = Number(opt.dataset.option);

            if (value === correct) {

                opt.classList.add("correct");

            } else if (value === selected) {

                opt.classList.add("wrong");

            }

        });

        updateProgress();

        return;

    }


    // Bookmark

    const bookmark = e.target.closest("[data-bookmark]");

    if (bookmark) {

        toggleBookmark(bookmark.dataset.bookmark, bookmark);

        return;

    }


    // Back to Dashboard

    if (e.target.closest("#backDashboard")) {

        document.getElementById("practiceScreen")
            .classList.add("hidden");

        document.getElementById("dashboard")
            .classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;

    }


    // Restart Session

    if (e.target.closest("#restartPractice")) {

        currentSession = shuffle(currentSession);

        const topic =
            document.querySelector(".practice-title strong").textContent;

        const sub =
            document.querySelector(".practice-title span").textContent;

        renderPracticeHeader(topic, sub);
        renderQuestions();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;

    }

});


// ======================================================
// BUILD 006A
// Dashboard Stats + Bookmarked Practice
// ======================================================

function getBookmarkCount(){

    return getBookmarks().length;

}


// ---------- Dashboard Bookmark Card ----------

function addBookmarkDashboardCard(){

    const totalCard = document.getElementById("totalQuestions");

    if(!totalCard) return;

    // Find the existing total-question card
    const existingCard = totalCard.closest(".stat-card, .total-card, .stats-card");

    if(!existingCard) return;

    // Prevent duplicate bookmark card
    if(document.getElementById("bookmarkPracticeCard")) return;

    const bookmarkCard = document.createElement("button");

    bookmarkCard.className = existingCard.className;
    bookmarkCard.id = "bookmarkPracticeCard";

    bookmarkCard.innerHTML = `
        <span class="stat-label">
            ★ Bookmarked Questions
        </span>
        
        <span class="stat-number" id="bookmarkCount">
            ${getBookmarkCount()}
        </span>
    `;

    // Put the bookmark card beside the existing total card
    existingCard.parentNode.insertBefore(
        bookmarkCard,
        existingCard.nextSibling
    );

    // Make the two cards sit beside each other
    existingCard.parentNode.classList.add("dashboard-stats");
}


// ---------- Start Bookmarked Practice ----------

async function startBookmarkedPractice(){

    const bookmarkedIds = getBookmarks();

    if(bookmarkedIds.length === 0) return;

    let questions = [];

    for(const topic of MCQ_CONFIG.topics){

        for(const sub of topic.subtopics){

            try{

                const data = await loadQuestionFile(
                    topic.folder,
                    sub.file
                );

                data.forEach(question => {

                    if(bookmarkedIds.includes(question.id)){

                        questions.push(question);

                    }

                });

            }catch(err){

                // Ignore question files that don't exist yet

            }

        }

    }

    if(questions.length === 0) return;

    startSession(
        "EEE MCQ Vault",
        "Bookmarked Questions",
        questions
    );

}


// ---------- Bookmark Dashboard Click ----------

document.addEventListener("click", function(e){

    if(e.target.closest("#bookmarkPracticeCard")){

        startBookmarkedPractice();

    }

});


// ---------- Refresh Bookmark Counter ----------

function refreshBookmarkCount(){

    const counter =
        document.getElementById("bookmarkCount");

    if(counter){

        counter.textContent = getBookmarkCount();

    }

}


// ---------- Override Bookmark Toggle ----------

const originalToggleBookmark = toggleBookmark;

toggleBookmark = function(id, element){

    originalToggleBookmark(id, element);

    refreshBookmarkCount();

};

// ======================================================
// BUILD 006D
// Browser / Phone Back Navigation
// ======================================================

let practiceHistoryActive = false;


// ---------- Enter Practice History ----------

function enterPracticeHistory(){

    if(practiceHistoryActive) return;

    history.pushState(
        { practice: true },
        "",
        "#practice"
    );

    practiceHistoryActive = true;

}


// ---------- Browser / Phone Back ----------

window.addEventListener("popstate", function(){

    if(practiceHistoryActive){

        practiceHistoryActive = false;

        document.getElementById("practiceScreen")
            .classList.add("hidden");

        document.getElementById("dashboard")
            .classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

});