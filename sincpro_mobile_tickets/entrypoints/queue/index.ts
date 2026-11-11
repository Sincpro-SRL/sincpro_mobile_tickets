/**
 * The tickets event handlers — the entrypoints the queue delivers its events to: each translates
 * an event into a Command of `ticketsBoundedContext`. Importing this registers them.
 */
export { OnOdooSession } from "@sincpro/mobile-tickets/entrypoints/queue/odoo_session.handler";
