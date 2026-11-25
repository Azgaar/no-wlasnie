import { useState } from "react";
import { isSoundOn, play, setSoundOn } from "../audio/play";
import { useLocale } from "../locales";
import { Button } from "./Button";
import { HeaderButton } from "./HeaderButton";
import { LanguageSelect } from "./LanguageSelect";
import { Modal } from "./Modal";
import { ThemePicker } from "./ThemePicker";

/** Settings of this device, and a new game. */
export function OptionsButton({ onNewGame }: { onNewGame?: () => void }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const close = () => {
    setOpen(false);
    setConfirming(false);
  };

  return (
    <>
      <HeaderButton icon="options" label={t.options.action} onClick={() => setOpen(true)} />
      {open && !confirming && (
        <Modal key="options" title={t.options.action} onClose={() => !confirming && close()}>
          {closeModal => (
            <>
              <div className="my-4 grid gap-3 text-lg font-extrabold">
                <SoundSwitch />
                <LanguageSelect className="chunky min-h-[52px] justify-between pr-1 pl-4" labelClassName="" />
                <ThemePicker />
                {onNewGame && <Button onClick={() => setConfirming(true)}>{t.newGame.action}</Button>}
              </div>
              <Button tone="primary" className="w-full" onClick={closeModal}>
                {t.options.close}
              </Button>
            </>
          )}
        </Modal>
      )}
      {confirming && (
        <Modal key="confirm" title={t.newGame.confirm} onClose={close}>
          {closeModal => (
            <>
              <p className="mt-3 mb-4 text-base font-medium text-balance">{t.newGame.hint}</p>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={closeModal}>{t.newGame.cancel}</Button>
                <Button tone="primary" onClick={() => { closeModal(); onNewGame?.(); }}>
                  {t.newGame.action}
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

function SoundSwitch() {
  const { t } = useLocale();
  const [on, setOn] = useState(isSoundOn);

  const toggle = () => {
    setSoundOn(!on);
    setOn(!on);
    // A sample, so that the volume can be set before the game.
    void play("match");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={t.options.sound}
      className="chunky pressable flex items-center justify-between px-4"
      onClick={toggle}
    >
      {t.options.sound}
      <span className={`rounded-lg border-2 border-ink px-3 py-0.5 text-base ${on ? "bg-main" : ""}`}>
        {on ? t.options.on : t.options.off}
      </span>
    </button>
  );
}
