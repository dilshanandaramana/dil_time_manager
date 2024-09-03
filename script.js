
// Load alarms from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAlarms();
    updateTime();
    setInterval(updateTime, 1000);
});

// Function to update time and date
function updateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    timeElement.textContent = timeString;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);
    dateElement.textContent = dateString;

    checkAlarms(now);
}

let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

// Event listener for setting an alarm
document.getElementById('set-alarm').addEventListener('click', () => {
    const alarmTime = document.getElementById('alarm-time').value;
    if (alarmTime) {
        const current = new Date();
        const alarmDateTime = new Date(current.toDateString() + ' ' + alarmTime);
        if (alarmDateTime > current) {
            alarms.push(alarmDateTime);
            saveAlarms();
            displayAlarms();
            setAlarm(alarmDateTime);
            alert('Alarm set!');
        } else {
            alert('Please set a future time for the alarm.');
        }
    }
});

// Function to display the list of alarms
function displayAlarms() {
    const alarmList = document.getElementById('alarm-list');
    alarmList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.textContent = `Alarm ${index + 1}: ${new Date(alarm).toLocaleTimeString()}`;
        alarmList.appendChild(li);
    });
}

// Function to check if an alarm should go off
function checkAlarms(currentTime) {
    alarms.forEach((alarm, index) => {
        const alarmDateTime = new Date(alarm);
        if (currentTime >= alarmDateTime) {
            document.getElementById('alarm-sound').play();
            document.getElementById('alarm-controls').classList.remove('hidden');
            alarms.splice(index, 1); // Remove the alarm that has gone off
            saveAlarms();
            displayAlarms();
        }
    });
}

// Function to save alarms to local storage
function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// Function to load alarms from local storage
function loadAlarms() {
    alarms = JSON.parse(localStorage.getItem('alarms')) || [];
    displayAlarms();
}

// Function to set an alarm
function setAlarm(alarmDateTime) {
    const timeToAlarm = alarmDateTime - new Date();
    setTimeout(() => {
        document.getElementById('alarm-sound').play();
        document.getElementById('alarm-controls').classList.remove('hidden');
    }, timeToAlarm);
}

// Event listener for stopping the alarm
document.getElementById('stop-alarm').addEventListener('click', () => {
    document.getElementById('alarm-sound').pause();
    document.getElementById('alarm-sound').currentTime = 0;
    document.getElementById('alarm-controls').classList.add('hidden');
});
