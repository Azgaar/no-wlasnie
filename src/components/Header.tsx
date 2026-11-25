import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { OptionsButton } from "./OptionsButton";
import { RulesButton } from "./RulesButton";

interface Props {
  children?: ReactNode;
  /** Not given when there is no game to erase. */
  onNewGame?: () => void;
}

export function Header({ children, onNewGame }: Props) {
  return (
    <header className="flex h-10 w-full items-center">
      <Logo />
      <span className="ml-auto pr-1 text-lg font-extrabold">{children}</span>
      <RulesButton />
      <OptionsButton onNewGame={onNewGame} />
    </header>
  );
}
