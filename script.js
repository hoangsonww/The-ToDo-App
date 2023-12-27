const form = document.getElementById("form");
const input = document.getElementById("input");
const todosUL = document.getElementById("todos");
const dueDateInput = document.getElementById("dueDate"); // Get the due date input element

const todos = JSON.parse(localStorage.getItem("todos"));

if (todos) {
    todos.forEach((todo) => {
        addTodo(todo);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo(); // Call addTodo when the form is submitted
});

document.getElementById("postButton").addEventListener("click", (e) => {
    e.preventDefault();
    addTodo();
});

document.getElementById('sortButton').addEventListener('click', sortTodos);

// Filter feature implementation
document.getElementById('filterAll').addEventListener('click', () => filterTodos('all'));
document.getElementById('filterActive').addEventListener('click', () => filterTodos('active'));
document.getElementById('filterCompleted').addEventListener('click', () => filterTodos('completed'));

function filterTodos(filter) {
    // Get all todo elements
    const todosEl = document.querySelectorAll('li');

    // Show/hide elements based on the filter
    todosEl.forEach(todoEl => {
        switch (filter) {
            case 'completed':
                if (todoEl.classList.contains('completed')) {
                    todoEl.style.display = '';
                } else {
                    todoEl.style.display = 'none';
                }
                break;
            case 'active':
                if (!todoEl.classList.contains('completed')) {
                    todoEl.style.display = '';
                } else {
                    todoEl.style.display = 'none';
                }
                break;
            default:
                todoEl.style.display = '';
        }
    });
}

function sortTodos() {
    // Get the todos from localStorage
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    // Sort todos by due date, putting todos without due date at the end
    todos.sort((a, b) => {
        if (!a.dueDate) return 1; // Puts todos without due date at the end
        if (!b.dueDate) return -1; // Puts todos without due date at the end
        return new Date(a.dueDate) - new Date(b.dueDate); // Compares dates
    });

    // Clear current todos in the DOM
    todosUL.innerHTML = '';

    // Re-add sorted todos to the DOM
    todos.forEach(todo => addTodo(todo));

    // Update localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(todo) {
    let todoText = input.value;
    let todoDueDate = dueDateInput.value;

    if (todo) {
        todoText = todo.text;
        todoDueDate = todo.dueDate;
    }

    if (todoText) {
        const todoEl = document.createElement("li");
        const textSpan = document.createElement("span");
        textSpan.className = 'todo-text';
        textSpan.textContent = todoText;

        const dueDateSpan = document.createElement("span");
        dueDateSpan.className = 'due-date';
        dueDateSpan.textContent = todoDueDate;

        // Create trash can icon
        const trashCan = document.createElement("span");
        trashCan.innerHTML = '&#128465;'; // Unicode for the trash can icon
        trashCan.className = 'trash-can';
        trashCan.title = 'Delete Todo';
        trashCan.style.color = 'red';
        trashCan.addEventListener('click', function() {
            todoEl.remove();
            updateLS();
        });

        // Create edit icon
        const editIcon = document.createElement("span");
        editIcon.innerHTML = '&#9998;'; // Unicode for the pencil icon
        editIcon.className = 'edit-icon';
        editIcon.title = 'Edit todo (press Enter to save)';
        editIcon.addEventListener('click', function() {
            const inputText = document.createElement('input');
            inputText.type = 'text';
            inputText.className = 'editable-input';
            inputText.value = textSpan.textContent;
            inputText.title = 'Press Enter to save';

            const inputDate = document.createElement('input');
            inputDate.type = 'date';
            inputDate.className = 'editable-date';
            inputDate.value = dueDateSpan.textContent;
            inputDate.title = 'Press Enter to save';

            textSpan.parentNode.replaceChild(inputText, textSpan);
            dueDateSpan.parentNode.replaceChild(inputDate, dueDateSpan);

            let saveTimeout;

            function saveEdits() {
                textSpan.textContent = inputText.value;
                dueDateSpan.textContent = inputDate.value;

                inputText.parentNode.replaceChild(textSpan, inputText);
                inputDate.parentNode.replaceChild(dueDateSpan, inputDate);

                updateLS();
            }

            inputText.addEventListener('blur', function() {
                // Set a timeout to allow interaction with the date picker
                saveTimeout = setTimeout(saveEdits, 100);
            });

            inputDate.addEventListener('blur', saveEdits);
            inputDate.addEventListener('click', function() {
                // Clear the timeout if the date picker is clicked
                clearTimeout(saveTimeout);
            });

            inputText.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    saveEdits();
                }
            });
        });

        if (todo && todo.highPriority) {
            todoEl.classList.add("high-priority");
        }

        todoEl.addEventListener("click", () => {
            todoEl.classList.toggle("completed");
            updateLS();
        });

        todoEl.addEventListener('mousedown', (e) => {
            if (e.ctrlKey) {
                // Ctrl+Click to toggle high priority
                e.preventDefault(); // Prevent default to allow for Ctrl+Click without triggering selection
                togglePriority(todoEl);
            }
        });

        // Append elements to todoEl
        todoEl.appendChild(textSpan);
        todoEl.appendChild(dueDateSpan);
        todoEl.appendChild(trashCan);
        todoEl.appendChild(editIcon);

        // Add todoEl to the DOM
        todosUL.appendChild(todoEl);

        // Reset the input fields
        input.value = '';
        dueDateInput.value = '';

        // Save the new todo to localStorage
        updateLS();
        updateProgressTracker();
    }
}

