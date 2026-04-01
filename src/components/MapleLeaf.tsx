interface MapleLeafProps {
  className?: string;
  leafColor?: string;  // color of the leaf shape
  bgColor?: string;    // color of the background around the leaf
}

/**
 * Renders the official Canadian maple leaf using the exact path from the
 * Canadian flag SVG (Pantone version, public domain).
 *
 * Technique: the flag uses a white rectangle with the leaf as a transparent
 * "cutout" hole (compound path, non-zero winding). We replicate this by
 * stacking a solid rect (leafColor) beneath the compound path (bgColor).
 * The hole in the compound path reveals the rect, producing a clean leaf.
 *
 * Default: red leaf on white background — matches the attached reference image.
 */
export function MapleLeaf({
  className,
  leafColor = '#D52B1E',
  bgColor = 'white',
}: MapleLeafProps) {
  return (
    <svg
      viewBox="2400 0 4800 4800"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — fills the leaf shape (shows through the hole) */}
      <rect x="2400" y="0" width="4800" height="4800" fill={leafColor} />
      {/* Layer 2 — white center band with maple-leaf cutout (non-zero winding) */}
      <path
        fill={bgColor}
        d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73 38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
      />
    </svg>
  );
}
