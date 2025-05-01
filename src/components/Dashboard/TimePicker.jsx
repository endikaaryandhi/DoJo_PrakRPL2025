import { useState } from 'react';

const TimePicker = ({ onTimeChange, initialTime }) => {
  const [time, setTime] = useState(initialTime);

  const handleChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    onTimeChange(newTime);  // Kirim waktu yang dipilih ke parent
  };

  return (
    <input
      type="time"
      value={time}
      onChange={handleChange}
      className="w-full border px-3 py-2 rounded"
    />
  );
};

export default TimePicker;
