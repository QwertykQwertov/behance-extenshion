const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//
const srcStat = 'https://710ede90.artydev.ru/api/v1/process/'
let refreshFunction = null
let isRun
const appLanguage = /ru/.test(window.navigator.language) ? 'ru' : 'en'

let os, browserLang, browser, authors, album, album_url
window.addEventListener('load', () => {
  checkIsRun()
  refreshFunction = window.setInterval(checkIsRun, 1500)
  const browserInfo = window.navigator
  browserLang = browserInfo.language
  browser = detectBrowser(browserInfo)
  os = browserInfo.userAgentData.platform
  addToastInDOM()
})

function checkIsRun() {
  // Проверяем, запущено ли приложение в popup
  chrome.storage.sync.get(["isRunExt"]).then((data) => {
    if (data.isRunExt === false) {
      return
    }
    getData()
  })
}

function getData() {
  const imgArr = document.querySelectorAll('img')
  console.log(imgArr)
  let infoScript = document.querySelector('[type="application/ld+json"]')
  if (infoScript) {
    const info = JSON.parse(infoScript.innerText)
    if (info['@type'] === 'Person') {
      console.log('if')
      album = document.querySelector('.Project-title-Q6Q')
      if (!album) return
      album = album.textContent
      album_url = window.location.href
      authors = [{ identifier: info.identifier, name: info.name, url: info.url }]
    } else {
      album = info.name
      album_url = info.url
      authors = info.creator.map(el => {
        delete el['@type']
        return el
      })
    }
    console.log('work')
    injectLink(imgArr)
  } else if (window.location.host === "mir-s3-cdn-cf.behance.net") {
    // Если открылось окно этого поддомена, то качаем изображение
    createLink(imgArr[0].currentSrc, '_blank')
    window.close()
    return
  }
}

function injectLink(imgArr) {
  console.log('inject', imgArr)
  imgArr = Array.from(imgArr).filter((el) => {
    return pattern.test(el.currentSrc)
  })
  for (let i = 0; i < imgArr.length; i++) {
    // Получаем src для кнопки
    const src = getSrc(imgArr[i])
    // Вызов функции формирования кнопки
    const saveButton = createBtn(src, 'Download')
    const copyButton = createBtn(src, 'Copy')

    if (imgArr[i].parentElement.classList.contains('project-lightbox-image-container') && !imgArr[i].parentElement.children[1]?.children[imgArr[i].parentElement.children[1]?.children.length - 1].classList?.contains('link-selector')) {
      imgArr[i].parentElement.children[1]?.append(saveButton)
      imgArr[i].parentElement.children[1]?.append(copyButton)
    } else if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir') && !imgArr[i].parentElement.parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
      imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(saveButton)
      imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(copyButton)
    } else if (imgArr[i].classList?.contains('grid__item-image') && !imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1]?.lastChild?.classList?.contains('link-selector')) {
      imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(saveButton)
      imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(copyButton)
    } else {
      if (!imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
        imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(saveButton)
        imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(copyButton)
      }
    }
  }
}

function getSrc({ srcset }) {
  src = srcset.split(',').findLast(el => el != '').match(/https:\/\/\S+/)[0]
  return src
}

// Кнопка сохранения
function createBtn(src, type) {
  const iconPath = (type === 'Download') ? 'https://img.icons8.com/metro/26/000000/download.png' : 'https://img.icons8.com/ios-glyphs/30/copy.png'
  const btnSave = document.createElement('button')

  btnSave.addEventListener('click', (e) => type === 'Download' ? onClickSave(e, src) : convertImage(e, src))
  btnSave.style['background-color'] = '#ff0000'
  btnSave.style.opacity = '0.75'
  btnSave.onmouseover = function () {
    btnSave.style.opacity = "1";
  };
  btnSave.onmouseleave = function () {
    btnSave.style.opacity = "0.75";
  }
  if (type !== 'Download') type = ''
  btnSave.classList.add('project-item-lightbox__action', 'link-selector', 'Btn-button-CqT', 'Btn-inverted-GDL', 'Btn-normal-If5', 'Btn-shouldBlur-ZHs', 'Actions-moduleAction-pY1', 'Actions-moduleActionLink-ur1')
  btnSave.innerHTML = `<div class="Btn-labelWrapper-_Re">
    <div class="Btn-label-QJi e2e-Btn-label"><img class="ext-icon"src=${iconPath}></div>  
  </div>`
  return btnSave
}

function createLink(url, target) {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', '')
  link.setAttribute('target', target)
  link.click()
}

function onClickSave(e, src) {
  e.stopPropagation()

  fetch(src).then(res => res.blob())
    .then(data => saveImg(data))
    .catch(err => {
      createLink(src) // Если не получается скачать, то скачиваем по старинке через другую вкладку
      console.log(err)
    })

  fetch(srcStat, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authors, album, album_url, img_url: src, os, browser, browser_lang: browserLang })
  }).then(res => res)
    .catch(err => console.log(err))
}

function onClickCopy(e, src) {
  e.stopPropagation()
  fetch(src).then(res => res.blob())
    .then((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    })
    .catch(err => console.log(err))
}

function convertImage(e, src) {
  e.stopPropagation()
  const img = new Image
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')

  function setCanvasImage(path, func) {
    img.onload = function () {
      c.width = this.naturalWidth
      c.height = this.naturalHeight
      ctx.drawImage(this, 0, 0)
      c.toBlob(blob => {
        func(blob)
      }, 'image/png')
    }
    img.setAttribute('crossorigin', 'anonymous')
    img.src = path
  }

  setCanvasImage(src, (imgBlob) => {
    navigator.clipboard.write(
      [
        new ClipboardItem({ 'image/png': imgBlob })
      ]
    ).then(e => {
      showToast('success')
    })
      .catch(e => {
        showToast('error')
        console.log(e)
      })
  })
}

function saveImg(blob) {
  let link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", `${album}_${Date.now()}`);
  link.click();
}

function detectBrowser(info) {
  let result = 'Other';
  if (info.userAgent.indexOf('YaBrowser') !== -1) {
    result = 'Yandex Browser';
  } else if (info.userAgent.indexOf('Firefox') !== -1) {
    result = 'Mozilla Firefox';
  } else if (info.userAgent.indexOf('Chrome') !== -1) {
    result = 'Google Chrome';
  } else if (info.userAgent.indexOf('MSIE') !== -1) {
    result = 'Internet Exploder';
  } else if (info.userAgent.indexOf('Edge') !== -1) {
    result = 'Microsoft Edge';
  } else if (info.userAgent.indexOf('Safari') !== -1) {
    result = 'Safari';
  } else if (info.userAgent.indexOf('Opera') !== -1) {
    result = 'Opera';
  }
  return result;
}

function addToastInDOM() {

  const toast = document.createElement('div')
  toast.id = 'snackbar'
  document.body.append(toast)
}

function showToast(type) {
  const message = {
    success: {
      ru: 'Изображение успешно скопировано',
      en: 'Image copied successfully'
    },
    error: {
      ru: 'Произошла ошибка, попробуйте снова',
      en: 'Something went wrong, try again'
    }
  }

  // Находим контейнер с сообщением
  const toast = document.getElementById("snackbar");
  toast.textContent = message[type][appLanguage]

  // Добавляем контейнеру класс "show"
  toast.classList.add('show', `toast-${type}`)
  // Через 3 секунды удаляем класс "show" у контейнера с сообщением
  setTimeout(function () {
    toast.classList.remove('show', `toast-${type}`)
  }, 3000);
}
