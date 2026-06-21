import { DomainEvent } from "@sincpro/mobile/domain";
import { Subscriber } from "@sincpro/mobile/domain/event_sourcing";
import { OdooLoggedInEvent } from "@sincpro/mobile-odoo/domain/auth/events";
import { loggerUseCases } from "@sincpro/mobile/infrastructure/logger";

export class LoggedSuccessfullySubscriber extends Subscriber {
  public readonly requiresAuth = false;
  listen = [OdooLoggedInEvent];

  getEvent(event: DomainEvent): OdooLoggedInEvent {
    return OdooLoggedInEvent.from(event);
  }

  async process(event: OdooLoggedInEvent): Promise<void> {
    loggerUseCases.info("[Tickets] Reacting to Odoo login event", {
      uid: event.uid,
      userName: event.userName,
    });

    // TODO: Implementar lógica específica para tickets después del login
    // Posibles acciones:
    // - Cargar configuración específica de tickets
    // - Sincronizar datos iniciales
    // - Registrar métricas de sesión
    // - Preparar cache de datos críticos
  }
}
