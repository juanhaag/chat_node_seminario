const messages = [];

function addMessage(user, message) {
    messages.push({ user, message, timestamp: new Date() });
}

function getMessages() {
    return messages;
}

module.exports = {
    addMessage,
    getMessages
};
