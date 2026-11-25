import type { ButtonHTMLAttributes } from "react";

const TONES = {
  primary: "bg-main text-ink",
  paper: "bg-paper text-ink"
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof TONES };

export function Button({ tone = "paper", className = "", ...props }: Props) {
  return (
    <button
      type="button"
      className={`chunky pressable px-2 font-extrabold disabled:text-ink/40 ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
