import React from "react";
import CurrentWeather from "./CurrentWeather/CurrentWeather";
import ExtarInfo from "./ExtarInfo/ExtarInfo";
import "./style.css";
import TempInfo from "./TempInfo/TempInfo";
import WeatherTab from "./WeatherTab/WeatherTab";

const WeatherApp = () => {
  return (
    <div className="container">
      <CurrentWeather />
      <TempInfo />
      <ExtarInfo />
      <WeatherTab />
    </div>
  );
};

export default WeatherApp;
