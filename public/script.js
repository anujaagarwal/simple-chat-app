const socket = io();

        const messageForm = document.getElementById('chat-input'); // Updated this line
        const messageInput = document.getElementById('message-input');
        const chatMessages = document.getElementById('chat-messages');

        messageForm.addEventListener('click', (event) => { // Updated this line
            event.preventDefault(); // Prevent the form from submitting
            const message = messageInput.value;
            console.log(message)
            if (message.trim() !== '') {
                socket.emit('message', message);
                messageInput.value = '';
            }
        });

        socket.on('message', (message) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
        });