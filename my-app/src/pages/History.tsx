import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import './History.css';

interface SearchHistory {
  time: string;
  city: string;
  country: string;
}

function History() {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div className="page">
      <h1>היסטוריית חיפושים</h1>
      <Navigation />
      
      <div className="content">
        {history.length === 0 ? (
          <p>אין היסטוריית חיפושים</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>זמן חיפוש</th>
                <th>יישוב</th>
                <th>מדינה</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.city}</td>
                  <td>{item.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default History;
