import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import API, { updateRecord } from "../api";

const SleepForm = ({ fetchData, editing, setEditing, onSuccess }) => {
  const [form, setForm] = useState({
    date: "",
    sleepHours: "",
    deepSleep: "",
    interruptions: "",
    caffeineIntake: "",
    notes: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date || "",
        sleepHours: editing.sleepHours || "",
        deepSleep: editing.deepSleep || "",
        interruptions: editing.interruptions || "",
        caffeineIntake: editing.caffeineIntake || "",
        notes: editing.notes || ""
      });
    }
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateRecord(editing.id, form);
        setEditing(null);
      } else {
        await API.post("/", form);
      }
      fetchData();
      setForm({
        date: "",
        sleepHours: "",
        deepSleep: "",
        interruptions: "",
        caffeineIntake: "",
        notes: ""
      });
      if (onSuccess && !editing) onSuccess();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sleep-form">
      {error && <p className="error">{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', width: '100%' }}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required title="Sleep Date" />
        <input
          type="number"
          name="sleepHours"
          placeholder="Total Hours (e.g. 7.5)"
          value={form.sleepHours}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="deepSleep"
          placeholder="Deep Sleep (h)"
          value={form.deepSleep}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', width: '100%' }}>
        <input
          type="number"
          name="interruptions"
          placeholder="Interruptions (count)"
          value={form.interruptions}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="caffeineIntake"
          placeholder="Caffeine (mg)"
          value={form.caffeineIntake}
          onChange={handleChange}
          required
        />
      </div>
      <textarea
        name="notes"
        placeholder="Additional notes about your sleep..."
        value={form.notes}
        onChange={handleChange}
        rows="2"
        style={{ width: "100%" }}
      />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button type="submit" style={{ flex: 1 }}>{editing ? "Update Record" : "Add Record"}</button>
      {editing && (
        <button type="button" onClick={() => { setEditing(null); setForm({ date: "", sleepHours: "", deepSleep: "", interruptions: "", caffeineIntake: "", notes: "" }); }} style={{ flex: 1 }}>
          Cancel
        </button>
      )}
      </div>
    </form>
  );
};

SleepForm.propTypes = {
  fetchData: PropTypes.func.isRequired,
};

export default SleepForm;