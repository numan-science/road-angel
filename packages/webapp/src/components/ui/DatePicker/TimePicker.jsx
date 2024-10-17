import React, { useState } from 'react';

const TimePicker = ({ availableHours, availableMinutes }) => {
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [manualInput, setManualInput] = useState(false);

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
    setManualInput(false); // Disable manual input when an option is selected.
  };

  const handleMinuteChange = (event) => {
    setSelectedMinute(event.target.value);
    setManualInput(false); // Disable manual input when an option is selected.
  };

  const handleManualInput = (event) => {
    const value = event.target.value;
    // Validate manual input (hour between 0-23, minute between 0-59).
    if (/^\d{1,2}$/.test(value) && value >= 0 && value < 24) {
      setSelectedHour(value);
      setManualInput(true);
    }
  };

  return (
    <div className="time-picker">
      <select value={selectedHour} onChange={handleHourChange}>
        <option value="" disabled>
          Hour
        </option>
        {availableHours.map((hour) => (
          <option key={hour} value={hour}>
            {hour < 10 ? `0${hour}` : hour}
          </option>
        ))}
      </select>
      <span>:</span>
      <select value={selectedMinute} onChange={handleMinuteChange}>
        <option value="" disabled>
          Minute
        </option>
        {availableMinutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute < 10 ? `0${minute}` : minute}
          </option>
        ))}
      </select>
      <div>
        <input
          type="text"
          value={selectedHour}
          onChange={handleManualInput}
          placeholder="Hour"
          disabled={!manualInput}
        />
        <span>:</span>
        <input
          type="text"
          value={selectedMinute}
          onChange={handleManualInput}
          placeholder="Minute"
          disabled={!manualInput}
        />
      </div>
    </div>
  );
};

export default TimePicker;
