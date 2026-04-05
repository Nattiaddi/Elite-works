import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // The Gold/Obsidian Navbar we built

const MainLayout = () => (
  <div className="bg-obsidian min-h-screen">
    <Navbar />
    <main>
      <Outlet /> {/* This is where the page content will inject */}
    </main>
  </div>
);