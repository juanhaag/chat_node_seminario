const ws = new WebSocket('ws://localhost:3000');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');

// Clave de cifrado 
const encryptionKey = '12345678901234567890123456789012';

function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const ivHex = parts.shift();
    const encryptedHex = parts.join(':');

    console.log('IV (Hex):', ivHex);
    console.log('Texto cifrado (Hex):', encryptedHex);

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);

    console.log('Clave de cifrado:', key.toString(CryptoJS.enc.Hex));

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        key,
        { iv: iv }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('Texto descifrado:', decryptedText);
    return decryptedText;
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        ws.send(JSON.stringify({ message }));
        messageInput.value = '';
    }
});

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        const decryptedMessage = decrypt(data.message);
        console.log('Mensaje descifrado:', decryptedMessage);
        const newMessage = document.createElement('div');
        newMessage.textContent = `Mensaje recibido: ${decryptedMessage}`;
        messagesDiv.appendChild(newMessage);
    } catch (error) {
        console.error('Error al procesar el mensaje recibido:', error);
    }
};
