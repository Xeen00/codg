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

// Kapazitätslimit (z. B. maximale Gesamtdauer in Minuten)
const capacityLimit = 30; // Gesamtminuten, die für Produktion verfügbar sind
let usedCapacity = 0;

// Elemente aus dem DOM
const startButton = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');
const tasksDiv = document.getElementById('tasks');
const selectedDiv = document.getElementById('selected');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const capacityInfo = document.getElementById('capacity-info');

// Spiel starten
startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    gameContainer.style.display = 'flex';
    calculateButton.style.display = 'inline';
    tasks = [...tasksData];
    usedCapacity = 0;
    selectedTasks = [];
    updateCapacityInfo();
    renderTasks();
    renderSelectedTasks();
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
        // Wenn Kapazität überschritten würde, Aufgabe deaktivieren
        if (usedCapacity + task.duration > capacityLimit) {
            taskEl.classList.add('disabled');
        } else {
            taskEl.addEventListener('click', () => selectTask(index));
        }
        tasksDiv.appendChild(taskEl);
    });
}

// Aufgabe auswählen
function selectTask(index) {
    const task = tasks[index];
    if (usedCapacity + task.duration <= capacityLimit) {
        selectedTasks.push(task);
        tasks.splice(index, 1);
        usedCapacity += task.duration;
        updateCapacityInfo();
        renderTasks();
        renderSelectedTasks();
    } else {
        alert('Kapazitätslimit erreicht! Sie können diese Aufgabe nicht hinzufügen.');
    }
}

// Gewählte Aufgaben anzeigen
function renderSelectedTasks() {
    selectedDiv.innerHTML = '';
    selectedTasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <strong>${task.name}</strong><br>
            Wert: ${task.value}€<br>
            Dauer: ${task.duration} Min.<br>
            Kritikalität: ${task.criticality}
        `;
        taskEl.addEventListener('click', () => deselectTask(index));
        selectedDiv.appendChild(taskEl);
    });
}

// Aufgabe abwählen
function deselectTask(index) {
    const task = selectedTasks[index];
    selectedTasks.splice(index, 1);
    tasks.push(task);
    usedC
