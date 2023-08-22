import React from 'react';
import './Habits.css';

function HabitCompletionGrid({ completions }) {
  return (
    <div className="grid-container">
      {completions.map((completion, index) => (
        <div
          className={`completion-box ${completion ? 'completed' : 'not-completed'}`}
          key={index}
        />
      ))}
    </div>
  );
}

export default HabitCompletionGrid;
