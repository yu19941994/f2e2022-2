
const Base64Prefix = 'data:application/pdf;base64,';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

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
  const context = canvas.getContext("2d");

  // 設定 PDF 所要顯示的寬高及渲染
//   canvas.height = viewport.height;
//   canvas.height = '97px';
//   canvas.width = viewport.width;
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

document.querySelector('input').addEventListener('change', async (e) => {
    canvas.requestRenderAll();
    const pdfData = await printPDF(e.target.files[0]);
    const pdfImage = await pdfToImage(pdfData);
    localStorage.setItem('pdfImage', pdfImage);
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
})