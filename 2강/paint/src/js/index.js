class DrawingBoard {
  MODE = "NONE"; // 클릭한 메뉴를 알아내기위한 변수
  IsMouseDown = false; // 마우스를 누르고 있는지 알아내기 위한 변수
  eraserColor = "#ffffff"; // 지우개 색상 (많이 쓰이기때문에 변수로 지정)
  backgroundColor = "#ffffff"; // 캔버스 배경 색상 (배경이 투명으로 되어있기때문에)
  IsNavigatorVisible = false; // 네비게이터가 활성화되어있는지에 대한 변수
  undoArray = []; // 되돌아가기 위해, 그린 데이터들을 저장해놓을 공간

  containerEl; // 전체를 묶고 있는 부모 컨테이너
  canvasEl; // 그리는 공간인 캔버스
  toolbarEl; // 캔버스 옆에 tool 들을 묶고 있는 부모요소
  brushEl; // 브러쉬 툴
  colorPickerEl; // 컬러 피커 툴
  brushPanelEl; // 브러쉬를 선택했을 때 나오는 브러쉬 크기 지정 패널
  brushSliderEl; // 브러쉬 크기를 조절해주는 아이 (패널)
  brushSizePreviewEl; // 브러쉬 크기를 미리보게 해주는 아이 (패널)
  eraserEl; // 지우개 툴
  navigatorEl; // 네비게이터 툴
  navigatorImageContainerEl; // 네비게이터의 이미지를 감싸고 있는 부모
  navigatorImageEl; // 네비게이터의 이미지 태그
  undoEl; // 되돌아가기 툴
  clearEl; // 초기화 툴
  downloadLinkEl; // 다운로드 툴

  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackgroundColor();
    this.addEvent();
  }
  assignElement() {
    this.containerEl = document.getElementById("container");
    this.canvasEl = this.containerEl.querySelector("#canvas");
    this.toolbarEl = this.containerEl.querySelector("#toolbar");
    this.brushEl = this.toolbarEl.querySelector("#brush");
    this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
    this.brushPanelEl = this.containerEl.querySelector("#brushPanel");
    this.brushSliderEl = this.brushPanelEl.querySelector("#brushSize");
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector("#brushSizePreview");
    this.eraserEl = this.toolbarEl.querySelector("#eraser");
    this.navigatorEl = this.toolbarEl.querySelector("#navigator");
    this.navigatorImageContainerEl = this.containerEl.querySelector("#imgNav");
    this.navigatorImageEl =
      this.navigatorImageContainerEl.querySelector("#canvasImg");
    this.undoEl = this.toolbarEl.querySelector("#undo");
    this.clearEl = this.toolbarEl.querySelector("#clear");
    this.downloadLinkEl = this.toolbarEl.querySelector("#download");
  }

  initContext() {
    this.context = this.canvasEl.getContext("2d");
  }

  initCanvasBackgroundColor() {
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height); // 캔버스 기준으로 0,0 좌표에서 직사각형을 그려줌
  }

  addEvent() {
    this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
    this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.brushSliderEl.addEventListener(
      "input",
      this.onChangeBrushSize.bind(this)
    );
    this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
    this.eraserEl.addEventListener("click", this.onClickEraser.bind(this));
    this.navigatorEl.addEventListener(
      "click",
      this.onClickNavigator.bind(this)
    );
    this.undoEl.addEventListener("click", this.onClickUndo.bind(this));
    this.clearEl.addEventListener("click", this.onClickClear.bind(this));
    this.downloadLinkEl.addEventListener(
      "click",
      this.onClickDownload.bind(this)
    );
  }

  onClickDownload() {
    this.downloadLinkEl.href = this.canvasEl.toDataURL("image/jpeg", 1);
    this.downloadLinkEl.download = "example.jpeg";
  }

  onClickClear() {
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.undoArray = [];
    this.updateNavigator();
    this.initCanvasBackgroundColor();
  }

  onClickUndo() {
    if (this.undoArray.length === 0) {
      alert("더이상 실행취소 불가합니다");
      return;
    }
    let previousDataUrl = this.undoArray.pop();
    let previousImage = new Image();
    previousImage.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.context.drawImage(
        previousImage,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      );
    };
    previousImage.src = previousDataUrl;
  }

  saveState() {
    if (this.undoArray.length > 4) {
      this.undoArray.shift();
      this.undoArray.push(this.canvasEl.toDataURL());
    } else {
      this.undoArray.push(this.canvasEl.toDataURL());
    }
    // this.undoArray.push(this.canvasEl.toDataURL());
    // console.log(this.undoArray);
  } // 그린 그림 url 을 저장해놓을 함수

  onClickNavigator(event) {
    this.IsNavigatorVisible = !event.currentTarget.classList.contains("active");
    event.currentTarget.classList.toggle("active");
    this.navigatorImageContainerEl.classList.toggle("hide");
    // console.log(this.canvasEl.toDataURL());
    this.updateNavigator();
  }

  updateNavigator() {
    if (!this.IsNavigatorVisible) return;
    this.navigatorImageEl.src = this.canvasEl.toDataURL();
  }

  onClickEraser(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "ERASER";
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.brushPanelEl.classList.add("hide");
    event.currentTarget.classList.toggle("active");
    this.brushEl.classList.remove("active");
  }

  onMouseOut() {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onChangeColor(event) {
    this.brushSizePreviewEl.style.backgroundColor = event.target.value;
  }

  onChangeBrushSize(event) {
    this.brushSizePreviewEl.style.width = `${event.target.value}px`;
    this.brushSizePreviewEl.style.height = `${event.target.value}px`;
  }

  onMouseUp() {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = false;
    this.updateNavigator();
  }

  onMouseDown(event) {
    if (this.MODE === "NONE") return;
    this.IsMouseDown = true;
    const currentPosition = this.getMousePosition(event);
    this.context.beginPath();
    this.context.moveTo(currentPosition.x, currentPosition.y);
    this.context.lineCap = "round";
    if (this.MODE === "BRUSH") {
      this.context.strokeStyle = this.colorPickerEl.value;
      this.context.lineWidth = this.brushSliderEl.value;
    } else if (this.MODE === "ERASER") {
      this.context.strokeStyle = this.eraserColor;
      this.context.lineWidth = 50;
    }
    this.saveState();
  }

  onMouseMove(event) {
    if (!this.IsMouseDown) return;
    const currentPosition = this.getMousePosition(event);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }

  getMousePosition(event) {
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  }

  onClickBrush(event) {
    const IsActive = event.currentTarget.classList.contains("active");
    this.MODE = IsActive ? "NONE" : "BRUSH";
    this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
    this.brushPanelEl.classList.toggle("hide");
    event.currentTarget.classList.toggle("active");
    this.eraserEl.classList.remove("active");
  }
}

new DrawingBoard();
