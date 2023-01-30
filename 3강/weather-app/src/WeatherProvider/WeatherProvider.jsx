import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const WeatherContext = createContext({});

const WeatherProvider = ({ children }) => {
  const [weatherInfo, setWeatherInfo] = useState({});

  const getWeatherInfo = () => {
    try {
      const success = async ({ coords }) => {
        const currentWeatherInfoAPI = `https://api.openweathermap.org/data/2.5/weather?appid=8f79f195073fde254a11c5208634d866&lat=${coords.latitude}&lon=${coords.longitude}&units=metric`;
        const currentWeatherInfo = await fetch(currentWeatherInfoAPI);

        const {
          name,
          main: { temp, humidity, feels_like, temp_max, temp_min },
          sys: { sunset, sunrise },
          weather: [{ main: weatherState }],
          wind: { speed, deg },
        } = await currentWeatherInfo.json();

        const hourlyWeatherInfoAPI = `http://api.weatherapi.com/v1/forecast.json?lat=${coords.latitude}&lon=${coords.longitude}&key=67c93a63bb57419eadf60020233001&aqi=yes&q=${coords.latitude},${coords.longitude}`;
        const hourlyWeatherInfo = await fetch(hourlyWeatherInfoAPI);
        const {
          forecast: {
            forecastday: [{ hour }],
          },
        } = await hourlyWeatherInfo.json();

        setWeatherInfo({
          name,
          temp,
          humidity,
          weatherState,
          feels_like,
          speed,
          deg,
          sunset,
          sunrise,
          temp_max,
          temp_min,
          hour,
        });
      };

      const error = (event) => {
        console.log(event);
      };
      window.addEventListener("load", () => {
        if (window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(success, error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWeatherInfo();
  }, []);

  return (
    <WeatherContext.Provider value={{ ...weatherInfo }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;
