"use client"
import React, { useState, useEffect } from 'react';
import styles from "./chart.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Sunday',
    Yakshit: 3701,
    Zaidali: 2888,
    Shubraja: 4333,
  },
  {
    name: 'Monday',
    Shubraja: 2021,
    Yakshit: 1922,
    Zaidali: 3567,
  },
  {
    name: 'Tuesday',
    Shubraja: 4977,
    Yakshit: 4123,
    Zaidali: 4999,
  },
  {
    name: 'Wednesday',
    Shubraja: 2444,
    Yakshit: 3010,
    Zaidali: 4855,
  },
  {
    name: 'Thursday',
    Shubraja: 3700,
    Yakshit: 4990,
    Zaidali: 2654,
  },
  {
    name: 'Friday',
    Shubraja: 1356,
    Yakshit: 4123,
    Zaidali: 2987,
  },
  {
    name: 'Saturday',
    Shubraja: 4877,
    Yakshit: 3402,
    Zaidali: 4655,
  },
];

const Chart = () => {
  const [usedColors, setUsedColors] = useState([]);

  useEffect(() => {
    const randomComponent = () => Math.floor(Math.random() * 190) + 55;
    const colors = [];
    for (let i = 0; i < Object.keys(data[0]).length - 1; i++) {
      let color;
      do {
        const red = randomComponent();
        const green = randomComponent();
        const blue = randomComponent();
        color = `rgb(${red}, ${green}, ${blue})`;
      } while (colors.includes(color));
      colors.push(color);
    }
    setUsedColors(colors);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{background: "#151c2c"}}/>
          <Legend />
          {Object.keys(data[0])
            .filter(key => key !== 'name')
            .map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={usedColors[index]}
                strokeDasharray="5 5"
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
