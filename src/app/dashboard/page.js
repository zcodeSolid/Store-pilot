import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect(process.env.NEXT_PUBLIC_APP_URL);
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
    </div>
  );
}
