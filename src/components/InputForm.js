import React, { useState } from 'react';
import './InputForm.css';

const InputForm = ({ onSubmit }) => {
  const [size, setSize] = useState('');
  const [generatedArray, setGeneratedArray] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (size > 0) {
      const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
      setGeneratedArray(array);
      onSubmit(array);
    }
  };

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit} className="input-form">
        <label className="form-label">
          Array Size:
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            min="1"
            max="50"
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button">Generate Array</button>
      </form>
      {generatedArray.length > 0 && (
        <div className="generated-array">
          <h3>Generated Array:</h3>
          <div className="array-display">
            {generatedArray.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
