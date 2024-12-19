const socket = new WebSocket('ws://localhost:8080'); 

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.createElement('div');
const butterfly = document.getElementById('butterfly'); // Select the butterfly element

let isTyping = false;
let typingTimeout;

socket.onmessage = function(event) {
    const messageData = JSON.parse(event.data);
    if (messageData.typing) {
        typingIndicator.style.display = 'block';
    } else {
        typingIndicator.style.display = 'none';
        if (messageData.message) {
            displayMessage(messageData.message, messageData.sender === 'self');
        }
    }
};

sendButton.addEventListener('click', () => {
    sendMessage();
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        notifyTyping();
    }
});

function notifyTyping() {
    if (!isTyping) {
        isTyping = true;
        socket.send(JSON.stringify({ typing: true }));

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
            socket.send(JSON.stringify({ typing: false }));
        }, 1000);
    }
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;
    
    socket.send(JSON.stringify({ message, sender: 'self', typing: false }));
    
    displayMessage(message, true);
    
    messageInput.value = '';
    isTyping = false;
    socket.send(JSON.stringify({ typing: false }));

    triggerButterflyEffect(); // Trigger the butterfly effect
}

function displayMessage(message, isSelf) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (isSelf) {
        messageElement.classList.add('self');
    }
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Butterfly effect function
function triggerButterflyEffect() {
    butterfly.classList.add('animate'); // Add animation class

    // Remove the class after the animation completes
    setTimeout(() => {
        butterfly.classList.remove('animate');
    }, 2000); // Match the animation duration (2s)
}