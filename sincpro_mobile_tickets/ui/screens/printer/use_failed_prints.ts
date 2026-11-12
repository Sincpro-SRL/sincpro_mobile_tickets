import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";
import { UIEventBus } from "@sincpro/mobile/infrastructure/ui/UIEventBus";
import {
  CommandListFailedPrints,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/services";
import type { FailedPrint } from "@sincpro/mobile-tickets/services/prints/common";
import { useEffect, useState } from "react";

/**
 * The prints that did not come out, kept current: the queue announces every print request when
 * it settles (`UIEventBus`, by its event name), whether it came out or was set aside, so a new
 * failure or a successful retry updates every screen that shows them.
 */
export function useFailedPrints(): FailedPrint[] {
  const [failed, setFailed] = useState<FailedPrint[]>([]);

  useEffect(() => {
    let active = true;
    const reload = () => {
      ticketsBoundedContext.execute(new CommandListFailedPrints()).then(
        (rows) => {
          if (active) setFailed(rows);
        },
        () => {
          if (active) setFailed([]);
        },
      );
    };
    reload();
    const stop = UIEventBus.on(PrintImageRequestedEvent.eventName, reload);
    return () => {
      active = false;
      stop();
    };
  }, []);

  return failed;
}
