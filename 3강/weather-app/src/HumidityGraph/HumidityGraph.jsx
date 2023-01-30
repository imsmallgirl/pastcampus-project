import React, { useContext } from "react";
import { Bar } from "recharts";
import { XAxis } from "recharts";
import { BarChart } from "recharts";
import { WeatherContext } from "../WeatherProvider/WeatherProvider";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const formatXAxis = (data) => `${new Date(data * 1000).getHours()}시`;

const CustomizedLabel = function ({ x, y, value }) {
  return (
    <text x={x + 30} y={y - 2} fontSize="15" textAnchor="middle">
      {value}%
    </text>
  );
};

const BarGraph = ({ num }) => {
  const { hour } = useContext(WeatherContext);
  return (
    <BarChart
      width={960}
      height={200}
      data={hour
        .slice(num * 12, (num + 1) * 12)
        .map(({ time_epoch, humidity }) => ({ dt: time_epoch, humidity }))}
      margin={{
        top: 30,
        right: 30,
        left: 30,
        bottom: 10,
      }}
    >
      <XAxis dataKey="dt" fontSize={15} tickFormatter={formatXAxis} />
      <Bar
        dataKey="humidity"
        fill="#2c6cff"
        isAnimationActive={false}
        label={<CustomizedLabel />}
      />
    </BarChart>
  );
};

const HumidityGraph = () => {
  const slides = [];
  for (let i = 0; i < 2; i++) {
    slides.push(
      <SwiperSlide key={i}>
        <BarGraph num={i} />
      </SwiperSlide>
    );
  }
  return (
    <Swiper navigation={true} modules={[Navigation]}>
      {slides}
    </Swiper>
  );
};

export default HumidityGraph;
