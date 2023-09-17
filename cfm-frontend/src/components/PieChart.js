import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PieChart({ id, male, female, language }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      // If the chart instance already exists, just update the data and options
      chartInstanceRef.current.data.datasets[0].data = [male, female];
      chartInstanceRef.current.update();
    } else {
      // If the chart instance does not exist, create a new one
      chartInstanceRef.current = new Chart(myChartRef, {
        type: "pie",
        data: {
          labels: language === "en" ? ["Male", "Female"] : ["Erkek", "Kadın"],
          datasets: [
            {
              label:
                language === "en" ? "Gender Distribution" : "Cinsiyet Dağılımı",
              data: [male, female],
              backgroundColor: ["#007bff", "#ff007f"],
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false,
              font: {
                size: 30,
                weight: "lighter",
              },
              text: "Message counts by genders",
              color: "orange",
            },

            legend: {
              labels: {
                color: "white",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [id, male, female]);

  return <canvas ref={chartRef} id={`pieChart-${id}`} />;
}

export default PieChart;
