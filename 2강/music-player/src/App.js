import "./App.scss";
import Controls from "./components/Controls/Controls";
import PlayList from "./components/PlayList/PlayList";
import ProgressArea from "./components/ProgrssArea/ProgressArea";
import SongDetail from "./components/SongDetail/SongDetail";
import React, { useRef, useState } from "react";
import { useCallback } from "react";

function App() {
  const [showPlayList, setShowPlayList] = useState(false)

  const audioRef = useRef()

  const onPlay = useCallback(() => {
    audioRef.current.play()
  },[])

  const onPause = useCallback(() => {
    audioRef.current.pause()
  },[])

  const changeVolume = useCallback((volume) => {
    audioRef.current.changeVolume(volume)
  },[])

  const resetDuration = useCallback(() => {
    audioRef.current.resetDuration()
  },[])

  return (
    <div className="App">
      <div className="container" >
        <SongDetail />
        <ProgressArea ref={audioRef}/>
        <Controls setShowPlayList={setShowPlayList} play={onPlay} pause={onPause} changeVolume={changeVolume} resetDuration={resetDuration}/>
        <PlayList setShowPlayList={setShowPlayList} showPlayList={showPlayList}/>
      </div>
    </div>
  );
}

export default App;
