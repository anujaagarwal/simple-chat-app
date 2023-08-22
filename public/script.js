const socket = io();
const sendButton = document.getElementById('sendButton'); // Updated this line
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const emojiMap = {
    "react": "⚛️",
    "woah": "😲",
    "hey": "👋",
    "lol": "😂",
    "like": "🤍",
    "congratulations": "🎉",
  };

sendButton.addEventListener('click', () => { // Updated this line
    const message = messageInput.value;
    console.log(message)
    if (message.startsWith('/')) {
        handleSlashCommand(message);

    } else {
        socket.emit('message', handleEmojiReplacement(message));
    }

    messageInput.value = ''

});

socket.on('message', (message) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    if (message.sender === socket.id) {
        messageElement.classList.add('outgoing');
    } else {
        messageElement.classList.add('incoming');
    }
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
});

function handleEmojiReplacement(message) {
    let replacedMessage = message;
        for (const emojiCode in emojiMap) {
            if (emojiMap.hasOwnProperty(emojiCode)) {
                const emojiIcon = emojiMap[emojiCode];
                const regex = new RegExp(escapeRegExp(emojiCode), 'gi'); // Create case-insensitive regex
                replacedMessage = replacedMessage.replace(regex, emojiIcon);
                console.log(replacedMessage)
            }
        }
        return replacedMessage;

}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}


function handleSlashCommand(command) {
    const parts = command.split(' ');
    const action = parts[0].toLowerCase();

    switch (action) {
        case '/help':
            showHelpDialog();
            break;
        case '/random':
            const randomValue = Math.floor(Math.random() * 100);
            addMessageToChat(`Random number: ${randomValue}`);
            break;
        case '/clear':
            clearChat();
            break;
        default:
            addMessageToChat('Unknown command. Type /help for help.');
            break;
    }
}

function addMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
}


function showHelpDialog() {
    const helpMessage = "Welcome to the chat! Available commands:\n\n/help - Show this guide\n/random - Get a random number\n/clear - Clears the chat";
    alert(helpMessage);
}

function clearChat() {
    chatMessages.innerHTML = '';
}