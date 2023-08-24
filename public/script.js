document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let username = null;

    while (!username) {
        username = prompt("Please enter your username:");
    }

    // Emit a user-joined message when a new user connects
    socket.emit('userJoined', username);  


    
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




    function sendMessage(){
            const message = messageInput.value;
            console.log(message)
            if (message.startsWith('/')) {
                handleSlashCommand(message);
        
            } else if (message.trim() !== ''){
                socket.emit('message', handleEmojiReplacement(message));
            }
        
            messageInput.value = ''

    }

    sendButton.addEventListener ('click', () => {
        sendMessage();
    });

    // Trigger sendMessage when "Enter" key is pressed in the message input
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior of "Enter" key
            sendMessage();
        }
    });

    socket.on('message', (message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        if (message.sender === socket.id) {
            messageElement.classList.add('outgoing');
        } else {
            messageElement.classList.add('incoming');
        }

        const usernameElement = document.createElement('div');
        usernameElement.className = 'username';
        usernameElement.textContent = username;

        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = message;
        
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(textElement);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    function handleEmojiReplacement(message) {
        let replacedMessage = message;
            for (const emojiCode in emojiMap) {
                if (emojiMap.hasOwnProperty(emojiCode)) {
                    const emojiIcon = emojiMap[emojiCode];
                    const regex = new RegExp(`\\b${emojiCode}\\b`, 'gi'); // Create case-insensitive regex
                    replacedMessage = replacedMessage.replace(regex, emojiIcon);
                    console.log(replacedMessage)
                }
            }
            return replacedMessage;

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
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    function showHelpDialog() {
        const helpMessage = "Welcome to the chat! Available commands:\n\n/help - Show this guide\n/random - Get a random number\n/clear - Clears the chat";
        alert(helpMessage);
    }

    function clearChat() {
        chatMessages.innerHTML = '';
    }

    function displaySystemMessage(message) {
        const systemMessageElement = document.createElement('div');
        systemMessageElement.className = 'system-message';
        systemMessageElement.textContent = message;
        chatMessages.appendChild(systemMessageElement);
    }

    socket.on('userJoined', (username) => {
        displaySystemMessage(username);
    });
});