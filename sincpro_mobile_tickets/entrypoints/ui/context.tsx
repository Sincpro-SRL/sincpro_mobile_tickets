import { OdooSession } from "@sincpro/mobile-odoo/domain/auth";
import { IServer } from "@sincpro/mobile-odoo/domain/server";
import { useOdoo } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import {
  CommandPrepareSession,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/services";
import { createContext, ReactNode, useContext, useEffect } from "react";

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
  const uid = odooContext.session?.uid;
  const companyId = odooContext.session?.companyId;

  // A session restored from the phone is prepared here; a new sign-in, by `OdooLoggedInEvent`.
  useEffect(() => {
    if (uid === undefined || companyId === undefined) return;
    void ticketsBoundedContext
      .execute(new CommandPrepareSession(uid, companyId))
      .catch(() => undefined);
  }, [uid, companyId]);

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
