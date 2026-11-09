import type { IntegrationEvent } from "@sincpro/mobile/domain/events";
import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";
import { deadLetterQueueUseCases } from "@sincpro/mobile/services/dead_letter_queue.service";

export interface FailedPrint {
  id: string;
  title: string;
  when: string;
  reason: string;
}

/**
 * Prints are the only failed events a cashier sees. A print that came out is not in the dead
 * letter queue, so it is never offered again.
 */
export const isFailedPrint = (event: IntegrationEvent): boolean =>
  event.name === PrintImageRequestedEvent.name;

export const printTitle = (event: IntegrationEvent): string =>
  (event as PrintImageRequestedEvent).title || "Impresión";

/** The ticket that did not come out; null for prints saved before events kept their image. */
export function printImage(event: IntegrationEvent): string | null {
  const image = (event as PrintImageRequestedEvent).imageBase64;
  return image && !image.startsWith("[omitido") ? image : null;
}

/** The prints that never came out, newest first, for the printer tab summary. */
export async function loadFailedPrints(): Promise<FailedPrint[]> {
  const failed = await deadLetterQueueUseCases.getFailedEvents();
  return failed
    .filter(isFailedPrint)
    .map((event) => ({
      id: event.uuid,
      title: printTitle(event),
      when: event.failedAt ?? event.createdAt,
      reason: event.errorMessage ?? "No se pudo imprimir",
    }))
    .sort((a, b) => b.when.localeCompare(a.when));
}
