const refs = {
    btnStart: document.querySelector('button[data-start]'),
    btnStop: document.querySelector('button[data-stop]'),
    body: document.querySelector('body')
};

let intervalId = null;

const INTERVAL_DURATION = 1000;

refs.btnStart.disabled = false;
refs.btnStop.disabled = true;


function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

function updateBackgroundColor() {
    refs.body.style.backgroundColor = getRandomHexColor();
};

refs.btnStart.addEventListener('click', onStartBtnCkilck);
refs.btnStop.addEventListener('click', onStopBtnClick);

function onStartBtnCkilck() {
    intervalId = setInterval(updateBackgroundColor, INTERVAL_DURATION);
    refs.btnStart.disabled = true;
    refs.btnStop.disabled = false;
};

function onStopBtnClick() {
    refs.btnStart.disabled = false;
    refs.btnStop.disabled = true;
    clearInterval(intervalId);
};