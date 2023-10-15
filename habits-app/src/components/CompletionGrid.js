import React from 'react';
import './CompletionGrid.css'

const generatePastDates = (numDays) => {
    const dates = Array.from({ length: numDays }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });
    return dates;
  };
  
const CompletionGrid = ({ habit }) => {
    const dates = generatePastDates(14);
    const completionsMap = {};
  
    habit.completions.forEach(completion => {
      completionsMap[completion.date] = completion;
    });
  
    return (
      <table>
        <tbody>
          {[0, 1].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {dates.slice(rowIndex * 7, (rowIndex + 1) * 7).map(date => (
                <td key={date}>
                  {completionsMap[date] 
                    ? completionsMap[date].completed 
                      ? <span className="completed">🟩</span>
                      : <span className="not-completed">🟥</span>
                    : <span className="no-data">🟥</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  export default CompletionGrid;