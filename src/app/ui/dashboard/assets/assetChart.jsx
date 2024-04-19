import React, { PureComponent, useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { db } from "@/app/firebase/config";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";

async function fetchAssetsFromFirestore(uid){
  try{
    const assetsDocs = await getDocs(collection(db,'Assets'));
    const data = [
      {name: 'Savings Account', value: 0, fill: '#f705bb75'},
      {name: 'Stocks', value: 0, fill: '#9cf72c75'},
      {name: 'Real Estate', value: 0, fill: '#f7737375'},
    ];

    for(const assetsDoc of assetsDocs.docs){
      const assetsData = assetsDoc.data();
      if(assetsData.uid === uid){
        const assetsIndex = data.findIndex((type) => type.name === assetsData.type);
        if (assetsIndex !== -1) {
          data[assetsIndex].value += assetsData.value;
        }
      }
    }

    console.log(data, uid);
    return data;
  }catch(error){
    console.error('Error fetching assets: ', error);
    return [];
  }
}


const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#fff">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const AssetChart = ({uid}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [assetsData, setAssetsData] = useState([]);
  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
        const data = await fetchAssetsFromFirestore(uid);
        setAssetsData(data)
    }
    fetchTransactions();
  }, []);

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={assetsData}
          cx='50%'
          cy='50%'
          innerRadius={80}
          outerRadius={100}
          fill="#8844d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />     
      </PieChart>
    </div>
    );
  }

  export default AssetChart;