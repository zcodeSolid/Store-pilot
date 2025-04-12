import DashboardHeader from './components/DashboardHeader';
import DashboardFooter from './components/DashboardFooter';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader /> {/* Dashboard-specific header */}
      <main className="flex-grow p-4">{children}</main>
      <DashboardFooter /> {/* Dashboard-specific footer */}
    </div>
  );
}
