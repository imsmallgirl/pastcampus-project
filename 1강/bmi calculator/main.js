const onSubmit = (event) => {
    event.preventDefault()

    const w = parseFloat(event.target[0].value)
    const h = parseFloat(event.target[1].value)

    if(isNaN(w) || isNaN(h) || w <= 0 || h <= 0){
        alert("적절한 값이 아닙니다")
        return;
    }// 숫자가 둘 중에 하나라도 아닐 경우 + 입력한 값이 0 이하일 경우

    const bmi = w / (h*h)

    const res = document.getElementById("res")
    res.style.display = "flex"

    document.getElementById("bmi").innerText = bmi.toFixed(2)
    document.getElementById("meter").value = bmi
    
    let state = "정상"
    let common = true
    if(bmi < 18.5){
        state = "저체중"
        common = false;
    }
    if(bmi >= 25){
        state = "과체중"
        common = false;
    }

    const stateEl = document.getElementById("state")
    stateEl.innerText = state
    stateEl.style.color = common ? "#29ff21" : "#ff3a3a"
}