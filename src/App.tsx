import { Suspense, lazy } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Spinner } from '@/components/ui/spinner';

const Home = lazy(() => import('@/pages/home'));
const About = lazy(() => import('@/pages/about'));
const Team = lazy(() => import('@/pages/team'));
const DeptResearch = lazy(() => import('@/pages/departments/research'));
const DeptEducation = lazy(() => import('@/pages/departments/education'));
const DeptMedicalExchange = lazy(() => import('@/pages/departments/medical-exchange'));
const DeptTechnology = lazy(() => import('@/pages/departments/technology'));
const DeptPartnerships = lazy(() => import('@/pages/departments/partnerships'));
const MedxMinds = lazy(() => import('@/pages/departments/medx-minds'));
const Events = lazy(() => import('@/pages/events'));
const CityReps = lazy(() => import('@/pages/city-reps'));
const Join = lazy(() => import('@/pages/join'));
const NotFound = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <Spinner className="size-6 text-accent" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/team" component={Team} />
        <Route path="/research" component={DeptResearch} />
        <Route path="/education" component={DeptEducation} />
        <Route path="/medical-exchange" component={DeptMedicalExchange} />
        <Route path="/technology" component={DeptTechnology} />
        <Route path="/partnerships" component={DeptPartnerships} />
        <Route path="/medx-minds" component={MedxMinds} />
        <Route path="/events" component={Events} />
        <Route path="/city-reps" component={CityReps} />
        <Route path="/join" component={Join} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
