import { useRef } from "react";

const debounce = (func) => {
  let timer; // 클로저를 이용하여 함수 내부에 timer 변수 선언

  return (e) => {
    if (timer) {
      clearTimeout(timer); // 타이머가 없기에 그냥 지나감
    }

    timer = setTimeout(func(e), 500); //500ms 후에 callAjaxRequest 를 실행하는 타이머를 설정
  };
};

const ex = () => {
  const inputRef = useRef(null);

  return (
    <div>
      <input type="text" ref={inputRef} />
    </div>
  );
};

export default ex;
