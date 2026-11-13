import { useCommon } from "@sincpro/mobile";
import type { EventRecord } from "@sincpro/mobile/domain/events";
import { DeadLetterQueueList } from "@sincpro/mobile/ui/screens";
import {
  printImage,
  PRINTS,
  printTitle,
} from "@sincpro/mobile-tickets/services/prints/common";
import { Display } from "@sincpro/mobile-ui/Display";

function renderPrintPreview(event: EventRecord) {
  const image = printImage(event);
  if (!image) return null;
  return (
    <Display.DocumentPreview
      fit="contain"
      height={260}
      source={{ base64: image, mimeType: "image/png" }}
      title={printTitle(event)}
    />
  );
}

/**
 * The core's failed events screen, listing only prints: search, order, attempts and retry, plus
 * the ticket that did not come out. A retry sends each failure once; once it prints it leaves
 * the list. Event names and payloads show only in debug mode.
 */
function FailedPrintsScreen({ onBack }: { onBack: () => void }) {
  const { debugMode } = useCommon();
  return (
    <DeadLetterQueueList
      description="Lo que se mandó a imprimir y no salió"
      eventTitle={printTitle}
      name="Impresiones fallidas"
      onBack={onBack}
      renderDetail={renderPrintPreview}
      scope={PRINTS}
      showTechnical={debugMode}
    />
  );
}

export { FailedPrintsScreen };
