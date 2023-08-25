document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let username = null;
    const valuesMap = {}; // Store the values
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
            let message = messageInput.value;
            console.log(message)
            if (message.startsWith('/')) {
                handleSlashCommand(message);
        
            } else if (message.trim() !== ''){
                message = handleEmojiReplacement(message)
                socket.emit('message', {username, message});
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

    socket.on('message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        if (data.message.sender === socket.id) {
            messageElement.classList.add('outgoing');
        } else {
            messageElement.classList.add('incoming');
        }

        const usernameElement = document.createElement('div');
        usernameElement.className = 'username';
        usernameElement.textContent = data.username;

        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = data.message;
        
        messageElement.appendChild(usernameElement);
        messageElement.appendChild(textElement);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });


    socket.on('storeValue', (data) => {
        displaySystemMessage(`${data.name}: ${data.value} stored by ${data.username}`);
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
            case '/rem':
                const name = parts[1];
                if (parts.length === 2) {
                    // Recall value
                    const value = valuesMap[name];
                    if (value !== undefined) {
                        addMessageToChat(`Value for ${name}: ${value}`);
                    } else {
                        addMessageToChat(`Value for ${name} not found.`);
                    }
                } else if (parts.length >= 3) {
                    // Set value
                    const value = parts.slice(2).join(' ');
                    socket.emit('storeValue', { username, name, value });
                    valuesMap[name] = value;
                    addMessageToChat(`Value ${value} set for ${name}.`);
                } else {
                    addMessageToChat('Invalid /rem command. Usage: /rem <name> <value>');
                }
                break;
            case '/calc':
                if (parts.length === 2) {
                    const expression = parts[1];
                    try {
                        const result = eval(expression); // Using eval for simplicity (caution: security risk)
                        addMessageToChat(`Result: ${expression} = ${result}`);
                    } catch (error) {
                        addMessageToChat('Error in calculation. Please check your expression.');
                    }
                } else {
                    addMessageToChat('Invalid /calc command. Usage: /calc <expression>');
                }
                break
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
        const helpMessage = "Welcome to the chat! Available commands:\n\n/help - Show this guide\n/random - Get a random number\n/clear - Clears the chat\n/rem <name> <value> - Sets and stores the value assigned to the name\n/calc <expression> - Acts as a calculator";
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


    

    socket.on('onlineUsers', (count) => {
        updateOnlineUserCount(count);
    });

    function updateOnlineUserCount(count) {
        const onlineUsersElement = document.getElementById('online-users');
        onlineUsersElement.textContent = `Online Users: ${count}`;
    }
});