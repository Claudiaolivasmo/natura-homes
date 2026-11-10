"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface Ctx {
  message: string | null;
  setMessage: (m: string | null) => void;
}

const WhatsAppContext = createContext<Ctx>({ message: null, setMessage: () => {} });

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  return <WhatsAppContext.Provider value={{ message, setMessage }}>{children}</WhatsAppContext.Provider>;
}

export function useWhatsAppMessage() {
  return useContext(WhatsAppContext).message;
}

/**
 * Drop into any page to give the floating WhatsApp button a page-specific
 * opening message (e.g. naming the property being viewed). Clears on leave.
 */
export function SetWhatsAppMessage({ message }: { message: string }) {
  const { setMessage } = useContext(WhatsAppContext);
  useEffect(() => {
    setMessage(message);
    return () => setMessage(null);
  }, [message, setMessage]);
  return null;
}
