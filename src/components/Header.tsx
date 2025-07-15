import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Полярная звезда</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className={`nav-item ${isActive("/")}`}>
              <Link to="/">HelpDesk</Link>
            </li>
            <li className={`nav-item ${isActive("/knowledge-base")}`}>
              <Link to="/knowledge-base">База знаний</Link>
            </li>
            <li className={`nav-item ${isActive("/it-assets")}`}>
              <Link to="/it-assets">IT-Активы</Link>
            </li>
          </ul>
        </nav>
        <div className="user-menu">
          <span className="user-name">Имя пользователя</span>
          <div className="user-avatar">U</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
