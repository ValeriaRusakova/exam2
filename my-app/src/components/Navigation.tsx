import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/">דף הבית</Link>
      <Link to="/history">היסטוריה</Link>
      <Link to="/about">אודות</Link>
    </nav>
  );
}

export default Navigation;
