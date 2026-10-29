import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export const Layout = () => (
  <>
    <NavBar />
    <main className="page-container">
      <Outlet />
    </main>
  </>
);
