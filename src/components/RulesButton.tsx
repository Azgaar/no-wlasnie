import { useState } from "react";
import { useLocale } from "../locales";
import { Button } from "./Button";
import { HeaderButton } from "./HeaderButton";
import { Modal } from "./Modal";

export function RulesButton() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <>
      <HeaderButton icon="rules" label={t.rules.action} onClick={() => setOpen(true)} />
      {open && (
        <Modal title={t.rules.title} onClose={() => setOpen(false)}>
          {close => (
            <>
              <ol className="my-4 max-h-[60dvh] list-decimal space-y-2 overflow-y-auto overscroll-contain pl-6 text-left text-base leading-snug font-medium">
                {t.rules.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Button tone="primary" className="w-full" onClick={close}>
                {t.rules.close}
              </Button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
