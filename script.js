let alarmAudio = document.getElementById('alarmAudio');
let reminderAudio = document.getElementById('reminderAudio');
let startAlarmButton = document.getElementById('startAlarmButton');
let stopAlarmButton = document.getElementById('stopAlarmButton');
let startReminderButton = document.getElementById('startReminderButton');
let stopReminderButton = document.getElementById('stopReminderButton');
let alarmInterval, reminderInterval;

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function startRecording(type) {
  if (isRecording) return;
  isRecording = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      if (type === 'alarm') {
        alarmAudio.src = audioUrl;
        alarmAudio.style.display = 'block';
        localStorage.setItem('alarmAudio', audioUrl);
      } else if (type === 'reminder') {
        reminderAudio.src = audioUrl;
        reminderAudio.style.display = 'block';
        localStorage.setItem('reminderAudio', audioUrl);
      }
    });
  } catch (error) {
    console.error('Error al acceder al micrófono', error);
    isRecording = false;
  }
}

function stopRecording(type) {
  if (!isRecording) return;
  isRecording = false;
  mediaRecorder.stop();
}

function setAlarm() {
  let alarmTime = document.getElementById('alarmTime').value;
  localStorage.setItem('alarmTime', alarmTime);
  startAlarmButton.style.display = 'inline-block';
}

function startAlarm() {
  let alarmTime = localStorage.getItem('alarmTime');
  let alarmSound = new Audio(localStorage.getItem('alarmAudio'));

  function playAlarm() {
    alarmSound.play();
  }

  let [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
  let now = new Date();
  let alarmDate = new Date();
  alarmDate.setHours(alarmHour, alarmMinute, 0, 0);

  if (alarmDate <= now) {
    alarmDate.setDate(now.getDate() + 1);
  }

  let timeout = alarmDate - now;

  setTimeout(() => {
    playAlarm();
    alarmInterval = setInterval(playAlarm, 60000); // Repetir cada minuto
    startAlarmButton.style.display = 'none';
    stopAlarmButton.style.display = 'inline-block';
  }, timeout);
}

function stopAlarm() {
  clearInterval(alarmInterval);
  let alarmSound = new Audio(localStorage.getItem('alarmAudio'));
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopAlarmButton.style.display = 'none';
}

function startReminder() {
  let reminderSound = new Audio(localStorage.getItem('reminderAudio'));
  reminderSound.play();
  reminderInterval = setInterval(() => {
    reminderSound.play();
  }, 900000); // Repetir cada 15 minutos
  startReminderButton.style.display = 'none';
  stopReminderButton.style.display = 'inline-block';
}

function stopReminder() {
  clearInterval(reminderInterval);
  let reminderSound = new Audio(localStorage.getItem('reminderAudio'));
  reminderSound.pause();
  reminderSound.currentTime = 0;
  stopReminderButton.style.display = 'none';
}
