import { Password, PasswordProps } from "primereact/password";
import { twMerge } from "tailwind-merge";

/**
 * Simplified port of Enatega admin's CustomPasswordTextField
 * (lib/ui/useable-components/password-input-field) — same PrimeReact
 * Password + toggleMask, minus the strength-meter/next-intl labels.
 */
export default function CustomPasswordTextField({
  className,
  placeholder,
  showLabel,
  ...props
}: PasswordProps & { showLabel?: boolean }) {
  return (
    <div className="flex flex-col gap-y-1 rounded-lg">
      {showLabel && (
        <label htmlFor={props.name} className="text-sm font-[500]">
          {placeholder}
        </label>
      )}
      <Password
        className={twMerge(
          "icon-right h-10 w-full rounded-lg border border-gray-300 pr-8 text-sm focus:shadow-none focus:outline-none",
          className,
        )}
        placeholder={placeholder}
        toggleMask
        feedback={false}
        {...props}
      />
    </div>
  );
}
