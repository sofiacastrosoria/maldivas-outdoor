export function QuotePriceLabel({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "text-2xl md:text-3xl"
      : size === "sm"
        ? "text-sm"
        : "text-xl";

  return (
    <p
      className={`font-light tracking-tight text-matte-black ${sizeClass} ${className}`}
    >
      A cotizar
    </p>
  );
}
