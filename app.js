const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const chatRoutes = require('./routes/chatRoutes');
const CryptoJS = require('crypto-js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));
app.use('/', chatRoutes);

const encryptionKey = '12345678901234567890123456789012';

function encrypt(plainText) {
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);
    const iv = CryptoJS.lib.WordArray.random(16); 

    const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv: iv });

    const ivHex = iv.toString(CryptoJS.enc.Hex);
    const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    const encryptedMessage = ivHex + ':' + encryptedHex;
    return encryptedMessage;
}

wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);

        try {
            const data = JSON.parse(message); 
            const plainText = data.message;
            const encryptedMessage = encrypt(plainText);
            console.log('Mensaje cifrado:', encryptedMessage);

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ message: encryptedMessage }));
                }
            });
        } catch (error) {
            console.error('Error al procesar el mensaje:', error);
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`localhost: ${PORT}`);
});
