import { OdooScreen } from "@sincpro/mobile-odoo/entrypoints/ui/AppScreen";

export enum AppScreen {
  LOGIN = OdooScreen.LOGIN,
  SERVER = OdooScreen.SERVER,
  RESET_ACCOUNT = OdooScreen.RESET_ACCOUNT,
  PROFILE = OdooScreen.PROFILE,
  ODOO_PORTAL = OdooScreen.ODOO_PORTAL,
  SETTINGS = OdooScreen.SETTINGS,
  DATABASE_LIST = OdooScreen.DATABASE_LIST,

  DEAD_LETTER_QUEUE = "DeadLetterQueue",
  EVENTS = "Events",

  MAIN = "Main",
  HOME = "Home",
}
