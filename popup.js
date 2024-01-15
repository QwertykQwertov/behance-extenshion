console.log('popup.js')

window.onload = () => {
  let buttonPower = document.querySelector('#toggle')
  let buttonDonat = document.querySelector('#donat')
  let buttonStatistic = document.querySelector('#statistic')

  buttonPower.addEventListener('click', changeState)
  buttonDonat.addEventListener('click', goToDonat)
  buttonStatistic.addEventListener('click', goToStatistic)
}

function changeState() {
  const appState = buttonPower.getAttribute("aria-checked")
  // localStorage.setItem('isRunExt', 'appState')
  chrome.storage.sync.set({isRunExt: true})
}

function goToDonat() {
  window.open('https://pay.cloudtips.ru/p/108a3cf6', '_blank');
  localStorage.setItem('isRunExt', 'appState')
  chrome.storage.sync.set({isRunExt: true})
}

function goToStatistic() {
  window.open('https://sbehance.ikolesov.space/', '_blank');
}

function disable_ext() {
  const id = chrome.runtime.id;
  chrome.management.get(id, function (ex) {
    if (ex.enabled) {
      chrome.management.setEnabled(id, false);
    }
  });
}
