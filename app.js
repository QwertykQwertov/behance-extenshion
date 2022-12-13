console.log('Extend is ready!')

let imgArr = document.querySelectorAll('img')
const pattern = /\bhttps:\/\/mir-s3-cdn-cf.behance.net\/project_modules\//

function showArray () {
  imgArr = Array.from(imgArr).filter((el) => {
    return pattern.test(el.currentSrc)
  })
  for (let i = 0; i < imgArr.length; i++) {
    let srcset = imgArr[i].srcset.split(',')
    console.log(srcset)
    let btnSave = document.createElement('a')
    btnSave.setAttribute('href', imgArr[i].currentSrc)
    btnSave.addEventListener('click', function () { saveImage(imgArr[i].currentSrc) })
    btnSave.classList.add('Btn-button-CqT', 'Btn-inverted-GDL', 'Btn-normal-If5', 'Btn-shouldBlur-ZHs', 'Actions-moduleAction-pY1', 'Actions-moduleActionLink-ur1')
    btnSave.innerHTML = `<div class="Btn-labelWrapper-_Re">
      <div class="Btn-label-QJi e2e-Btn-label">Скачать</div>
    </div>`
    if (imgArr[i].parentElement.nodeName === "BODY") {
      saveImage(imgArr[i].currentSrc)
      return
    }
    if (imgArr[i].parentElement.classList.contains('ImageElement-root-kir')) {
      imgArr[i].parentElement.parentElement.children[2].children[0].children[0].append(btnSave)
    } else {
      imgArr[i].parentElement.children[2].children[0].children[0].append(btnSave)
    }
  }

}
function saveImage (url) {
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', '')
  link.click()
}

window.setTimeout(showArray, 1000)

