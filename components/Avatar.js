export default function Avatar({ src, name = "?", size = 36, className = "" }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} style={{ width: size, height: size }} className={`rounded-full object-cover ${className}`} />
  ) : (
    <span style={{ width: size, height: size, fontSize: size * 0.38 }} className={`grid shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-content ${className}`}>
      {initials}
    </span>
  );
}
