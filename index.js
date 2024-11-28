const fs = require('fs');
const { Worker, isMainThread, parentPort } = require('worker_threads');

// Leer las direcciones desde el archivo data.txt
const direcciones = fs.readFileSync('data.txt', 'utf8').split('\n').filter(line => line.trim() !== '');

// Número de hilos (puedes ajustar este valor según la capacidad de tu máquina)
const NUM_WORKERS = 4;

// Función para iniciar los trabajadores
function startWorkers() {
    // Dividir las direcciones en partes para distribuirlas entre los hilos
    const chunkSize = Math.ceil(direcciones.length / NUM_WORKERS);

    // Crear un worker por cada trozo de direcciones
    for (let i = 0; i < NUM_WORKERS; i++) {
        const chunk = direcciones.slice(i * chunkSize, (i + 1) * chunkSize);
        const worker = new Worker('./worker.js');

        // Pasar las direcciones a cada worker
        worker.postMessage(chunk);

        // Recibir el resultado de cada worker
        worker.on('message', (message) => {
            if (message.found) {
                console.log(`¡Dirección encontrada! ${message.privateKey}`);
            }
        });

        // Manejar errores de cada worker
        worker.on('error', (error) => {
            console.error('Error del worker:', error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker finalizó con código de error: ${code}`);
            }
        });
    }
}

// Iniciar los trabajadores
startWorkers();
