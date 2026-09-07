import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText, InputTextProps } from "primereact/inputtext";
import { twMerge } from "tailwind-merge";

/**
 * Simplified port of Enatega admin's CustomIconTextField
 * (lib/ui/useable-components/input-icon-field) — same PrimeReact IconField
 * layout, minus the next-intl loading-skeleton variant MeGo doesn't need.
 */
export default function CustomIconTextField({
  className,
  icon,
  placeholder,
  showLabel,
  ...props
}: InputTextProps & { icon: React.ReactNode; showLabel?: boolean }) {
  return (
    <IconField iconPosition="right">
      <InputIcon>{icon}</InputIcon>
      <div className="flex flex-col gap-y-1">
        {showLabel && (
          <label htmlFor={props.name} className="text-sm font-[500]">
            {placeholder}
          </label>
        )}
        <InputText
          className={twMerge(
            "h-10 w-full rounded-lg border border-gray-300 px-2 text-sm focus:shadow-none focus:outline-none",
            className,
          )}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </IconField>
  );
}
