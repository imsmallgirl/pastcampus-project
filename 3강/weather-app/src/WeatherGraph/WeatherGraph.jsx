import React, { useContext } from "react";
import { Line } from "recharts";
import { LabelList } from "recharts";
import { XAxis } from "recharts";
import { LineChart } from "recharts";
import CurrentWeatherIcon from "../CurrentWeatherIcon/CurrentWeatherIcon";
import { WeatherContext } from "../WeatherProvider/WeatherProvider";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const formatXAxis = (data) => `${new Date(data * 1000).getHours()}시`;

const CustomizedDot = ({ payload, cx, cy }) => (
  <CurrentWeatherIcon
    weatherState={payload.weather}
    x={cx - 13}
    y={cy - 5}
    fontSize={30}
  />
);

const CustomizeLabel = ({ x, y, value }) => (
  <text x={x} y={y} dy={-4} fontSize={15} textAnchor="middle">
    {value}°
  </text>
);

const LineGraph = ({ num }) => {
  const { hour } = useContext(WeatherContext);
  console.log(WeatherContext);
  return (
    <LineChart
      width={960}
      height={200}
      data={hour
        ?.slice(num * 12, (num + 1) * 12)
        .map(({ time_epoch, temp_c, condition }) => ({
          dt: time_epoch,
          temp: temp_c,
          weather: condition.text,
        }))}
      margin={{
        top: 30,
        right: 30,
        left: 30,
        bottom: 10,
      }}
    >
      <XAxis
        dataKey="dt"
        fontSize={15}
        tickFormatter={formatXAxis}
        tickMargin={20}
      />
      <Line
        dataKey="temp"
        stroke="#3cb371"
        strokeWidth={2}
        dot={<CustomizedDot />}
        isAnimationActive={false}
      >
        <LabelList content={<CustomizeLabel />} />
      </Line>
    </LineChart>
  );
};

const WeatherGraph = () => {
  const slides = [];
  for (let i = 0; i < 2; i++) {
    slides.push(
      <SwiperSlide key={i}>
        <LineGraph num={i} />
      </SwiperSlide>
    );
  }
  return (
    <Swiper navigation={true} modules={[Navigation]}>
      {slides}
    </Swiper>
  );
};

export default WeatherGraph;
