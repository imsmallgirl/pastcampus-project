export class Keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyPress = false;
  #mouseDown = false;

  constructor() {
    this.#assignElement();
    this.#addEvent();
  }
  #assignElement() {
    this.#containerEl = document.getElementById("container"); // 컨테이너의 하위 엘리멘트들을 탐색하기때문에 비용 절감효과
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#inputEl.addEventListener("input", this.#onInput.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
  } // 배경 테마 이벤트

  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
  } //폰트 변화 이벤트

  #onKeyDown(event) {
    if (this.#mouseDown) return;
    this.#keyPress = true;

    this.#inputGroupEl.classList.toggle(
      "error",
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(event.key)
    );
    this.#keyboardEl
      .querySelector(`[data-code = ${event.code}]`)
      ?.classList.add("active");
  } // 키를 입력했을 때

  #onKeyUp(event) {
    if (this.#mouseDown) return;
    this.#keyPress = false;

    this.#keyboardEl
      .querySelector(`[data-code = ${event.code}]`)
      ?.classList.remove("active");
  } // 키 입력이 끝났을 경우

  #onInput() {
    this.#inputEl.value = this.#inputEl.value.replace(
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
      ""
    );
  } // 한글 입력 금지 이벤트

  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#mouseDown = true;

    event.target.closest("div.key")?.classList.add("active");
  } // 키보드에 마우스 클릭시 이벤트

  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#mouseDown = false;

    const keyEl = event.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;

    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    } // key div 에 active 라는 클래스가 들어가있고, space, backspace 를 클릭한게 아니라면, 그 나머지 값을 인풋 값에 넣어준다.
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    } // space 를 클릭 시, input 값에 공백을 넣어준다.
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    } // backspace 를 클릭 시, 문자열의 마지막을 잘라준다.
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  } // 키보드에 마우스 클릭 완료시 이벤트
}
