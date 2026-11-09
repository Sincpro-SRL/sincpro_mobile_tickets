import { PrintImageRequestedEvent } from "@sincpro/mobile/domain/print/events";
import { UIEventBus } from "@sincpro/mobile/infrastructure/ui/UIEventBus";
import { useEffect, useState } from "react";

import { type FailedPrint, loadFailedPrints } from "./failed_prints";

/**
 * The prints that did not come out, kept current: the bus announces every print once it is
 * processed, whether it came out or failed, so a new failure or a successful retry updates
 * every screen that shows them.
 */
export function useFailedPrints(): FailedPrint[] {
  const [failed, setFailed] = useState<FailedPrint[]>([]);

  useEffect(() => {
    let active = true;
    const reload = () => {
      loadFailedPrints().then(
        (rows) => {
          if (active) setFailed(rows);
        },
        () => {
          if (active) setFailed([]);
        },
      );
    };
    reload();
    const stop = UIEventBus.on(PrintImageRequestedEvent.name, reload);
    return () => {
      active = false;
      stop();
    };
  }, []);

  return failed;
}
