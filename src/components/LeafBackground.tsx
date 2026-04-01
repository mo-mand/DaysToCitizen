// Decorative maple leaf background — fixed positions to avoid hydration mismatch.
// Low opacity to feel like fallen leaves on the ground.
// viewBox "200 200 4400 4400" correctly frames the full Canadian flag maple leaf path
// (leaf spans x:540–4260, y:400–4430 — viewBox adds padding on all sides).

const LEAVES = [
  { top: '4%',   left: '2%',   size: 80,  rotate: 23   },
  { top: '8%',   left: '85%',  size: 55,  rotate: -47  },
  { top: '15%',  left: '68%',  size: 95,  rotate: 110  },
  { top: '28%',  left: '12%',  size: 60,  rotate: -15  },
  { top: '35%',  left: '92%',  size: 45,  rotate: 67   },
  { top: '44%',  left: '4%',   size: 75,  rotate: 195  },
  { top: '52%',  left: '48%',  size: 50,  rotate: -82  },
  { top: '60%',  left: '78%',  size: 70,  rotate: 140  },
  { top: '67%',  left: '25%',  size: 58,  rotate: 35   },
  { top: '74%',  left: '60%',  size: 85,  rotate: -120 },
  { top: '82%',  left: '6%',   size: 48,  rotate: 72   },
  { top: '89%',  left: '88%',  size: 65,  rotate: -30  },
  { top: '2%',   left: '42%',  size: 52,  rotate: 155  },
  { top: '72%',  left: '38%',  size: 72,  rotate: -60  },
  { top: '20%',  left: '32%',  size: 42,  rotate: 88   },
  { top: '56%',  left: '20%',  size: 63,  rotate: -145 },
];

// Official Canadian flag maple leaf path (relative coords, starts at 2490,4430)
// Bounding box: x 540–4260, y 400–4430  →  viewBox "200 200 4400 4400" fits it fully
const LEAF_PATH =
  "m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73 38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z";

export function LeafBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          viewBox="200 200 4400 4400"
          width={leaf.size}
          height={leaf.size}
          style={{
            position: 'absolute',
            top: leaf.top,
            left: leaf.left,
            transform: `rotate(${leaf.rotate}deg)`,
            opacity: 0.06,
          }}
        >
          <path fill="#D52B1E" d={LEAF_PATH} />
        </svg>
      ))}
    </div>
  );
}
