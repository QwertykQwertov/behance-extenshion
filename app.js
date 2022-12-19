console.log('Extend is ready!')

let imgArr = []
const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//

window.onload = () => {
  this.getImgs()
}

function getImgs () {
  imgArr = document.querySelectorAll('img')
  this.showArray(imgArr)
}

function showArray (arr) {
  imgArr = Array.from(imgArr).filter((el) => {
    return pattern.test(el.currentSrc)
  })
  // console.log(imgArr, "ARR")
  for (let i = 0; i < imgArr.length; i++) {
    // Если корневой элемент body, скачиваем картинку и завершаем скрипт
    if (imgArr[i].parentElement.nodeName === "BODY") {
      saveImage(imgArr[i].currentSrc)
      clearTimeout(refreshFunction);
      return
    }
    const srcset = imgArr[i].srcset.split(',').filter(el => el != '')
    let src = srcset[srcset.length - 1]
    src = src.match(/https:\/\/\S+/)
    console.log(src)
    let btnSave = document.createElement('a')
    btnSave.setAttribute('href', src[0])
    btnSave.addEventListener('click', function () { saveImage(imgArr[i].currentSrc) })
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
      <div class="Btn-label-QJi e2e-Btn-label">Скачать</div>
    </div>`
    if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir') && !imgArr[i].parentElement.parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selelctor')) {
      imgArr[i].parentElement.parentElement?.children[2]?.children[0]?.children[0]?.append(btnSave)
    } else if (imgArr[i].classList?.contains('grid__item-image') && !imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1]?.lastChild?.classList?.contains('link-selelctor')) {
      imgArr[i].parentElement.children[imgArr[i].parentElement.children.length - 1].append(btnSave)
    } else {
      if (!imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.lastChild?.classList?.contains('link-selelctor')) {
        imgArr[i].parentElement.children[2]?.children[0]?.children[0]?.append(btnSave)
      }

    }
  }

}
function saveImage (url) {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', '')
  link.click()
}

let refreshFunction = window.setInterval(getImgs, 3000)
