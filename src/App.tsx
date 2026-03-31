import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import LoginPage from '@/pages/LoginPage'
import { ROUTES } from '@/config/routes'
import { Skeleton } from '@/components/ui/skeleton'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const WerkgeversListPage = lazy(() => import('@/pages/WerkgeversListPage'))
const WerkgeverPage = lazy(() => import('@/pages/WerkgeverPage'))
const OverzichtLonenPage = lazy(() => import('@/pages/OverzichtLonenPage'))
const PersoonPage = lazy(() => import('@/pages/PersoonPage'))
const ContractPage = lazy(() => import('@/pages/ContractPage'))
const LoonberekeningPage = lazy(() => import('@/pages/LoonberekeningPage'))
const BerichtenPage = lazy(() => import('@/pages/BerichtenPage'))
const PersonenListPage = lazy(() => import('@/pages/PersonenListPage'))
const ContractenListPage = lazy(() => import('@/pages/ContractenListPage'))
const LoonberekeningenListPage = lazy(() => import('@/pages/LoonberekeningenListPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

function withErrorBoundary(element: React.ReactNode) {
  return <ErrorBoundary>{element}</ErrorBoundary>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
})

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <DashboardPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.WERKGEVERS,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <WerkgeversListPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.WERKGEVER,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <WerkgeverPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.LONEN_OVERZICHT,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <OverzichtLonenPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.PERSOON,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <PersoonPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.CONTRACT,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <ContractPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.LOONBEREKENING,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <LoonberekeningPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.BERICHTEN,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <BerichtenPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.PERSONEN_LIST,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <PersonenListPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.CONTRACTEN_LIST,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <ContractenListPage />
          </Suspense>,
        ),
      },
      {
        path: ROUTES.LOONBEREKENINGEN_LIST,
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <LoonberekeningenListPage />
          </Suspense>,
        ),
      },
      {
        path: '*',
        element: withErrorBoundary(
          <Suspense fallback={<PageSkeleton />}>
            <NotFoundPage />
          </Suspense>,
        ),
      },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
