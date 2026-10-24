import { useState } from 'react';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mediaUrl } from '@/lib/media-url';

const medxLogo = mediaUrl("medx-logo.png");
const medxLogoWebp = mediaUrl("medx-logo.webp");

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!supabaseConfigured) {
      setError('Supabase is not configured for this deployment.');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <picture>
              <source srcSet={medxLogoWebp} type="image/webp" />
              <img src={medxLogo} alt="MEDX R&Ed" className="h-10 w-auto" />
            </picture>
            <span className="font-bold tracking-wider text-lg uppercase text-primary">
              MEDX R&amp;Ed
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-primary mb-2">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Sign in to access the content dashboard</p>
        </div>

        <div className="border-[1px] border-border bg-card p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
