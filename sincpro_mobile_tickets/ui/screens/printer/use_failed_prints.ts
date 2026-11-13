import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";
import { UIEventBus } from "@sincpro/mobile/infrastructure/ui/UIEventBus";
import {
  CommandListFailedPrints,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/services";
import type { FailedPrints } from "@sincpro/mobile-tickets/services/prints/common";
import { useEffect, useState } from "react";

const NONE: FailedPrints = { latest: [], total: 0 };

/**
 * The newest prints that did not come out and how many there are, kept current: the queue
 * announces every print request when it settles (`UIEventBus`, by its event name), whether it
 * came out or was set aside, so a new failure or a successful retry updates every screen that
 * shows them.
 */
export function useFailedPrints(): FailedPrints {
  const [failed, setFailed] = useState<FailedPrints>(NONE);

  useEffect(() => {
    let active = true;
    const reload = () => {
      ticketsBoundedContext.execute(new CommandListFailedPrints()).then(
        (prints) => {
          if (active) setFailed(prints);
        },
        () => {
          if (active) setFailed(NONE);
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
