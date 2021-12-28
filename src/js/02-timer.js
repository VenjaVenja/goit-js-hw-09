import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import '../css/timer.css';

const refs = {
    input: document.querySelector('#datetime-picker'),
    btnStart: document.querySelector('button[data-start]'),
    timerEl: document.querySelector('.timer'),
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]')
};

let userDate = null;

function pad(valeu) {
    return String(valeu).padStart(2, '0');
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
};

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      if (selectedDates[0] < Date.now()) {
          Notify.failure('Please choose a date in the future');
          userDate = new Date();
      } else {
          Notify.success('Press START! Let`s countdown start!');
          refs.btnStart.disabled = false;
          userDate = selectedDates[0];
      }
  },
};

class Timer {
    constructor({onTick}) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
        refs.btnStart.disabled = true;
    }

     timerStart() {
        if (this.isActive) {
            return;
        }
         
         this.isActive = true;
         refs.btnStart.disabled = true;
        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = userDate - currentTime;
            const time = convertMs(deltaTime);

            this.onTick(time)
            if (deltaTime <= 0) {
                this.timerStop();
            }
        }, 1000);
     }
    timerStop() {
        Notify.success('Time is over');
        clearInterval(this.intervalId);
        refs.btnStart.disabled = true;
        this.isActive = false;
        const time = convertMs(0);
        this.onTick(time);
    }
}

const timer = new Timer({
    onTick: updateTimerCounter
});

flatpickr("#datetime-picker", options);

refs.btnStart.addEventListener('click', timer.timerStart.bind(timer));

function updateTimerCounter({ days, hours, minutes, seconds }) {
    refs.days.textContent = (`${days}`);
    refs.hours.textContent = (`${hours}`);
    refs.minutes.textContent = (`${minutes}`);
    refs.seconds.textContent = (`${seconds}`);
};



