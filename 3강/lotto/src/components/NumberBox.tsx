import styled from "@emotion/styled"
import { useState } from "react"

const StyledNumberBox = styled.select<{num:number}>`
    width: 48px;
    height: 48px;
    border : #48aeff solid 1px;
    font-size: 14px;
    color: #48aeff;

    appearance: none;
    text-align: center;

    &:disabled {
        border: #48aeff solid 1px;
        color : #48aeff;
        opacity: 1;
    }
`

const NumberBox = (
    {num, setNum} : {
        num? : number;
        setNum? : (num:number) => void;
    }
) => {

    return (
        <StyledNumberBox 
        num={num ?? 0}
        value={num ?? "+"} 
        onClick={(e) => {
            e.preventDefault()
            e.stopPropagation();
            return false;
        }} 
        disabled={!setNum}
        onChange={(e) => {
            if(setNum)
            setNum(parseInt(e.target.value))}}
        >
            {
                !num ? <option>+</option> :
                Array(45).fill(0).map((value, idx) => <option key={idx}>{idx}</option>)
            }
        </StyledNumberBox>
    )

}

export default NumberBox;