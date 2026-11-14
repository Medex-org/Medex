import { Redirect, useLocation } from 'wouter';
import { useAuth } from './AuthProvider';
import { hasAdminAccess } from './access';
import { Spinner } from '@/components/ui/spinner';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="size-6 text-accent" />
      </div>
    );
  }

  if (!session || !profile || !hasAdminAccess(profile.role)) {
    return <Redirect to={`/admin/login`} />;
  }

  return <>{children}</>;
}
