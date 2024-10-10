const tasksData = [
    { name: 'Premium-Pralinen', value: 25000, duration: 5, criticality: 'hoch', delayCost: 1000 },
    { name: 'Schoko-Riegel', value: 10000, duration: 3, criticality: 'mittel', delayCost: 500 },
    { name: 'Fruchtbonbons', value: 5000, duration: 2, criticality: 'niedrig', delayCost: 0 },
    { name: 'Karamell-Toffees', value: 7500, duration: 2, criticality: 'mittel', delayCost: 500 },
    { name: 'Nougat-Trüffel', value: 15000, duration: 4, criticality: 'hoch', delayCost: 1000 },
    { name: 'Gummibärchen', value: 3000, duration: 1, criticality: 'niedrig', delayCost: 0 },
    { name: 'Lakritz-Stangen', value: 4000, duration: 1, criticality: 'niedrig', delayCost: 0 },
    { name: 'Mandel-Schokolade', value: 12000, duration: 3, criticality: 'mittel', delayCost: 500 },
    { name: 'Pfefferminz-Schokolade', value: 8000, duration: 2, criticality: 'niedrig', delayCost: 0 },
    { name: 'Erdbeer-Pralinen', value: 18000, duration: 5, criticality: 'hoch', delayCost: 1000 },
];

const goals = [
    { description: 'Erreiche einen Nettogewinn von mindestens 45.000 €', achieved: false },
    { description: 'Verzögerungskosten dürfen nicht höher als 7.000 € sein', achieved: false },
    { description: 'Produziere mindestens ein Produkt mit hoher Kritikalität', achieved: false },
    { description: 'Die Gesamtdauer darf 15 Stunden nicht überschreiten', achieved: false },
];

let tasks = [];
let selectedTasks = [];

const capacityLimit = 15;
let usedCapacity = 0;

const startButton = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');
const tasksDiv = document.getElementById('tasks');
const selectedDiv = document.getElementById('selected');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');
const capacityInfo = document.getElementById('capacity-info');
const goalList = document.getElementById('goal-list');
const goalsDiv = document.getElementById('goals');

updateGoalList();

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    gameContainer.style.display = 'flex';
    calculateButton.style.display = 'inline';
    tasks = [...tasksData];
    usedCapacity = 0;
    selectedTasks = [];
    resetGoals();
    updateCapacityInfo();
    renderTasks();
    renderSelectedTasks();

    if (window.resultChart) {
        window.resultChart.destroy();
    }
    resultDiv.innerHTML = '';
});

function resetGoals() {
    goals.forEach(goal => goal.achieved = false);
    updateGoalList();
}

function updateGoalList() {
    goalList.innerHTML = '';
    goals.forEach(goal => {
        const goalItem = document.createElement('li');
        goalItem.textContent = goal.description;
        goalItem.style.color = goal.achieved ? 'green' : 'black';
        goalList.appendChild(goalItem);
    });
}

function checkGoals(netProfit, totalDelayCost, selectedTasks, currentTime) {
    if (netProfit >= 45000) {
        goals[0].achieved = true;
    }
    if (totalDelayCost <= 7000) {
        goals[1].achieved = true;
    }
    if (selectedTasks.some(task => task.criticality === 'hoch')) {
        goals[2].achieved = true;
    }
    if (currentTime <= 15) {
        goals[3].achieved = true;
    }
    updateGoalList();
}

