import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { title } from 'process';

declare global {
  interface Window {
    loadMap : () => void
    kakao: any
    setCenter : any
  } 
}

function App() {

  const mapRef = useRef<HTMLDivElement>(null)
  const [markerList, setMarkerList] = useState<any[]>([])
  const map = useRef<any>(null)

  useEffect(() => {


    const script = document.createElement('script')

    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=	b9531a6af87d5479410573a16effe6a5&autoload=false";

    document.head.appendChild(script)

    script.onload = () => {

        window.kakao.maps.load(() => {
          if(mapRef.current){
            var options = { //지도를 생성할 때 필요한 기본 옵션
              center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
              level: 3, //지도의 레벨(확대, 축소 정도)
            };
            
            map.current = new window.kakao.maps.Map(mapRef.current, options) //지도 생성 및 객체 리턴

            window.kakao.maps.event.addListener(map.current, 'rightclick', (mouseEvent:any) => {
              const latlng = mouseEvent.latLng;
              const title = prompt("마커의 타이틀을 입력하세요")
              const marker = new window.kakao.maps.Marker({
                map: map.current,
                position: latlng,
                title,
            });

            setMarkerList(prev => [...prev , marker])

          });
          }
        })
        }

        return () => script.remove()
  }, [])
  return (
    <div>
      <button onClick={() => {
        map.current.setCenter(new window.kakao.maps.LatLng(37.5642135, 127.0016985))
        }}>서울로</button>
      <button onClick={() => {
        map.current.setCenter(new window.kakao.maps.LatLng(35.1795543, 129.0756416))
      }}>부산으로</button>
      <input type="range" min="1" max="20" onChange={(event) => {
        map.current.setLevel(event.currentTarget.value, {animate : true})
      }}/>
      <div ref={mapRef} style={{width: "500px", height: "500px"}}></div>
      {markerList.map((value) => <div onClick={() => {
        value.setMap(null)
        setMarkerList(markerList.filter(v => v !== value))
        }}>{value.getTitle()}</div>)}
    </div>
  );
}

export default App;
