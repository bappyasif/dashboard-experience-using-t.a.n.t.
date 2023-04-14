import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from "next-auth/react";
import { DashboardContextProvider } from '@/contexts';
import { HeroContent } from '@/components/header';
import { BackdropImage } from '@/components/backdrop';

export default function App({ Component, pageProps }) {
  const clientQuery = new QueryClient()

  // https://unsplash.com/photos/1oKxSKSOowE?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  // https://unsplash.com/photos/wmyE5IBiOmo?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  // https://unsplash.com/photos/73o_FzZ5x-w?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  // https://unsplash.com/photos/xh4mG4cqHGg?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  // https://unsplash.com/photos/aDu5aedOoD8?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
  // https://unsplash.com/photos/qD9xzm7yK9U?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink

  return (
    <SessionProvider session={pageProps.session}>
      <DashboardContextProvider>
        <QueryClientProvider client={clientQuery}>
          <BackdropImage />
          <HeroContent />
          <div className='flex gap-9 w-full'>
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