function renderTasks() {
    tasksDiv.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <strong>${task.name}</strong><br>
            Wert: ${task.value}€<br>
            Dauer: ${task.duration} Stunden<br>
            Kritikalität: ${task.criticality}
        `;
        if (usedCapacity + task.duration > capacityLimit) {
            taskEl.classList.add('disabled');
        } else {
            taskEl.addEventListener('click', () => selectTask(index));
        }
        tasksDiv.appendChild(taskEl);
    });
}

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

function renderSelectedTasks() {
    selectedDiv.innerHTML = '';
    selectedTasks.forEach((task, index) => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.innerHTML = `
            <strong>${task.name}</strong><br>
            Wert: ${task.value}€<br>
            Dauer: ${task.duration} Stunden<br>
            Kritikalität: ${task.criticality}
        `;
        taskEl.addEventListener('click', () => deselectTask(index));
        selectedDiv.appendChild(taskEl);
    });
}

function deselectTask(index) {
    const task = selectedTasks[index];
    selectedTasks.splice(index, 1);
    tasks.push(task);
    usedCapacity -= task.duration;
    updateCapacityInfo();
    renderTasks();
    renderSelectedTasks();
}

function updateCapacityInfo() {
    capacityInfo.innerHTML = `Genutzte Kapazität: ${usedCapacity} / ${capacityLimit} Stunden`;
}

calculateButton.addEventListener('click', () => {
    let totalValue = 0;
    let totalDelayCost = 0;
    let currentTime = 0;

    let productNames = [];
    let cumulativeTimes = [];
    let delayCosts = [];

    let timeLabels = [];
    let cumulativeProfit = [];
    let cumulativeCost = [];
    let tasksCompletionTimes = [];
    let tasksStartTimes = [];
    let profitAtTime = [];
    let costAtTime = [];

    selectedTasks.forEach((task, index) => {
        let startTime = currentTime;
        currentTime += task.duration;
        let endTime = currentTime;

        totalValue += task.value;

        productNames.push(task.name);
        cumulativeTimes.push(endTime);
        tasksStartTimes.push(startTime);
        tasksCompletionTimes.push(endTime);

        profitAtTime.push({ time: endTime, value: task.value });
    });

    for (let t = 1; t <= currentTime; t++) {
        timeLabels.push(t);
    }

    let accumulatedProfit = 0;
    let accumulatedCost = 0;

    for (let t = 1; t <= currentTime; t++) {
        let profitEvents = profitAtTime.filter(event => event.time === t);
        profitEvents.forEach(event => {
            accumulatedProfit += event.value;
        });
        cumulativeProfit.push(accumulatedProfit);

        let delayCostThisHour = 0;
        selectedTasks.forEach((task, index) => {
            if (task.delayCost > 0 && t < tasksStartTimes[index] + 1) {
                delayCostThisHour += task.delayCost;
            }
        });
        accumulatedCost += delayCostThisHour;
        cumulativeCost.push(accumulatedCost);

        costAtTime.push({ time: t, value: delayCostThisHour });
    }

    totalDelayCost = accumulatedCost;
    const netProfit = totalValue - totalDelayCost;

    resultDiv.innerHTML = `
        <h2>Ergebnis</h2>
        <p>Gesamtwert der produzierten Produkte: ${totalValue}€</p>
        <p>Verzögerungskosten: ${totalDelayCost}€</p>
        <p><strong>Nettogewinn: ${netProfit}€</strong></p>
    `;

    const ctx = document.getElementById('resultChart').getContext('2d');
    window.resultChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Kumulativer Gewinn',
                    data: cumulativeProfit,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                },
                {
                    label: 'Kumulative Verzögerungskosten',
                    data: cumulativeCost,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Arbeitsstunde'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Euro (€)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (context) => {
                            return `Arbeitsstunde ${context[0].label}`;
                        },
                        afterBody: (context) => {
                            let label = '';
                            let t = parseInt(context[0].label);
                            // Anzeigen, welche Aufgaben abgeschlossen wurden
                            let tasksCompleted = [];
                            profitAtTime.forEach((event, idx) => {
                                if (event.time === t) {
                                    tasksCompleted.push(selectedTasks[idx].name);
                                }
                            });
                            if (tasksCompleted.length > 0) {
                                label += 'Abgeschlossene Aufgaben: ' + tasksCompleted.join(', ') + '\n';
                            }
                            // Anzeigen der Verzögerungskosten in dieser Stunde
                            let costEvent = costAtTime.find(event => event.time === t);
                            if (costEvent && costEvent.value > 0) {
                                label += `Verzögerungskosten in dieser Stunde: ${costEvent.value}€`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    checkGoals(netProfit, totalDelayCost, selectedTasks, currentTime);

    const allGoalsAchieved = goals.every(goal => goal.achieved);
    if (allGoalsAchieved) {
        resultDiv.innerHTML += `<p style="color: green;"><strong>Glückwunsch! Sie haben alle Ziele erreicht!</strong></p>`;
    } else {
        resultDiv.innerHTML += `<p style="color: red;"><strong>Sie haben nicht alle Ziele erreicht. Versuchen Sie es erneut!</strong></p>`;
    }

    let evaluationText = '<h3>Auswertung Ihrer Entscheidungen</h3>';

    evaluationText += '<p>Sie haben folgende Produkte ausgewählt:</p><ul>';
    selectedTasks.forEach((task, index) => {
        evaluationText += `<li>${index + 1}. ${task.name} (Wert: ${task.value}€, Dauer: ${task.duration} Stunden, Kritikalität: ${task.criticality})</li>`;
    });
    evaluationText += '</ul>';

    evaluationText += '<p><strong>Analyse der Priorisierung:</strong></p>';
    evaluationText += '<ul>';

    // Prüfen, ob hochkritische Produkte priorisiert wurden
    const highCriticalityTasks = selectedTasks.filter(task => task.criticality === 'hoch');
    if (highCriticalityTasks.length > 0) {
        const firstHighCriticalTask = selectedTasks.findIndex(task => task.criticality === 'hoch') + 1;
        evaluationText += `<li>Sie haben Produkte mit hoher Kritikalität ausgewählt. Das erste befindet sich an Position ${firstHighCriticalTask} in Ihrer Priorisierung.</li>`;
        if (firstHighCriticalTask > 1) {
            evaluationText += '<li>Das erste hochkritische Produkt wurde nicht an erster Stelle priorisiert, was zu höheren Verzögerungskosten geführt hat.</li>';
        } else {
            evaluationText += '<li>Gut gemacht! Sie haben ein hochkritisches Produkt an erster Stelle priorisiert und somit Verzögerungskosten minimiert.</li>';
        }
    } else {
        evaluationText += '<li>Sie haben kein Produkt mit hoher Kritikalität ausgewählt. Dadurch haben Sie möglicherweise eine Chance verpasst, den Nettogewinn zu maximieren.</li>';
    }

    if (totalDelayCost > 0) {
        evaluationText += `<li>Die Verzögerungskosten betragen insgesamt ${totalDelayCost}€. Durch frühere Priorisierung von kritischen Aufgaben könnten diese Kosten reduziert werden.</li>`;
    } else {
        evaluationText += '<li>Sie haben keine Verzögerungskosten verursacht. Sehr gut!</li>';
    }

    if (usedCapacity < capacityLimit) {
        evaluationText += `<li>Sie haben nicht die gesamte verfügbare Kapazität genutzt (${usedCapacity} von ${capacityLimit} Stunden). Durch Hinzufügen weiterer Produkte könnten Sie den Nettogewinn steigern.</li>`;
    } else {
        evaluationText += '<li>Sie haben die gesamte verfügbare Kapazität optimal genutzt.</li>';
    }

    evaluationText += '</ul>';

    evaluationText += `
        <h3>Bezug zur Softwareentwicklung</h3>
        <p>In der Softwareentwicklung entstehen Verzögerungskosten nicht nur durch einzelne Aufgaben, sondern durch die Gesamtheit aller noch offenen, kritischen Aufgaben. Wenn kritische Funktionen oder Fehlerbehebungen verzögert werden, erhöhen sich die Kosten mit jeder Zeiteinheit, in der sie nicht abgeschlossen sind.</p>
        <p>Dieses Spiel zeigt, wie wichtig es ist, alle offenen kritischen Aufgaben zu berücksichtigen und ihre kumulativen Auswirkungen auf das Projekt zu verstehen. Durch die Priorisierung der wichtigsten Aufgaben und das frühzeitige Abschließen können die Gesamtkosten deutlich reduziert werden.</p>
    `;

    resultDiv.innerHTML += evaluationText;
});
