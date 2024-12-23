import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-section">
          <Link to="/" className="navbar-logo">The Blog Times</Link>
          <div className="navbar-date">{getCurrentDate()}</div>
        </div>
        <div className="navbar-links">
          <Link to="/posts">Статьи</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="btn-create">Написать</Link>
              <Link to="/profile" className="btn-profile">Профиль</Link>
              <button onClick={handleLogout} className="btn-logout">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 