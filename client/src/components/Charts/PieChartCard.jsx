import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartCard = ({ data, title }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: [
          "#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChartCard;
