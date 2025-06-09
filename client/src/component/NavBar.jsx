import { useNavigate } from 'react-router-dom';
import '../../styles/NavBar.css';

export default function NavBar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include"
    });
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    navigate('/');
  };
  return (
    <nav className="nav-container">
      <div className="nav-item" onClick={() => navigate('/home')}>
        <img src="/static/icons/home.svg" alt="Home" />
      </div>
      <div className="nav-item" onClick={() => navigate('/profile')}>
        <img src="/static/icons/Profile.svg" alt="Profile" />
      </div>
      <div className="nav-item" onClick={() => navigate('/about')}>
        <img src="/static/icons/about.svg" alt="About" />
      </div>
      <div className="nav-item" onClick={handleLogout}>
        <img src="/static/icons/logout.svg" alt="Logout" />
      </div>
    </nav>
  );
}
