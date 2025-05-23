export default function NameBox({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <span
      className={`border-1 rounded-md p-1 font-semibold ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
