import type { Criteria } from "@sincpro/criteria";
import type { EventRecord } from "@sincpro/mobile/domain/events";
import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";

/**
 * What the prints' use cases and their screens share: how a stored print request reads. Pure:
 * what a use case asks the core for is written in the use case.
 */

/** A print that did not come out, as the printer tab lists it. */
export interface FailedPrint {
  id: string;
  title: string;
  when: string;
  reason: string;
}

/** The printer tab's summary: the newest prints that did not come out, and how many there are. */
export interface FailedPrints {
  latest: FailedPrint[];
  total: number;
}

/** What a stored print request carries. */
type PrintValues = { title?: string; imageBase64?: string };

/**
 * Prints are the only failed events a cashier sees, read in SQL with the rest of the filters. A
 * print that came out is never set aside, so it is never offered again.
 */
export const PRINTS: Criteria<EventRecord> = {
  selection: { field: "name", operator: "=", value: PrintImageRequestedEvent.eventName },
};

export const printTitle = (event: EventRecord): string =>
  (event.payload as PrintValues | null)?.title || "Impresión";

/** The ticket that did not come out; null for prints saved before events kept their image. */
export function printImage(event: EventRecord): string | null {
  const image = (event.payload as PrintValues | null)?.imageBase64;
  return image && !image.startsWith("[omitido") ? image : null;
}
