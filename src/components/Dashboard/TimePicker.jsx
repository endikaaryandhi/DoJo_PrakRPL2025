// src/components/Dashboard/TimePicker.jsx
import { useState } from 'react';

const TimePicker = ({ onTimeChange, initialTime = '' }) => {
    const [selectedTime, setSelectedTime] = useState(initialTime);
  
    const handleChange = (e) => {
      const time = e.target.value;
      setSelectedTime(time);
      onTimeChange(time);
    };
  
    return (
      <div className="time-picker">
        <label>Waktu:</label>
        <input type="time" value={selectedTime} onChange={handleChange} />
      </div>
    );
  };

export default TimePicker;
