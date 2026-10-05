import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as loginRoute } from './routes/login';
import { Route as dashboardRoute } from './routes/dashboard';
import { Route as meetingsRoute } from './routes/meetings';
import { Route as attendanceRoute } from './routes/attendance';
import { Route as teamRoute } from './routes/team';

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  meetingsRoute,
  attendanceRoute,
  teamRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
