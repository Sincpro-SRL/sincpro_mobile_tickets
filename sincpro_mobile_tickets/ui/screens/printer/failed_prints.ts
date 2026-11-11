import type { EventRecord } from "@sincpro/mobile/domain/events";
import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";
import { eventService } from "@sincpro/mobile/services/event.service";

export interface FailedPrint {
  id: string;
  title: string;
  when: string;
  reason: string;
}

/** What a stored print request carries. */
type PrintValues = { title?: string; imageBase64?: string };

/**
 * Prints are the only failed events a cashier sees. A print that came out is never set aside,
 * so it is never offered again.
 */
export const isFailedPrint = (event: EventRecord): boolean =>
  event.name === PrintImageRequestedEvent.eventName;

export const printTitle = (event: EventRecord): string =>
  (event.payload as PrintValues | null)?.title || "Impresión";

/** The ticket that did not come out; null for prints saved before events kept their image. */
export function printImage(event: EventRecord): string | null {
  const image = (event.payload as PrintValues | null)?.imageBase64;
  return image && !image.startsWith("[omitido") ? image : null;
}

/** The prints the queue set aside, newest first, for the printer tab summary. */
export async function loadFailedPrints(): Promise<FailedPrint[]> {
  const failed = await eventService.listFailedEvents();
  return failed
    .filter(isFailedPrint)
    .map((event) => ({
      id: event.id,
      title: printTitle(event),
      when: event.settledAt ?? event.publishedAt,
      reason: event.error ?? "No se pudo imprimir",
    }))
    .sort((a, b) => b.when.localeCompare(a.when));
}
