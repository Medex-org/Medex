import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/home';
import About from '@/pages/about';
import Team from '@/pages/team';
import MedxMinds from '@/pages/medx-minds';
import Programs from '@/pages/programs';
import Events from '@/pages/events';
import CityReps from '@/pages/city-reps';
import Join from '@/pages/join';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/team" component={Team} />
      <Route path="/medx-minds" component={MedxMinds} />
      <Route path="/programs" component={Programs} />
      <Route path="/events" component={Events} />
      <Route path="/city-reps" component={CityReps} />
      <Route path="/join" component={Join} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