function updateLS() {
    const todosEl = document.querySelectorAll("li");
    const todos = [];

    todosEl.forEach((todoEl) => {
        const todoText = todoEl.querySelector('.todo-text').textContent;
        const todoDueDate = todoEl.querySelector('.due-date').textContent;

        todos.push({
            text: todoText,
            completed: todoEl.classList.contains("completed"),
            highPriority: todoEl.classList.contains('high-priority'),
            dueDate: todoDueDate,
        });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    updateProgressTracker();
}

function togglePriority(todoEl) {
    todoEl.classList.toggle('high-priority');
    updateLS();
}

// Chat interaction with delay
const chatInput = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-messages");

// Create the chatbot title
const chatTitleElem = document.createElement("div");
chatTitleElem.className = "chat-header chat-title";
chatTitleElem.innerText = "The ToDos Chatbot";
document.querySelector(".chatbot").prepend(chatTitleElem);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
        const question = e.target.value.trim();

        const userMsgElem = document.createElement("div");
        userMsgElem.innerText = `You: ${question}`;
        chatMessages.appendChild(userMsgElem);

        setTimeout(() => {
            const response = getElizaResponse(question);
            const elizaMsgElem = document.createElement("div");
            elizaMsgElem.innerText = `Eliza: ${response}`;
            chatMessages.appendChild(elizaMsgElem);
        }, 1000);

        e.target.value = '';
    }
});

