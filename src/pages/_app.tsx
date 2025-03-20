import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "coding-challenge/utils/api";

import "coding-challenge/styles/globals.css";
import { AppProvider } from "coding-challenge/context/AppContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
