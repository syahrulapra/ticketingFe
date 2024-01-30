import { Route as rootRoute } from './pages/__root'
import { Route as LayoutImport } from './pages/LayoutPage'
import { Route as TicketImport } from './pages/TicketPage'
import { Route as TicketAnsweredImport } from './pages/TicketAnsweredPage'
import { Route as LoginImport } from './pages/LoginPage'
import { Route as RegisterImport } from './pages/RegisterPage'

const LayoutRoute = LayoutImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const RegisterRoute = RegisterImport.update({
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const TicketRoute = TicketImport.update({
  path: '/ticket',
  getParentRoute: () => LayoutRoute,
} as any)

const TicketAnsweredRoute = TicketAnsweredImport.update({
  path: '/ticketanswered',
  getParentRoute: () => LayoutRoute,
} as any)

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/dashboard': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/ticket': {
      preLoaderRoute: typeof TicketImport
      parentRoute: typeof LayoutRoute
    }
    '/ticketanswered': {
      preLoaderRoute: typeof TicketAnsweredImport
      parentRoute: typeof LayoutRoute
    }
  }
}

export const routeTree = rootRoute.addChildren([LayoutRoute.addChildren([TicketRoute, TicketAnsweredRoute]), LoginRoute, RegisterRoute])