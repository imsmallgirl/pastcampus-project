import React, { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button';

type Cursor = "blue_cursor" | "cursor1" | "cursor2" | "cursor3" ;

const cursors:Cursor[] = [
  "blue_cursor",
  "cursor1",
  "cursor2",
  "cursor3"
]

function App() {

  const [selectedCursor, setSelectedCursor] = 
        useState<Cursor>("blue_cursor");
  const [cursorPosition, setCursorPosition] = useState([0,0])

  useEffect(() => {
    const event = ({clientX, clientY} : MouseEvent) => {

      const pos = [clientX, clientY]
      
      switch(selectedCursor){
        case "blue_cursor" :
          pos[0] -= 4;
          pos[1] -= 5;
          break;
        case "cursor1":
          pos[0] -= 4;
          pos[1] -= 5;
          break;
        case "cursor2" :
          pos[0] -= 8;
          pos[1] -= 5;
          break;
        case "cursor3" :
          pos[0] -= 5;
          pos[1] -= 5;
          break;
      }
      
      setCursorPosition(pos)
    }
    window.addEventListener("mousemove", event)

    return () => window.removeEventListener("mousemove", event)
  }, [selectedCursor])

  return (
    <>
      <img src={`/images/${selectedCursor}.png`} alt={selectedCursor}
      style={{
        pointerEvents:"none",
        position:"fixed",
        left: cursorPosition[0],
        top: cursorPosition[1],
        width: "20px"
      }}
      />
      <div style={{fontSize : "24px"}}>
        버튼을 눌러서 마우스 커버를 바꿔보세요.
      </div>
      <div style={{marginTop:"16px", display:"flex", gap:"20px", flexWrap:"wrap"}}>
        {/* 버튼 목록 */}
        {
          cursors.map((cursor) => <Button 
          onClick={() => setSelectedCursor(cursor)}
          key={cursor} name={cursor} selected={selectedCursor === cursor} /> )
        }
      </div>
    </>
  );
}

export default App;
