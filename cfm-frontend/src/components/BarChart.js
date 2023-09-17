import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function BarChart({ id, data, language }) {
  // Sort the data in descending order by values
  const sortedData = Object.fromEntries(
    Object.entries(data).sort(([, valueA], [, valueB]) => valueB - valueA)
  );

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      // If the chart instance already exists, just update the data and options
      chartInstanceRef.current.data.labels = Object.keys(sortedData);
      chartInstanceRef.current.data.datasets[0].data =
        Object.values(sortedData);
      chartInstanceRef.current.update();
    } else {
      // If the chart instance does not exist, create a new one
      chartInstanceRef.current = new Chart(myChartRef, {
        type: "bar",
        data: {
          labels: Object.keys(sortedData),
          datasets: [
            {
              label: language === "en" ? "Message counts" : "Mesaj sayıları",
              data: Object.values(sortedData),
              backgroundColor: "#b728ee ",
              borderColor: " #850fb2 ",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "white", // Set the color of the axis ticks to white
                precision: 0, // Display only whole integers
                callback: function (value) {
                  if (value % 1 === 0) {
                    // Avoid displaying ".0" for whole numbers
                    return value.toString();
                  }
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.2)", // Set the color of the grid lines to white
              },
            },
            x: {
              ticks: {
                color: "white", // Set the color of the axis ticks to white
              },
              grid: {
                display: false, // Hide the x-axis grid lines
              },
            },
          },
          plugins: {
            title: {
              display: false,
              font: {
                size: 30,
                weight: "lighter",
              },
              text: "Message counts by countries",
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
  }, [id, sortedData]);

  return <canvas ref={chartRef} id={`barChart-${id}`} />;
}

export default BarChart;
