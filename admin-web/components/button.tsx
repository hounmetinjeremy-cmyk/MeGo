import { Button, ButtonProps } from "primereact/button";

/**
 * Same wrapper as Enatega admin's CustomButton
 * (lib/ui/useable-components/button) — just PrimeReact's Button with the
 * className merged in, so callers keep passing the same className/label/type
 * props.
 */
export default function CustomButton({ className, ...props }: ButtonProps) {
  return <Button className={className} {...props} />;
}
