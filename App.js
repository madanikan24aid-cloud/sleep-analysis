import React, { useEffect, useState } from "react";
import { fetchWithFilter, deleteRecord, clearAll } from "./api";
import SleepForm from "./components/SleepForm";
import Dashboard from "./components/Dashboard";
import logo from "./logo.png";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [theme, setTheme] = useState("light");
  const [sortBy, setSortBy] = useState("date");
  const [editing, setEditing] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Entry, 2: Visualization

  const fetchData = async (optional = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithFilter(optional);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    fetchData(params);
  };

  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "" });
    fetchData();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortData = (arr) => {
    const copy = [...arr];
    if (sortBy === "date") {
      copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "score") {
      copy.sort((a, b) => b.qualityScore - a.qualityScore);
    }
    return copy;
  };

  const exportCSV = () => {
    const rows = [
      ["Date", "Sleep Hours", "Deep Sleep", "Interruptions", "Caffeine", "Score", "Notes"],
      ...sortData(data).map((r) => [
        r.date,
        r.sleepHours,
        r.deepSleep,
        r.interruptions,
        r.caffeineIntake,
        r.qualityScore,
        r.notes || "",
      ]),
    ];
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sleep-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecord(id);
      // if currently editing that entry, cancel
      if (editing && editing.id === id) setEditing(null);
      fetchData(filters.startDate || filters.endDate ? filters : {});
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all records?")) {
      try {
        await clearAll();
        setEditing(null);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // apply theme class to root element for CSS variables
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <header className="app-header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img src={logo} alt="Logo" style={{ height: '80px', width: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px var(--primary))' }} />
          <h1>Moonlight Sleep Stats</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Your professional companion for better rest.</p>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <nav className="step-nav">
        <button 
          className={currentStep === 1 ? "active" : ""} 
          onClick={() => setCurrentStep(1)}
        >
          📝 Log Sleep
        </button>
        <button 
          className={currentStep === 2 ? "active" : ""} 
          onClick={() => setCurrentStep(2)}
        >
          📊 View Trends
        </button>
      </nav>

      {error && <p className="error">Error: {error}</p>}

      <div className="main-content">
        {currentStep === 1 && (
          <section className="form-section fade-in">
            <h2>{editing ? "Edit Record" : "Add New Record"}</h2>
            <SleepForm fetchData={fetchData} editing={editing} setEditing={setEditing} onSuccess={() => setCurrentStep(2)} />
          </section>
        )}

        {currentStep === 2 && (
          <section className="data-section fade-in">
            <div className="toolbar">
              <div className="filter-bar">
                <label>
                  From: 
                  <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                </label>
                <label>
                  To: 
                  <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </label>
                <button onClick={applyFilters}>Apply</button>
                <button onClick={clearFilters}>Clear</button>
              </div>
              <div className="extras">
                <label>
                  Sort by: 
                  <select value={sortBy} onChange={handleSortChange}>
                    <option value="date">Date</option>
                    <option value="score">Quality Score</option>
                  </select>
                </label>
                <button onClick={exportCSV}>Export CSV</button>
                <button className="clear-all" onClick={handleClearAll}>Clear All</button>
              </div>
            </div>

            {loading ? <p>Loading...</p> : <Dashboard data={sortData(data)} onDelete={handleDelete} onEdit={handleEdit} />}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;