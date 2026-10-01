import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartView = ({ data }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sorted.map((r) => r.date);
    const scores = sorted.map((r) => r.qualityScore);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Quality Score",
            data: scores,
            borderColor: "rgba(99, 102, 241, 1)", // primary
            backgroundColor: "rgba(99, 102, 241, 0.15)", // primary-light
            borderWidth: 2,
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4, // smooth curve
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { size: 13, family: 'Inter' },
            bodyFont: { size: 13, family: 'Inter' },
            padding: 10,
            cornerRadius: 8,
          }
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { font: { family: 'Inter' }, color: 'var(--text-secondary)' }
          },
          y: {
            suggestedMin: 0,
            suggestedMax: 100,
            grid: { color: 'var(--card-border)', borderDash: [5, 5] },
            ticks: { font: { family: 'Inter' }, color: 'var(--text-secondary)' },
            beginAtZero: true
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
};

ChartView.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ChartView;
