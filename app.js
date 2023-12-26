// console.log('Extend for behance is ready!')
console.log('[TEST]')
const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//
const srcStat = 'https://710ede90.artydev.ru/api/v1/process/'
let refreshFunction = null

let os, browserLang, browser, authors, album, album_url
window.addEventListener('load', () => {
  refreshFunction = window.setInterval(getData, 3000)
  // getData()
  const browserInfo = window.navigator
  browserLang = browserInfo.language
  browser = detectBrowser(browserInfo)
  os = browserInfo.userAgentData.platform
})



function getData() {
  const imgArr = document.querySelectorAll('img')
  let infoScript = document.querySelector('[type="application/ld+json"]').innerText
  if (infoScript) {
    const info = JSON.parse(infoScript)
    album = info.name
    album_url = info.url
    authors = info.creator.map(el => {
      delete el['@type']
      return el
    })
    injectLink(imgArr)
  }
}

function injectLink(imgArr) {

  // console.log('[findElements]', imgArr)
  // imgArr = Array.from(imgArr).map((el) => {
  // return el.childNodes[1]
  // return pattern.test(el.currentSrc)
  // })

  // console.log('imgArr', imgArr)
  for (let i = 0; i < imgArr.length; i++) {
    // Получаем src для кнопки
    const src = getSrc(imgArr[i])
    // console.log('[src]', src)
    // Вызов функции формирования кнопки
    const saveButton = createBtn(src)
    try {
      if (imgArr[i].classList.contains('grid__item-image')) {
        console.log('[grid item image]')
        if (!imgArr[i].parentElement.contains('save-btn-appended')) {
          imgArr[i].parentElement.classList.add('save-btn-appended')
          const btnGroup = imgArr[i].parentElement.querySelector('.project-module__action')
          console.log('[seqrch is ok]', btnGroup)
          btnGroup.append(saveButton)
        }
      } else if (imgArr[i].closest('.js-project-lightbox-link')) {
        const parent = imgArr[i].closest('.js-project-lightbox-link')
        const btnGroup = parent.querySelector('.project-module__actions-container')
        // console.log('[btn group]', btnGroup)

        if (!btnGroup.classList.contains('save-btn-appended')) {
          btnGroup.classList.add('save-btn-appended')
          btnGroup.append(saveButton)
        }
      }
    } catch {

    }

    // if (imgArr[i].parentElement.classList.contains('project-lightbox-image-container') && !imgArr[i].parentElement.children[1]?.children[imgArr[i].parentElement.children[1]?.children.length - 1].classList?.contains('link-selector')) {
    //   imgArr[i].parentElement.children[1]?.append(saveButton)
    // } else if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir') && !imgArr[i].parentElement.parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
    //   imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(saveButton)
    // } else if (imgArr[i].classList?.contains('grid__item-image') && !imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1]?.lastChild?.classList?.contains('link-selector')) {
    //   imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(saveButton)
    // } else {
    //   if (!imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selector')) {
    //     imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(saveButton)
    //   }
    // }
  }
}

function getSrc(img) {
  // console.log('[ src set ]', srcset)
  let src
  // console.log('[img]', img)
  try {
    if (!img.srcset) {
      src = img.childNodes[1].srcset.split(',').findLast(el => el != '').match(/https:\/\/\S+/)[0]
    } else {
      src = img.srcset.split(',').findLast(el => el != '').match(/https:\/\/\S+/)[0]
    }
    return src
  } catch {
    // console.log('invalid image')
  }
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