export default class ImageSlider {
  #currentPosition = 0; // 현재 슬라이드 순서

  #sliderNumber = 0; // 총 슬라이드의 length

  #slideWidth = 0; // 슬라이드 한개의 넓이

  #intervalId; // setInterval 중지를 위해서 함수를 넣어놓을 공간

  #autoPlay = true; // setInterval이 실행중인지 알기 위한 변수

  sliderWrapEl; // 슬라이더의 전체 요소를 묶고 있는 아이

  sliderListEl; // 슬라이더의 컨텐츠들을 (즉 슬라이드 이미지들 )을 묶고 있는 아이

  nextBtnEl; // 다음 버튼

  previousBtnEl; // 이전 버튼

  indicatorWrapEl; // 인디케이터를 묶고 있는 부모 요소

  controlWrapEl; // Autoplay를 조절할 수 있게하는 버튼을 묶어놓은 부모 요소

  constructor() {
    this.assignElement();
    this.initSliderNumber();
    this.initSlideWidth();
    this.initSliderListWidth();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
    this.initAutoPlay();
  }

  assignElement() {
    this.sliderWrapEl = document.getElementById('slider-wrap');
    this.sliderListEl = this.sliderWrapEl.querySelector('#slider');
    this.nextBtnEl = this.sliderWrapEl.querySelector('#next');
    this.previousBtnEl = this.sliderWrapEl.querySelector('#previous');
    this.indicatorWrapEl = this.sliderWrapEl.querySelector('#indicator-wrap');
    this.controlWrapEl = this.sliderWrapEl.querySelector('#control-wrap');
  }

  initAutoPlay() {
    this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
  }

  initSliderNumber() {
    this.#sliderNumber = this.sliderListEl.querySelectorAll('li').length;
  } // 슬라이드의 개수를 알기 위한 초기함수

  initSlideWidth() {
    this.#slideWidth = this.sliderWrapEl.clientWidth;
  } // 슬라이드 컨텐츠의 한개 넓이를 알기 위한 함수

  initSliderListWidth() {
    this.sliderListEl.style.width = `${
      this.#sliderNumber * this.#slideWidth
    }px`;
  } // 슬라이드 컨텐츠의 개수와 슬라이드 한 개의 넓이를 곱해서, 전체 넓이를 동적으로 할당해주기 위한 함수

  addEvent() {
    this.nextBtnEl.addEventListener('click', this.moveToRight.bind(this));
    this.previousBtnEl.addEventListener('click', this.moveToLeft.bind(this));
    this.indicatorWrapEl.addEventListener(
      'click',
      this.onClickIndicator.bind(this),
    );
    this.controlWrapEl.addEventListener('click', this.togglePlay.bind(this));
  }

  togglePlay(event) {
    if (event.target.dataset.status === 'play') {
      this.#autoPlay = true;
      this.controlWrapEl.classList.add('play');
      this.controlWrapEl.classList.remove('pause');
      this.initAutoPlay();
    } else if (event.target.dataset.status === 'pause') {
      this.#autoPlay = false;
      this.controlWrapEl.classList.remove('play');
      this.controlWrapEl.classList.add('pause');
      clearInterval(this.#intervalId);
    }
  }

  onClickIndicator(event) {
    const indexPosition = parseInt(event.target.dataset.index, 10);
    if (Number.isInteger(indexPosition)) {
      this.#currentPosition = indexPosition;
      this.sliderListEl.style.left = `-${
        this.#slideWidth * this.#currentPosition
      }px`;
      this.setIndicator();
    }
  }

  moveToRight() {
    this.#currentPosition += 1;
    if (this.#currentPosition === this.#sliderNumber) {
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPosition
    }px`;
    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    this.setIndicator();
  }

  moveToLeft() {
    this.#currentPosition -= 1;
    if (this.#currentPosition === -1) {
      this.#currentPosition = this.#sliderNumber - 1;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPosition
    }px`;
    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    this.setIndicator();
  }

  createIndicator() {
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#sliderNumber; i += 1) {
      const li = document.createElement('li');
      li.dataset.index = i;
      docFragment.appendChild(li);
    }
    this.indicatorWrapEl.querySelector('ul').appendChild(docFragment);
  }

  setIndicator() {
    this.indicatorWrapEl.querySelector('li.active')?.classList.remove('active');
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add('active');
  }
}
