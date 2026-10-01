import React from "react";
import PropTypes from "prop-types";
import ChartView from "./ChartView";

const Dashboard = ({ data, onDelete, onEdit }) => {
  const avgScore =
    data.length > 0
      ? (data.reduce((acc, item) => acc + item.qualityScore, 0) / data.length).toFixed(2)
      : 0;
  const maxScore = data.length > 0 ? Math.max(...data.map((r) => r.qualityScore)) : 0;
  const minScore = data.length > 0 ? Math.min(...data.map((r) => r.qualityScore)) : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Sleep Records ({data.length})</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Avg: <strong>{avgScore}</strong> | Max: <strong>{maxScore}</strong> | Min: <strong>{minScore}</strong>
        </div>
      </div>
      {data.length > 0 && (
        <div className="chart-container">
          <ChartView data={data} />
        </div>
      )}
      {data.length === 0 ? (
        <p>No records available.</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id || item._id} className="record-card">
              <div className="record-details">
                <strong>{item.date}</strong>
                <span>⏱️ {item.sleepHours}h</span>
                <span>💤 {item.deepSleep}h Deep</span>
                <span>🔔 {item.interruptions} Int.</span>
                <span>☕ {item.caffeineIntake}mg</span>
                <span style={{ 
                  backgroundColor: item.qualityScore >= 80 ? 'rgba(16, 185, 129, 0.2)' : item.qualityScore >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: item.qualityScore >= 80 ? 'var(--success)' : item.qualityScore >= 60 ? '#d97706' : 'var(--danger)'
                }}>Score: {item.qualityScore}</span>
                {item.notes && <div className="notes">Notes: {item.notes}</div>}
              </div>
              <div className="card-actions">
                {onEdit && (
                  <button className="edit-btn" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button className="delete-btn" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      _id: PropTypes.string,
      date: PropTypes.string,
      sleepHours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      deepSleep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      interruptions: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      caffeineIntake: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      qualityScore: PropTypes.number,
      notes: PropTypes.string,
    })
  ).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default Dashboard;