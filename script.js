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
        trashCan.addEventListener('click', function() {
            todoEl.remove();
            updateLS();
        });

        // Create edit icon
        const editIcon = document.createElement("span");
        editIcon.innerHTML = '&#9998;'; // Unicode for the pencil icon
        editIcon.className = 'edit-icon';
        editIcon.title = 'Edit Todo';
        editIcon.addEventListener('click', function() {
            const inputText = document.createElement('input');
            inputText.type = 'text';
            inputText.className = 'editable-input';
            inputText.value = textSpan.textContent;

            const inputDate = document.createElement('input');
            inputDate.type = 'date';
            inputDate.className = 'editable-date';
            inputDate.value = dueDateSpan.textContent;

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
        }, 1000); // 1-second delay

        e.target.value = '';
    }
});

function getElizaResponse(question) {
    question = question.toLowerCase();

    const responses = [
        { pattern: /hello|hi|hey/, response: "Hello! How can I assist you today?" },
        { pattern: /how does this app work/, response: "This app allows you to create, edit, and manage sticky notes." },
        { pattern: /who created this app/, response: "The app was created by David Nguyen in 2023." },
        { pattern: /thank you|thanks/, response: "You're welcome! If you have more questions, just ask." },
        { pattern: /dark mode/, response: "Click the 'Toggle Dark Mode' button to switch between themes." },
        { pattern: /export notes/, response: "You can export your notes by clicking the 'Export Notes' button. It'll save as a JSON file." },
        { pattern: /import notes/, response: "Click on the 'Choose Files' button to select and upload your notes." },
        { pattern: /how are you/, response: "I'm a computer program, so I don't have feelings, but I'm operating at full capacity. How can I help?" },
        { pattern: /what can you do/, response: "I'm here to answer your questions about the app. Just ask away!" },
        { pattern: /create note|new note/, response: "To create a new note, click on the 'New Note' button and start typing." },
        { pattern: /delete note/, response: "You can delete a note by selecting it and clicking the 'Delete' button." },
        { pattern: /edit note/, response: "Simply click on a note to start editing its content." },
        { pattern: /save note/, response: "Your notes are saved automatically once you stop typing." },
        { pattern: /lost note|recover note/, response: "If you've exported your notes previously, you can re-import them. Otherwise, deleted notes cannot be recovered." },
        { pattern: /how many notes/, response: "You can have as many notes as you like in the app. There's no set limit!" },
        { pattern: /search note/, response: "Use the search bar at the top of the app to find specific notes by their content." },
        { pattern: /shortcut|keyboard shortcut/, response: "Use 'Ctrl + N' for a new note, 'Ctrl + S' to save, and 'Ctrl + D' to delete a note." },
        { pattern: /share note/, response: "Currently, this app doesn't support direct note sharing. You can export and send the JSON file manually." },
        { pattern: /cloud|sync/, response: "We don't have cloud syncing at the moment, but it's a feature we're considering for future versions." },
        { pattern: /security|privacy/, response: "Your notes are stored locally on your device. We don't access or store them on any external servers." },
        { pattern: /can i customize/, response: "At the moment, customization is limited to dark and light themes. We're working on more personalization features!" },
        { pattern: /feedback|suggestion/, response: "We appreciate feedback and suggestions! There's a 'Feedback' button in the settings where you can submit yours." },
        { pattern: /language|translate/, response: "Currently, the app is in English only, but multi-language support is in our roadmap." },
        { pattern: /update|new version/, response: "Keep an eye on the 'Updates' section in settings for any new versions or features." },
        { pattern: /bug|issue/, response: "Sorry for the inconvenience. Please report any bugs through the 'Feedback' section so we can address them." },
        { pattern: /cost|price/, response: "The basic version of the app is free, but there might be premium features available for purchase in the future." },
        { pattern: /tutorial|guide/, response: "There's a 'Help' section in the app that provides a step-by-step guide on how to use the various features." },
        { pattern: /favorite note|bookmark/, response: "You can 'star' or mark your favorite notes to easily find them later in the 'Favorites' section." },
        { pattern: /search notes/, response: "You can use the search bar at the top to quickly find any note by its content or title." },
        { pattern: /collaborate|team/, response: "The current version doesn't support real-time collaboration. It's a feature we might consider in the future." },
        { pattern: /notification|alert/, response: "You can set reminders for your notes. Once set, you'll receive notifications at the specified time." },
        { pattern: /voice command|voice activation/, response: "Voice commands are not supported currently, but it's an interesting idea for future versions!" },
        { pattern: /offline/, response: "Yes, the app works offline. Any changes you make will be synced when you go online next." },
        { pattern: /backup/, response: "It's a good practice to regularly export and back up your notes. This ensures you don't lose any important information." },
        { pattern: /limit|maximum notes/, response: "There's no set limit to the number of notes you can create. However, device storage can be a limiting factor." },
        { pattern: /tags|categories/, response: "Yes, you can categorize your notes using tags. This helps in organizing and quickly accessing related notes." },
        { pattern: /mobile|tablet/, response: "The app is optimized for both desktop and mobile devices. You'll have a seamless experience across all devices." },
        { pattern: /attachment|image/, response: "You can attach images or files to your notes. Just click on the 'Add Attachment' button when editing a note." },
        { pattern: /lost notes|recovery/, response: "If you've exported and backed up your notes, you can easily recover them using the import function." },
        { pattern: /fonts|text style/, response: "While the current version offers a standard font, we're considering font customization options in the future." },
        { pattern: /printing/, response: "Yes, you can print your notes directly from the app. Just open the note and click on the 'Print' option." },
        { pattern: /create note titled (.*) with content (.*)/, response: "Creating note titled '{title}' with content '{content}'..." },

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