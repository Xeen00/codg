// Aufgabenliste
const tasksData = [
    { name: 'Milchschokolade', value: 10000, duration: 5, criticality: 'hoch', delayCost: 2 },
    { name: 'Zartbitterschokolade', value: 15000, duration: 10, criticality: 'mittel', delayCost: 1 },
    { name: 'Pralinen', value: 25000, duration: 15, criticality: 'hoch', delayCost: 2 },
    { name: 'Weiße Schokolade', value: 8000, duration: 5, criticality: 'niedrig', delayCost: 0 },
    { name: 'Nougat-Riegel', value: 12000, duration: 8, criticality: 'mittel', delayCost: 1 },
    { name: 'Karamell-Bonbons', value: 9000, duration: 7, criticality: 'niedrig', delayCost: 0 },
    { name: 'Erdnuss-Schokoriegel', value: 14000, duration: 9, criticality: 'hoch', delayCost: 2 },
    { name: 'Marzipan-Brote', value: 11000, duration: 6, criticality: 'mittel', delayCost: 1 },
    { name: 'Fruchtgummi-Mischung', value: 7000, duration: 4, criticality: 'niedrig', delayCost: 0 },
    { name: 'Lakritz-Schnecken', value: 6000, duration: 3, criticality: 'niedrig', delayCost: 0 },
    { name: 'Schoko-Kekse', value: 13000, duration: 8, criticality: 'mittel', delayCost: 1 },
    { name: 'Mandel-Schokolade', value: 16000, duration: 10, criticality: 'hoch', delayCost: 2 },
    { name: 'Minz-Schokolade', value: 9000, duration: 5, criticality: 'niedrig', delayCost: 0 },
    { name: 'Trüffel-Pralinen', value: 20000, duration: 12, criticality: 'hoch', delayCost: 2 },
    { name: 'Erdbeer-Riegel', value: 8500, duration: 6, criticality: 'mittel', delayCost: 1 },
];

let tasks = [];
let selectedTasks = [];

// Elemente aus dem DOM
const startButton = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');
const tasksDiv = document.getElementById('tasks');
const selectedDiv = document.getElementById('selected');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');

// Spiel starten
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    gameContainer.style.display = 'flex';
    calculateButton.style.display = 'inline';
    tasks = [...tasksData];
    renderTasks();
});

// Aufgaben anzeigen
function renderTasks() {
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <strong>${task.name}</strong><br>
            Wert: ${task.value}€<br>
            Dauer: ${task.duration} Min.<br>
            Kritikalität: ${task.criticality}
        `;
        taskEl.addEventListener('click', () => selectTask(index));
        tasksDiv.appendChild(taskEl);
    });
}

// Aufgabe auswählen
function selectTask(index) {
    selectedTasks.push(tasks[index]);
    tasks.splice(index, 1);
    renderTasks();
    renderSelectedTasks();
}

// Gewählte Aufgaben anzeigen
function renderSelectedTasks() {
    selectedDiv.innerHTML = '';
    selectedTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <strong>${task.name}</strong><br>
            Wert: ${task.value}€<br>
            Dauer: ${task.duration} Min.<br>
            Kritikalität: ${task.criticality}
        `;
        selectedDiv.appendChild(taskEl);
    });
}

// Ergebnis berechnen
calculateButton.addEventListener('click', () => {
    let totalValue = 0;
    let totalDelayCost = 0;
    let currentTime = 0;

    selectedTasks.forEach(task => {
        currentTime += task.duration;
        totalValue += task.value;
        if (task.delayCost > 0) {
            const delay = currentTime - task.duration;
            totalDelayCost += delay * task.delayCost;
        }
    });

    const netProfit = totalValue - totalDelayCost;

    resultDiv.innerHTML = `
        <h2>Ergebnis</h2>
        <p>Gesamtwert der produzierten Produkte: ${totalValue}€</p>
        <p>Verzögerungskosten: ${totalDelayCost}€</p>
        <p><strong>Nettogewinn: ${netProfit}€</strong></p>
    `;
});