function getElizaResponse(question) {
    question = question.toLowerCase();

    const responses = [
        { pattern: /hello|hi|hey/, response: "Hello! How can I assist you today?" },
        { pattern: /add todo|new todo/, response: "To add a new todo, type in the task and due date, then press Enter or click the Add button." },
        { pattern: /edit todo/, response: "Click the edit icon next to a todo to modify its text and due date." },
        { pattern: /complete todo/, response: "Click on a todo to mark it as complete. Completed tasks will have a line through them." },
        { pattern: /delete todo/, response: "Click the trash can icon next to a todo to delete it." },
        { pattern: /prioritize todo/, response: "Ctrl+Click on a todo to mark it as high priority. High priority tasks are highlighted." },
        { pattern: /sort todos/, response: "Click the Sort button to arrange todos by their due dates, with the closest dates first." },
        { pattern: /how to use the app/, response: "It's simple! Add a todo with the text field, set a due date, and then you can edit, prioritize, or delete it as needed." },
        { pattern: /can i set reminders/, response: "While the app currently doesn't have reminder alerts, you can sort todos by due date to keep track of upcoming tasks." },
        { pattern: /change theme/, response: "Currently, the app has a light and refreshing theme that's easy on the eyes, perfect for managing your todos!" },
        { pattern: /undo delete/, response: "Once a todo is deleted, it can't be undone. Make sure you want to remove it before using the delete option." },
        { pattern: /organize todos/, response: "You can organize your todos by due date using the sort feature or prioritize them with a Ctrl+Click." },
        { pattern: /find a todo/, response: "To find a specific todo, simply browse through your list or use the sort feature to arrange them." },
        { pattern: /are todos saved/, response: "All your todos are saved locally on your device, so you won't lose them even if you close the app." },
        { pattern: /export todos/, response: "You can keep a backup of your todos by using the Export feature, which saves them as a JSON file." },
        { pattern: /import todos/, response: "If you have a JSON file of todos, you can import it back into the app using the Import feature." },
        { pattern: /sync todos/, response: "Currently, there's no sync feature, but your todos are saved locally and available whenever you need them." },
        { pattern: /clear all todos/, response: "To clear all your todos, you'll have to manually delete them one by one for now." },
        { pattern: /app not working/, response: "If the app isn't working, try refreshing the page. If the issue persists, check for updates or report a bug." },
        { pattern: /report a bug/, response: "Found a bug? Let's squash it! Please report it with details so it can be addressed in future updates." },
        { pattern: /update the app/, response: "Updates are rolled out periodically. Stay tuned for new features and improvements!" },
        { pattern: /make a suggestion/, response: "Your suggestions are valuable! Feel free to share your ideas for new features or improvements." },
        { pattern: /help with the app/, response: "Need help? Check out the Help section for a guide on using the app, or ask me if you have specific questions." },
        { pattern: /what's new in the app/, response: "We're always improving. Check the 'What's New' section in the settings for the latest features!" },
        { pattern: /forgot my task/, response: "If you've forgotten a task, try looking through the list or sorting by due date for a reminder." },
        { pattern: /color code todos/, response: "Color coding isn't available yet, but you can prioritize tasks to make them stand out." },
        { pattern: /print my todos/, response: "Sure, you can print your todos. Just use the Print option in your browser while on the app page." },
        { pattern: /change font size/, response: "Font size customization is in the works. Stay tuned for this feature in upcoming updates!" },
        { pattern: /add notes to todos/, response: "Adding notes to your todos is a planned feature. Look out for it in future releases!" },
        { pattern: /recurring todos/, response: "Recurring todos are a great idea! We're considering adding this in a future update." },
        { pattern: /backup my todos/, response: "It's smart to back up! Use the Export option to save your todos externally." },
        { pattern: /where is my data stored/, response: "Your data is stored locally on your device for your privacy and convenience." },
        { pattern: /access todos on another device/, response: "Currently, there's no cross-device functionality, but we're exploring cloud sync options." },
        { pattern: /customize app appearance/, response: "Customization options are limited now, but we plan to offer more ways to personalize your app experience soon." },
        { pattern: /set deadlines/, response: "You can set a due date for each todo to keep track of deadlines." },
        { pattern: /app is slow/, response: "If the app is running slow, try clearing your browser cache or restarting the app." },
        { pattern: /can't add todo/, response: "If you're having trouble adding a todo, make sure you're entering text before hitting the Add button." },
        { pattern: /edit multiple todos/, response: "Batch editing isn't available yet, but it's something we might consider for the future." },
        { pattern: /change task order/, response: "To reorder tasks, you currently need to sort them by due date or manually adjust them." },
        { pattern: /completed todos/, response: "Completed todos are marked and can be sorted to the bottom or top of your list for better organization." },
        { pattern: /secure my todos/, response: "Your todos are stored securely on your device, and we do not have access to them." },
        { pattern: /automate task entry/, response: "Automation features are on our roadmap. We're excited about the possibilities!" },
        { pattern: /app tutorial/, response: "Looking for a tutorial? Check out the Help section for step-by-step guidance." },
        { pattern: /multiple lists/, response: "Creating multiple lists or categories is a feature we're considering. Keep an eye out for updates!" },
        { pattern: /share my list/, response: "Sharing isn't built in yet, but you can export your list and send the file to others." },
        { pattern: /notifications/, response: "Notifications are not supported at the moment, but we're looking into adding them in a future version." },
        { pattern: /night mode/, response: "A darker night mode for the app is a popular request. We're working on implementing it soon." },
        { pattern: /collaborative features/, response: "Collaborative features for team use are in development. We can't wait to share them with you!" },

        // Default response
        { pattern: /.*/, response: "I'm not sure about that. Can you be more specific or ask another question?" }
    ];

    for (let i = 0; i < responses.length; i++) {
        let match = question.match(responses[i].pattern);
        if (match) {
            if (match[1] && match[2]) {
                // Handle creation of a new note if the pattern matches
                addNewNote(match[2]); // Add the note with the captured content
                return responses[i].response.replace('{title}', match[1]).replace('{content}', match[2]);
            }
            return responses[i].response;
        }
    }
    return "Sorry, I didn't get that. Could you please rephrase or ask another question?";
}

// Creating the chatbot's maximize/minimize button
const toggleButton = document.createElement("button");
toggleButton.innerText = "-";
toggleButton.className = "toggle-chat";
toggleButton.title="Minimize/Maximize Chatbot";
toggleButton.onclick = function() {
    const chatMessagesElem = document.querySelector(".chat-messages");
    const chatInputElem = document.querySelector(".chat-input");

    if (chatMessagesElem.style.display === "none") {
        chatMessagesElem.style.display = "";
        chatInputElem.style.display = "";
        toggleButton.innerText = "-";
    } else {
        chatMessagesElem.style.display = "none";
        chatInputElem.style.display = "none";
        toggleButton.innerText = "+";
    }
};

const chatHeaderElem = document.querySelector(".chat-header");
chatHeaderElem.appendChild(toggleButton);

// Initially showing only header
const chatMessagesElem = document.querySelector(".chat-messages");
const chatInputElem = document.querySelector(".chat-input");
chatMessagesElem.style.display = "none";
chatInputElem.style.display = "none";

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}:${seconds}`;
}

// Initialize the clock
updateClock();

// Update the clock every second
setInterval(updateClock, 1000);

// Global quick task counter
let quickTaskCounter = JSON.parse(localStorage.getItem("quickTaskCounter")) || 0;

document.getElementById('quickAddTask').addEventListener('click', () => {
    quickTaskCounter++;
    localStorage.setItem("quickTaskCounter", JSON.stringify(quickTaskCounter)); // Save the new counter
    quickAddTask(`Quick Task ${quickTaskCounter}`);
});

function quickAddTask(taskName) {
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7));
    const dueDate = nextWeek.toISOString().split('T')[0]; // Format YYYY-MM-DD

    addTodo({
        text: taskName,
        completed: false,
        highPriority: true,
        dueDate: dueDate
    });
}

const moodTips = {
    Happy: "Remember what made you happy and try to include it in your daily routine!",
    Motivated: "Channel your motivation into setting clear goals for the day.",
    Stressed: "Take deep breaths, and consider short breaks or walks to manage stress.",
    Neutral: "Maintaining a neutral mood is great. Consider planning your next activity!",
    Sad: "It's okay to feel sad. Reach out to someone you trust or engage in an activity you enjoy."
};

// Reference to the mood select element
const moodSelect = document.getElementById('moodSelect');
// Reference to the mood tips container and paragraph
const moodTipsContainer = document.getElementById('moodTipsContainer');
const moodTipParagraph = document.getElementById('moodTip');

moodSelect.addEventListener('change', (e) => {
    const mood = e.target.value;
    const tip = moodTips[mood];

    moodTipParagraph.textContent = tip; // Set the mood tip text
    moodTipsContainer.style.display = 'block'; // Show the tips container
});

// Close the popover when clicked outside
document.getElementById('dismissTip').addEventListener('click', () => {
    moodTipsContainer.style.display = 'none'; // Hide the tips container
});

document.getElementById('aboutButton').addEventListener('click', function() {
    window.location.href = 'about.html'; // Make sure the path to about.html is correct
});

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleButton = document.getElementById('themeToggleButton');
    const bodyElement = document.body;

    themeToggleButton.addEventListener('click', function () {
        bodyElement.classList.toggle('dark-mode');
        if (bodyElement.classList.contains('dark-mode')) {
            localStorage.setItem('TodoTheme', 'dark');
        }
        else {
            localStorage.setItem('TodoTheme', 'light');
        }
    });

    const savedTheme = localStorage.getItem('TodoTheme');
    if (savedTheme === 'dark') {
        bodyElement.classList.add('dark-mode');
    }
});

function updateProgressTracker() {
    const totalTasks = document.querySelectorAll("li").length;
    const completedTasks = document.querySelectorAll("li.completed").length;
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    const progressBar = document.querySelector(".progress");
    const progressInfo = document.querySelector(".progress-info");

    progressBar.style.width = `${progressPercentage}%`;
    progressInfo.textContent = `${completedTasks} / ${totalTasks} tasks completed`;
}

let timerInterval;
let timeLeft;
let defaultTime = 25 * 60;

document.getElementById('timer-start').addEventListener('click', function() {
    clearInterval(timerInterval);
    if (timeLeft > 0) {
        timerInterval = setInterval(updateTimer, 1000);
    }
});

document.getElementById('timer-reset').addEventListener('click', function() {
    clearInterval(timerInterval);
    timeLeft = defaultTime;
    updateTimerDisplay();
});

document.getElementById('timer-minutes').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setCustomTimer();
    }
});

document.getElementById('timer-seconds').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setCustomTimer();
    }
});

document.getElementById('timer-set-button').addEventListener('click', setCustomTimer);

function setCustomTimer() {
    const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;
    defaultTime = timeLeft = (minutes * 60) + seconds;
    updateTimerDisplay();
}

function updateTimer() {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft === 0) {
        clearInterval(timerInterval);
        playSound();
        setTimeout(() => {
            alert('Good job! Focus period complete - You can now take a quick rest.');
        }, 100); // Delay the alert slightly to ensure sound plays first
        timeLeft = defaultTime; // Reset timer
    }
}

function playSound() {
    var audio = new Audio('timer-sound.mp3');
    audio.play();
}

function resetTimer() {
    timeLeft = defaultTime;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

resetTimer();
updateTimerDisplay();