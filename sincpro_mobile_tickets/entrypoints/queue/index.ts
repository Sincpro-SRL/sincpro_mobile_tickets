import { Subscriber } from "@sincpro/mobile/domain/event_sourcing";

import { LoggedSuccessfullySubscriber } from "./loggedSuccessfully.subscriber";

export const TicketsSubscribers: Subscriber[] = [new LoggedSuccessfullySubscriber()];
