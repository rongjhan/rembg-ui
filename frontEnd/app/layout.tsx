"use client";
import type { Metadata } from "next";
import {Provider} from "react-redux";
import {makeStore} from "../_store/store";
import "./global.css";
import StyledComponentsRegistry from '../_lib/registry'

const metadata: Metadata = {
  title: "rembgui",
};

export default function RootLayout({
children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider store={makeStore()}>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}
