console.log('popup.js')
const ruNames = ['Вкл/Выкл', 'На кофе', 'Оценить', 'Статистика']

window.onload = () => {
  const label = document.querySelector('#label')
  const buttonPower = document.querySelector('#toggle')
  const buttonDonat = document.querySelector('#donat')
  const buttonStar = document.querySelector('#star')
  const buttonStatistic = document.querySelector('#statistic')

  checkLanguage([label, buttonDonat, buttonStar, buttonStatistic])

  buttonPower.addEventListener('change', changeState)
  buttonDonat.addEventListener('click', () => goTo('https://pay.cloudtips.ru/p/108a3cf6'))
  buttonStar.addEventListener('click', () => goTo('https://chromewebstore.google.com/detail/behance-saver/pcgmjcfekkppafhcjbpajfgakmlmnbfn'))
  buttonStatistic.addEventListener('click', () => goTo('https://sbehance.ikolesov.space/'))

  initialState(buttonPower)
}

function changeState() {
  chrome.storage.sync.set({ isRunExt: this.checked })
}

function initialState(button) {
  chrome.storage.sync.get(["isRunExt"]).then(stor => (stor.isRunExt || typeof stor.isRunExt === "undefined") ? button.checked = true : button.checked = false)
}

function goTo(path) {
  window.open(path, '_blank');
}

function checkLanguage(buttons) {
  if (!/en/.test(window.navigator.language)) return

  buttons.forEach((el, i) => {
    el.textContent = ruNames[i]
  });
}