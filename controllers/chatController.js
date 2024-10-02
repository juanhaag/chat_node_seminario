const { log } = require('console');
const crypto = require('crypto');


const encryptionKey = '12345678901234567890123456789012'; 
const algorithm = 'aes-256-ctr';

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex'); 
}

function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex'); // Extraer el IV
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    log(decrypted.toString());
    return decrypted.toString(); // Devolver el mensaje descifrado
}

module.exports = {
    encrypt,
    decrypt
};
