// Decorative maple leaf background — scattered at fixed positions to avoid hydration mismatch.
// Leaves are very low opacity to feel like fallen leaves on the ground.

const LEAVES = [
  { top: '6%',  left: '3%',   size: 52, rotate: 23,  opacity: 0.05 },
  { top: '12%', left: '88%',  size: 38, rotate: -47, opacity: 0.04 },
  { top: '22%', left: '72%',  size: 64, rotate: 110, opacity: 0.035 },
  { top: '31%', left: '15%',  size: 42, rotate: -15, opacity: 0.045 },
  { top: '40%', left: '94%',  size: 30, rotate: 67,  opacity: 0.04 },
  { top: '48%', left: '5%',   size: 56, rotate: 195, opacity: 0.03 },
  { top: '55%', left: '50%',  size: 35, rotate: -82, opacity: 0.04 },
  { top: '62%', left: '80%',  size: 48, rotate: 140, opacity: 0.05 },
  { top: '70%', left: '28%',  size: 41, rotate: 35,  opacity: 0.035 },
  { top: '78%', left: '63%',  size: 58, rotate: -120, opacity: 0.04 },
  { top: '85%', left: '8%',   size: 33, rotate: 72,  opacity: 0.045 },
  { top: '91%', left: '90%',  size: 44, rotate: -30, opacity: 0.05 },
  { top: '3%',  left: '45%',  size: 37, rotate: 155, opacity: 0.035 },
  { top: '75%', left: '42%',  size: 50, rotate: -60, opacity: 0.04 },
];

// Maple leaf SVG path (official Canadian flag geometry)
const LEAF_PATH = "m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73 38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z";

export function LeafBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          viewBox="2400 200 4800 4400"
          width={leaf.size}
          height={leaf.size}
          style={{
            position: 'absolute',
            top: leaf.top,
            left: leaf.left,
            transform: `rotate(${leaf.rotate}deg)`,
            opacity: leaf.opacity,
          }}
        >
          <path fill="#D52B1E" d={LEAF_PATH} />
        </svg>
      ))}
    </div>
  );
}
