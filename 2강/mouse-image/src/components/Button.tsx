import React from 'react'


interface ButtonProps {
    selected? : boolean;
    name : string
    onClick : () => void;
}

function Button({selected, name, onClick} : ButtonProps) {
  return (
    <div style={{
        transition:"all .3s",
        width:"100px" 
        , height:"100px"
        , boxShadow:`0 0 0 ${selected ? "6px" : "1px"} black inset`
        , padding:"16px"
        }} 
        onClick={onClick}
        >
      <img src={`/images/${name}.png`} alt={name} width="100%" height="100%"/>
    </div>
  )
}

export default Button
