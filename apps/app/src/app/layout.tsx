import "./globals.css";

import { CopilotKit } from "@copilotkit/react-core";
import { AppLocaleProvider } from "@/i18n/provider";
import { DEFAULT_LOCALE, getMessages } from "@/i18n/messages";
import { ThemeProvider } from "@/hooks/use-theme";
import type { Metadata } from "next";

const localeMessages = getMessages(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: localeMessages.metadata.title,
  description: localeMessages.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <body className="antialiased">
        <AppLocaleProvider locale={DEFAULT_LOCALE}>
          <ThemeProvider>
            <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
          </ThemeProvider>
        </AppLocaleProvider>
      </body>
    </html>
  );
}
