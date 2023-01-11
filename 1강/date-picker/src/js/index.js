class DatePicker {
  monthData = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]; // month를 영문으로 보여주기 위해 만든 배열 데이터

  #calendarDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  }; // 캘린더의 데이터를 전역으로 사용하기 위해서 만든 객체 데이터

  selectedDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  }; // 선택된 캘린터의 데이터를 전역으로 사용하기 위해서 만든 객체 데이터

  datePickerEl; // data-picker 를 전체 요소를 묶고 있는 아이

  dateInputEl; // data-picker에서 달력을 toggle하고, 달력의 데이터를 보여주는 input

  calendarEl; // 달력을 묶고 있는 부모요소

  calendarMonthEl; // 달력에서 상단부분을 묶고 있는 부모요소

  monthContentEl; // 달력 상단에서 현재 년도와 월을 작성할 부분

  nextBtnEl; // 달력 다음 버튼

  prevBtnEl; // 달력 이전 버튼

  calendarDatesEl; // 달마다 일을 추가해줄 공간

  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    this.setDateInput();
    this.addEvent();
  }

  initCalendarDate() {
    const data = new Date(); // 현재 날짜에 대한 데이터
    const date = data.getDate(); // 현재 날짜에서 일 데이터를 가져옴
    const month = data.getMonth(); // 현재 날짜에서 월 데이터를 가져옴
    const year = data.getFullYear(); // 현재 날짜에서 년도 데이터를 가져옴
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    }; // 만들어놓은 변수 데이터에 가져온 데이터들을 넣어줌.
  }

  initSelectedDate() {
    this.selectedDate = { ...this.#calendarDate };
  }

  setDateInput() {
    this.dateInputEl.textContent = this.formateDate(this.selectedDate.data);
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }

  assignElement() {
    this.datePickerEl = document.getElementById('date-picker');
    this.dateInputEl = this.datePickerEl.querySelector('#date-input');
    this.calendarEl = this.datePickerEl.querySelector('#calendar');
    this.calendarMonthEl = this.calendarEl.querySelector('#month');
    this.monthContentEl = this.calendarEl.querySelector('#content');
    this.nextBtnEl = this.calendarEl.querySelector('#next');
    this.prevBtnEl = this.calendarEl.querySelector('#prev');
    this.calendarDatesEl = this.calendarEl.querySelector('#dates');
  }

  addEvent() {
    this.dateInputEl.addEventListener('click', this.toggleCalendar.bind(this)); // toggle 기능 구현
    this.nextBtnEl.addEventListener('click', this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener('click', this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      'click',
      this.onClickSelectDate.bind(this),
    );
  }

  onClickSelectDate(event) {
    const eventTarget = event.target; // 클릭한 요소를 eventTarget 변수에 담아주기
    if (eventTarget.dataset.date) {
      this.calendarDatesEl
        .querySelector('.selected')
        ?.classList.remove('selected');
      eventTarget.classList.add('selected');
      this.selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date,
        ), // 현재 달력의 년도, 월 그리고 클릭한 요소의 data-date(일) 을 입력
        year: this.#calendarDate.year, // 현재 달력의 년도
        month: this.#calendarDate.month, // 현재 달력의 달
        date: eventTarget.dataset.date, // 클릭한 요소의 data-date(일)
      };
      this.setDateInput();
      this.calendarEl.classList.remove('active');
    }
  }

  formateDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }
    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateDates();
    this.updateMonth();
  }

  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateDates();
    this.updateMonth();
  }

  toggleCalendar() {
    if (this.calendarEl.classList.contains('active')) {
      this.#calendarDate = { ...this.selectedDate };
    } // 돌아다니다가, 다시 토글해서 킬 때 선택 된 날짜의 월 보여주기
    this.calendarEl.classList.toggle('active');
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  updateDates() {
    this.calendarDatesEl.innerHTML = ''; // 만들어놓은 일 데이터를 초기화
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0,
    ).getDate(); // 현재 달의 일 수를 알아냄

    const fragment = new DocumentFragment();

    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement('div');
      dateEl.classList.add('date');
      dateEl.textContent = i + 1; // 0 부터 for 문이 돌아가기 때문에 +1
      dateEl.dataset.date = i + 1; // data-date 라는 속성을 추가해준다.
      fragment.appendChild(dateEl); // fragment 객체 트리에 먼저 만들어줌
    }
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1; // getDay()는 요일데이터를 index 번호로 데이터를 줌 그래서 +1 을 해야함
    this.calendarDatesEl.appendChild(fragment); // 찾아낸 달의 일 수 에 맞춰서 div 생성해줌 (day div)
    this.colorSaturday(); // 토요일 색상 변경
    this.colorSunday(); // 일요일은 색상 변경
    this.markToday(); // 당일 색상 변경
    this.markSelectedDate(); // 선택 된 날짜 보여주기
  }

  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add('selected');
    }
  }

  markToday() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add('today');
    }
  }

  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = 'blue';
    }
  }

  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n + ${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1,
          ).getDay()) %
        7
      })`,
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = 'red';
    }
  }
}

new DatePicker();
