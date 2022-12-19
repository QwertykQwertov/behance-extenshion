console.log('Extend for behance is ready!')
let btnText = ''

// Определение местоположения
fetch("https://ipinfo.io/json").then(
  (response) => response.json()
).then(
  (jsonResponse) => {
    btnText = jsonResponse.country === 'RU' ? 'Скачать' : 'Download'
    this.getImgs()
  }
)

const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//

function getImgs () {
  const imgArr = document.querySelectorAll('img')
  this.injectLink(imgArr)
}

function injectLink (imgArr) {
  imgArr = Array.from(imgArr).filter((el) => {
    return pattern.test(el.currentSrc)
  })
  for (let i = 0; i < imgArr.length; i++) {
    // Если корневой элемент body, скачиваем картинку и завершаем скрипт
    if (imgArr[i].parentElement.nodeName === "BODY") {
      saveImage(imgArr[i].currentSrc)
      clearTimeout(refreshFunction);
      return
    }
    const src = getSrc(imgArr[i])
    // Вызов функции формирования кнопки
    const saveButton = createBtn(src)

    if (imgArr[i].parentElement.classList.contains('project-lightbox-image-container') && !imgArr[i].parentElement.children[1]?.children[imgArr[i].parentElement.children[1]?.children.length - 1].classList?.contains('link-selelctor')) {
      imgArr[i].parentElement.children[1]?.append(saveButton)
    } else if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir') && !imgArr[i].parentElement.parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selelctor')) {
      imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(saveButton)
    } else if (imgArr[i].classList?.contains('grid__item-image') && !imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1]?.lastChild?.classList?.contains('link-selelctor')) {
      imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(saveButton)
    } else {
      if (!imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selelctor')) {
        imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(saveButton)
      }
    }
  }
}

function getSrc ({ srcset }) {
  srcset = srcset.split(',').filter(el => el != '')
  let src = srcset[srcset.length - 1]
  src = src.match(/https:\/\/\S+/)
  return src[0]
}

function createBtn (src) {
  const btnSave = document.createElement('a')
  btnSave.setAttribute('href', src)
  btnSave.setAttribute('target', '_blank')
  btnSave.addEventListener('click', function (e) { 
    e.stopPropagation()
  })
  btnSave.style['background-color'] = '#ff0000'
  btnSave.style.opacity = '0.75'
  btnSave.onmouseover = function () {
    btnSave.style.opacity = "1";
  };
  btnSave.onmouseleave = function () {
    btnSave.style.opacity = "0.75";
  }
  btnSave.classList.add('link-selelctor', 'Btn-button-CqT', 'Btn-inverted-GDL', 'Btn-normal-If5', 'Btn-shouldBlur-ZHs', 'Actions-moduleAction-pY1', 'Actions-moduleActionLink-ur1')
  btnSave.innerHTML = `<div class="Btn-labelWrapper-_Re">
    <div class="Btn-label-QJi e2e-Btn-label">${btnText}</div>
  </div>`
  return btnSave
}

function saveImage (url) {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', '')
  link.click()
  window.close()
}

let refreshFunction = window.setInterval(getImgs, 3000)
