import { useNavigation } from "@react-navigation/native";
import { CommandPrintTestPage, commonBoundedContext } from "@sincpro/mobile";
import { BluetoothPrinterSelector } from "@sincpro/mobile/ui/components/organisms";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import { Display, type IconName } from "@sincpro/mobile-ui/Display";
import { FormViewV2 } from "@sincpro/mobile-ui/views/FormViewV2";
import dayjs from "dayjs";

import { useFailedPrints } from "./use_failed_prints";

type RowIconProps = { size?: number; color?: string };

const rowIcon = (name: IconName) =>
  function RowIcon({ size, color }: RowIconProps) {
    return <Display.Icon color={color} name={name} size={size} />;
  };

const TestPageIcon = rowIcon("printer");
const FailedIcon = rowIcon("error");
const AllPrintedIcon = rowIcon("success");
const RetryIcon = rowIcon("sync");

/** Printer connection, a test page and the last prints that did not come out. */
function PrinterScreen() {
  const navigation = useNavigation();
  const { latest, total } = useFailedPrints();
  const openFailed = () => navigation.navigate(AppScreen.FAILED_PRINTS as never);

  return (
    <FormViewV2.Root
      description="Conexión, prueba y estado de las impresiones"
      item={{}}
      name="Impresora"
    >
      <FormViewV2.Header variant="large" />
      <FormViewV2.Content>
        <FormViewV2.Content.Section title="Impresora">
          <BluetoothPrinterSelector compact />
        </FormViewV2.Content.Section>
        <FormViewV2.Content.Section title="Prueba">
          <Display.MenuButton
            description="Imprime una hoja para verificar la conexión"
            icon={TestPageIcon}
            label="Imprimir página de prueba"
            // The use case tells the cashier whether it printed; its run records why not.
            onPress={() =>
              void commonBoundedContext
                .execute(new CommandPrintTestPage())
                .catch(() => undefined)
            }
            showDivider={false}
          />
        </FormViewV2.Content.Section>
        <FormViewV2.Content.Section title="Impresiones fallidas">
          {latest.length === 0 ? (
            <Display.MenuButton
              description="Todo lo que se envió a la impresora salió"
              icon={AllPrintedIcon}
              label="Sin impresiones fallidas"
              showDivider={false}
              variant="success"
            />
          ) : (
            latest.map((row) => (
              <Display.MenuButton
                description={`${dayjs(row.when).format("DD/MM HH:mm")} · ${row.reason}`}
                icon={FailedIcon}
                key={row.id}
                label={row.title}
                onPress={openFailed}
                variant="danger"
              />
            ))
          )}
          {total > 0 ? (
            <Display.MenuButton
              badge={total}
              description="Con la imagen, para reintentar lo que no salió"
              icon={RetryIcon}
              label="Ver y reintentar"
              onPress={openFailed}
              showDivider={false}
            />
          ) : null}
        </FormViewV2.Content.Section>
      </FormViewV2.Content>
    </FormViewV2.Root>
  );
}

export { PrinterScreen };
