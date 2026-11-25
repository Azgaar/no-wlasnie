import { Icon } from "./Icon";

export function HeaderButton({ icon, label, onClick }: { icon: "rules" | "options"; label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} className="grid size-11 place-items-center last:-mr-2" onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
}
