const { Worker, parentPort } = require('worker_threads');
const { Keypair } = require('@solana/web3.js');

// Función para generar claves privadas aleatorias y verificar si coinciden con las direcciones proporcionadas
function generarYVerificarWallet(direcciones) {
    // Generar una clave privada aleatoria
    const keypair = Keypair.generate();
    const privateKey = keypair.secretKey.toString('hex'); // Clave privada en formato hexadecimal
    const publicKey = keypair.publicKey.toString(); // Dirección pública (wallet)

    // Verificar si la dirección generada coincide con alguna en las direcciones proporcionadas
    for (const direccion of direcciones) {
        if (publicKey === direccion.trim()) {
            // Si la dirección coincide, devolver la clave privada
            parentPort.postMessage({ found: true, privateKey });
            return;
        }
    }

    // Si no se encuentra ninguna coincidencia, continuar buscando
    parentPort.postMessage({ found: false });
}

// Recibir las direcciones desde el hilo principal
parentPort.on('message', (direcciones) => {
    generarYVerificarWallet(direcciones);
});
