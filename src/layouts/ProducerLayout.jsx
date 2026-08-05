import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function ProducerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Outlet />
      </div>
    </div>
  );
}