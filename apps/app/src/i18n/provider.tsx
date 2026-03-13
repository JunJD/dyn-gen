"use client";

import { createContext, ReactNode, useContext } from "react";
import {
  type AppLocale,
  type AppMessages,
  DEFAULT_LOCALE,
  getMessages,
} from "./messages";

type LocaleContextValue = {
  locale: AppLocale;
  messages: AppMessages;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  messages: getMessages(DEFAULT_LOCALE),
});

export function AppLocaleProvider({
  children,
  locale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  locale?: AppLocale;
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages: getMessages(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useAppMessages() {
  return useContext(LocaleContext).messages;
}

export function useAppLocale() {
  return useContext(LocaleContext).locale;
}
