import { NavLink } from 'react-router-dom';

export const NavBar = () => (
  <header className="site-header">
    <div className="header-content">
      <NavLink className="site-name" to="/">
        Ai là triệu phú
      </NavLink>
      <nav className="main-nav" aria-label="Điều hướng chính">
        <NavLink to="/" end>
          Trang chủ
        </NavLink>
        <NavLink to="/questions">
          Ngân hàng câu hỏi
        </NavLink>
        <NavLink to="/history">
          Lịch sử
        </NavLink>
      </nav>
    </div>
  </header>
);
