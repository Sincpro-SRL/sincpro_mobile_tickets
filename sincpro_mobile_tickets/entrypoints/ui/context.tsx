import { OdooSession } from "@sincpro/mobile-odoo/domain/auth";
import { IServer } from "@sincpro/mobile-odoo/domain/server";
import { useOdoo } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import { createContext, ReactNode, useContext } from "react";

interface ITicketsGlobalContext {
  session: OdooSession | null;
  serverParams: IServer | null;
  authIsLoading: boolean;
  authError: string | null;
  login: (user: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loadServerParams: () => Promise<void>;
  loadSession: () => Promise<void>;
  setServerParams: (server: IServer) => Promise<void>;
  deleteServerParams: () => Promise<void>;
}

const TicketsGlobalContext = createContext<ITicketsGlobalContext | undefined>(undefined);

interface TicketsGlobalProviderProps {
  children: ReactNode;
}

export function TicketsGlobalProvider({ children }: TicketsGlobalProviderProps) {
  const odooContext = useOdoo();

  const value: ITicketsGlobalContext = {
    session: odooContext.session,
    serverParams: odooContext.serverParams,
    authIsLoading: odooContext.authIsLoading,
    authError: odooContext.authError,
    login: odooContext.login,
    logout: odooContext.logout,
    loadServerParams: odooContext.loadServerParams,
    loadSession: odooContext.loadSession,
    setServerParams: odooContext.setServerParams,
    deleteServerParams: odooContext.deleteServerParams,
  };

  return (
    <TicketsGlobalContext.Provider value={value}>{children}</TicketsGlobalContext.Provider>
  );
}

export function useTicketsGlobal(): ITicketsGlobalContext {
  const context = useContext(TicketsGlobalContext);
  if (context === undefined) {
    throw new Error("useTicketsGlobal must be used within TicketsGlobalProvider");
  }
  return context;
}
