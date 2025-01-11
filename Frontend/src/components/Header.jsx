/* eslint-disable no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const isToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">6CSE1</div>
        <nav>
          <Link to="/">Home</Link>
          {!isToken ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
               <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
               </>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
