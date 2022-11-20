if (window.location.href.includes('/sign.html')) {
    const canvas = document.querySelector("#modal__canvas");
    const ctx = canvas.getContext("2d");
    const clearBtn = document.querySelector("#modal__clear");
    const modalColor = document.querySelectorAll(".modal__color > li > a");
    const modalSave = document.querySelector(".modal__save");

    modalColor.forEach((i, ind) => {
        i.addEventListener('click', () => {
            let colorArr = [0, 1, 2];
            modalColor[ind].classList.add('active');
            if (ind === 0) {
                ctx.strokeStyle = "#006BFF";
            } else if (ind === 1) {
                ctx.strokeStyle = "#FF0000";
            } else {
                ctx.strokeStyle = "#000";
            }
            colorArr.splice(ind, 1);
            colorArr.forEach((c) => {
                modalColor[c].classList.remove('active');
            })
        })
    })

    // 設定線條的相關數值
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    // ctx.strokeStyle = "orange";

    // 設置狀態來確認滑鼠 / 手指是否按下或在畫布範圍中
    let isPainting = false;

    // 取得滑鼠 / 手指在畫布上的位置
    function getPaintPosition(e) {
    const canvasSize = canvas.getBoundingClientRect();

    if (e.type === "mousemove") {
        return {
        x: e.clientX - canvasSize.left,
        y: e.clientY - canvasSize.top,
        };
    } else {
        return {
        x: e.touches[0].clientX - canvasSize.left,
        y: e.touches[0].clientY - canvasSize.top,
        };
    }
    }

    // 開始繪圖時，將狀態開啟
    function startPosition(e) {
    e.preventDefault();
    isPainting = true;
    }

    // 結束繪圖時，將狀態關閉，並產生新路徑
    function finishedPosition() {
    isPainting = false;
    ctx.beginPath();
    }

    // 繪圖過程
    function draw(e) {
    // 滑鼠移動過程中，若非繪圖狀態，則跳出
    if (!isPainting) return;

    // 取得滑鼠 / 手指在畫布上的 x, y 軸位置位置
    const paintPosition = getPaintPosition(e);

    // 移動滑鼠位置並產生圖案
    ctx.lineTo(paintPosition.x, paintPosition.y);
    ctx.stroke();
    }

    // 重新設定畫布
    function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // event listener 電腦板
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mouseleave", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    // event listener 手機板
    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", finishedPosition);
    canvas.addEventListener("touchcancel", finishedPosition);
    canvas.addEventListener("touchmove", draw);

    clearBtn.addEventListener("click", reset);

    const showImage = document.querySelector(".signBar__img");

    function saveImage() {
        // console.log('hoahfoi')
        // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
        // showImage.style.display = 'block';
        const newImg = canvas.toDataURL("image/png");
        localStorage.setItem('img', newImg);
        showImage.src = localStorage.getItem("img");
        modal.style.display = 'none';
        modalBackdrop.style.display = 'none';

    }

    modalSave.addEventListener("click", saveImage);

    if (localStorage.getItem("img")) {
        console.log('hoiaoiaj')
        showImage.style.display = 'block';
        showImage.src = localStorage.getItem("img");
    }

    showImage.addEventListener("click", () => {
        if (!showImage.src) return;

        fabric.Image.fromURL(showImage.src, function (image) {

            // 設定簽名出現的位置及大小，後續可調整
            image.top = 400;
            image.scaleX = 0.5;
            image.scaleY = 0.5;
            let myCanvas = document.getElementById("pdfCanvas__img");
            const canvas = new fabric.Canvas("canvas");
            canvas.add(image);
        });
    })
}