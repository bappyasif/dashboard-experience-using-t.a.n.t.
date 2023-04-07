import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from "next-auth/react";
import { DashboardContextProvider } from '@/contexts';

export default function App({ Component, pageProps }) {
  const clientQuery = new QueryClient()

  return (
    <SessionProvider session={pageProps.session}>
      <DashboardContextProvider>
        <QueryClientProvider client={clientQuery}>
          <div className='flex gap-9'>
            <Navbar />
            <Component {...pageProps} />
          </div>
          <Footer />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </DashboardContextProvider>
    </SessionProvider>
  )
}
