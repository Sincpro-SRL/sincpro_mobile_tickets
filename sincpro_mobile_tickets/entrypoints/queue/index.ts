import { Subscriber } from "@sincpro/mobile/event_driven";

import { LoggedSuccessfullySubscriber } from "./loggedSuccessfully.subscriber";

export const TicketsSubscribers: Subscriber[] = [new LoggedSuccessfullySubscriber()];
