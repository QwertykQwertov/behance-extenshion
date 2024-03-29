console.log('Extend for behance is ready!')
const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//
const srcStat = 'https://710ede90.artydev.ru/api/v1/process/'
let refreshFunction = null

let os, browserLang, browser, authors, album, album_url
window.addEventListener('load', () => {
  refreshFunction = window.setInterval(getData, 1500)
  const browserInfo = window.navigator
  browserLang = browserInfo.language
  browser = detectBrowser(browserInfo)
  os = browserInfo.userAgentData.platform
})

function getData() {
  const imgArr = document.querySelectorAll('img')
  let infoScript = document.querySelector('[type="application/ld+json"]')
  if (infoScript) {
    const info = JSON.parse(infoScript.innerText)
    if (info['@type'] === 'Person') {
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
    injectLink(imgArr)
  }
}

function injectLink(imgArr) {
  imgArr = Array.from(imgArr).filter((el) => {
    return pattern.test(el.currentSrc)
  })
  for (let i = 0; i < imgArr.length; i++) {
    // Получаем src для кнопки
    const src = getSrc(imgArr[i])
    // Вызов функции формирования кнопки
    const saveButton = createBtn(src)

    if (imgArr[i].parentElement.classList.contains('project-lightbox-image-container') && !imgArr[i].parentElement.children[1]?.children[imgArr[i].parentElement.children[1]?.children.length - 1].classList?.contains('link-selector')) {
      imgArr[i].parentElement.children[1]?.append(saveButton)
    } else if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir') && !imgArr[i].parentElement.parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
      imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(saveButton)
    } else if (imgArr[i].classList?.contains('grid__item-image') && !imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1]?.lastChild?.classList?.contains('link-selector')) {
      imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(saveButton)
    } else {
      if (!imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
        imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(saveButton)
      }
    }
  }
}

function getSrc({ srcset }) {
  src = srcset.split(',').findLast(el => el != '').match(/https:\/\/\S+/)[0]
  return src
}

function createBtn(src) {
  const btnSave = document.createElement('button')
  btnSave.addEventListener('click', (e) => onClick(e, src))
  btnSave.style['background-color'] = '#ff0000'
  btnSave.style.opacity = '0.75'
  btnSave.onmouseover = function () {
    btnSave.style.opacity = "1";
  };
  btnSave.onmouseleave = function () {
    btnSave.style.opacity = "0.75";
  }
  btnSave.classList.add('project-item-lightbox__action', 'link-selector', 'Btn-button-CqT', 'Btn-inverted-GDL', 'Btn-normal-If5', 'Btn-shouldBlur-ZHs', 'Actions-moduleAction-pY1', 'Actions-moduleActionLink-ur1')
  btnSave.innerHTML = `<div class="Btn-labelWrapper-_Re">
    <div class="Btn-label-QJi e2e-Btn-label">Download</div>
  </div>`
  return btnSave
}

function onClick(e, src) {
  e.stopPropagation()
  fetch(src).then(res => res.blob())
    .then(data => saveImg(data))
    .catch(err => console.log(err))

  fetch(srcStat, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authors, album, album_url, img_url: src, os, browser, browser_lang: browserLang })
  }).then(res => res)
    .catch(err => console.log(err))
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