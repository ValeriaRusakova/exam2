import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navigation.css';

function Navigation() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link to="/">דף הבית</Link>
        <Link to="/history">היסטוריה</Link>
        <Link to="/about">אודות</Link>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="החלף ערכת נושא">
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}

export default Navigation;
