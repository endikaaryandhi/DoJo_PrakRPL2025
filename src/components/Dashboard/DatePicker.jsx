// src/components/Dashboard/DatePicker.jsx
import { useState } from 'react';

const DatePicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <div className="date-picker">
      <label>Filter berdasarkan tanggal:</label>
      <input type="date" value={selectedDate} onChange={handleChange} />
      {selectedDate && (
        <button onClick={() => { setSelectedDate(''); onDateChange(''); }}>
          Reset
        </button>
      )}
    </div>
  );
};

export default DatePicker;
