
const Base64Prefix = 'data:application/pdf;base64,';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';
const pdfList = document.querySelector('.container__pdfList');

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(blob);
  });
}

async function printPDF(pdfData) {

  // 將檔案處理成 base64
  pdfData = await readBlob(pdfData);

  // 將 base64 中的前綴刪去，並進行解碼
  const data = atob(pdfData.substring(Base64Prefix.length));

  // 利用解碼的檔案，載入 PDF 檔及第一頁
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  const pdfPage = await pdfDoc.getPage(1);

  // 設定尺寸及產生 canvas
  const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
  const canvas = document.createElement("canvas");
//   const canvas = document.querySelector('.pdfCanvas__img');
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
  canvas.height = viewport.height;
//   canvas.height = '97px';
  canvas.width = viewport.width;
  console.log((viewport.width / viewport.height));
//   canvas.width = '68px';
  const renderContext = {
    canvasContext: context,
    viewport,
  };
  const renderTask = pdfPage.render(renderContext);

  // 回傳做好的 PDF canvas
  return renderTask.promise.then(() => canvas);
}

async function pdfToImage(pdfData) {

  // 設定 PDF 轉為圖片時的比例
  const scale = 1 / window.devicePixelRatio;

  // 回傳圖片
  return new fabric.Image(pdfData, {
    id: "renderPDF",
    scaleX: scale,
    scaleY: scale,
  });
}

const canvas = new fabric.Canvas("canvas");

if (!window.location.href.includes('/sign.html')) {
    document.querySelector('input').addEventListener('change', async (e) => {

        canvas.requestRenderAll();
        const pdfData = await printPDF(e.target.files[0]);
        const pdfImage = await pdfToImage(pdfData);
        console.log(pdfImage);

        localStorage.setItem('pdfData', pdfData.toDataURL());
        const date = `${new Date().getFullYear()}.${new Date().getMonth()+1}.${new Date().getDate()}`;
        pdfList.innerHTML = `
            <ul>
                <li>
                    <a href="./sign.html">
                        <img src="./images/pdf.png" alt="pdf image">
                        <div>
                            <h4>01點點簽合約說明書.pdf</h4>
                            <span>簽署時間：${date}</span>
                        </div>
                    </a>
                    <img src="./images/icon_menu.svg" alt="icon menu">
                </li>
            </ul>
        `;
        console.log(pdfData);
        console.log(pdfImage);
        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
    })
} else {

    const signBarButton = document.getElementById('signBar__button');
    const modal = document.getElementById('modal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modal__close');


    async function render(data) {
        console.log(data);
        canvas.requestRenderAll();
        const pdfImage = await pdfToImage(data);
        console.log(pdfImage);
        let myCanvas = document.getElementById("pdfCanvas__img");
        // var myCanvas = document.getElementById('pdfCanvas__canvas');
        let ctx = myCanvas.getContext('2d');
        // myCanvas.setWidth(pdfImage.width / window.devicePixelRatio);
        // myCanvas.setHeight(pdfImage.height / window.devicePixelRatio);
        // const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
        // myCanvas.width = pdfImage.width / window.devicePixelRatio;
        const imgInner = document.createElement("img");
        // var img = document.getElementById('canvas');
        imgInner.onload = function(){
            ctx.drawImage(imgInner,0,0, imgInner.width, imgInner.height); // Or at whatever offset you like
            ctx.width = imgInner.width;
            ctx.height = imgInner.width * 0.7066508313539193;
        };
        imgInner.setAttribute('src', data);
        

        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));

        const pdf = new jsPDF();
        const download = document.querySelector(".signNavbar__complete");

        download.addEventListener("click", () => {

            // 將 canvas 存為圖片
            const image = myCanvas.toDataURL("image/png");
            
            // 設定背景在 PDF 中的位置及大小
            const width = pdf.internal.pageSize.width;
            const height = pdf.internal.pageSize.height;
            pdf.addImage(image, "png", 0, 0, width, height);

            // 將檔案取名並下載
            pdf.save("download.pdf");
        });
    }
    window.onload = async function () {
        const data = localStorage.getItem('pdfData');
        await render(data);
    }

    signBarButton.addEventListener('click', () => {
        modal.style.display = 'block';
        modalBackdrop.style.display = 'block';
    })

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        modalBackdrop.style.display = 'none';
    })
}
