import React, { useMemo, useState } from "react";

/** --- Lightweight UI primitives (swap with your real components later) --- */
const Card = ({ className = "", children }) => (
  <div
    className={
      "rounded-2xl border bg-white p-5 shadow-sm " + (className ?? "")
    }
  >
    {children}
  </div>
);
const Button = ({ className = "", disabled, onClick, children, type }) => (
  <button
    type={type || "button"}
    disabled={disabled}
    onClick={onClick}
    className={
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium " +
      (disabled
        ? "bg-gray-300 text-gray-600 cursor-not-allowed "
        : "bg-indigo-600 text-white hover:bg-indigo-700 ") +
      (className ?? "")
    }
  >
    {children}
  </button>
);
const Input = ({
  className = "",
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  step,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    step={step}
    className={
      "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 " +
      (className ?? "")
    }
  />
);

/** --- Mock data & portfolio state (no backend) --- */
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 228.35 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 451.22 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 195.78 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 115.03 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 238.14 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 498.2 },
];

// Local mock of a portfolio hook.
// Later, you can swap this with your real usePortfolio() if present.
function usePortfolio() {
  const [cash, setCash] = useState(100000); // $100k paper cash
  const [positions, setPositions] = useState({
    AAPL: 10,
    MSFT: 5,
  });

  const placeOrder = ({ side, symbol, quantity, price }) => {
    const qty = Number(quantity);
    const px = Number(price);
    const notional = Number((qty * px).toFixed(2));

    if (side === "BUY") {
      if (notional > cash) {
        return { ok: false, error: "Insufficient cash for this order." };
      }
      setCash((c) => Number((c - notional).toFixed(2)));
      setPositions((p) => ({
        ...p,
        [symbol]: (p[symbol] || 0) + qty,
      }));
      return { ok: true, message: `Bought ${qty} ${symbol} @ $${px}` };
    } else {
      const pos = positions[symbol] || 0;
      if (qty > pos) {
        return { ok: false, error: `You only have ${pos} shares of ${symbol}.` };
      }
      setCash((c) => Number((c + notional).toFixed(2)));
      setPositions((p) => ({
        ...p,
        [symbol]: pos - qty,
      }));
      return { ok: true, message: `Sold ${qty} ${symbol} @ $${px}` };
    }
  };

  return { cash, positions, placeOrder };
}

export default function Trade() {
  const { cash, positions, placeOrder } = usePortfolio();

  const [query, setQuery] = useState("");
  const [side, setSide] = useState("BUY"); // BUY | SELL
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [feedback, setFeedback] = useState(null); // {type:'success'|'error', msg:string}

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockStocks;
    return mockStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [query]);

  const current = useMemo(() => {
    if (!selected) return null;
    return mockStocks.find((s) => s.symbol === selected) || null;
  }, [selected]);

  // Auto-fill price when selecting a symbol
  React.useEffect(() => {
    if (current && (price === "" || Number(price) <= 0)) {
      setPrice(current.price);
    }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const valid = () => {
    if (!current) return "Please select a symbol.";
    const qn = Number(qty);
    if (!Number.isFinite(qn) || qn <= 0 || !Number.isInteger(qn))
      return "Quantity must be a positive whole number.";
    const px = Number(price);
    if (!Number.isFinite(px) || px < 0.01) return "Price must be ≥ $0.01.";
    if (side === "BUY" && qn * px > cash) return "Insufficient cash.";
    if (side === "SELL" && (positions[current.symbol] || 0) < qn)
      return `Not enough ${current.symbol} to sell.`;
    return null;
  };

  const summary = () => {
    if (!current) return "Select a symbol to see summary.";
    const qn = Number(qty) || 0;
    const px = Number(price) || 0;
    const notional = (qn * px).toFixed(2);
    return `${side} ${qn} ${current.symbol} @ $${px.toFixed(
      2
    )} = $${notional}`;
  };

  const onPlace = (e) => {
    e.preventDefault();
    const err = valid();
    if (err) {
      setFeedback({ type: "error", msg: err });
      return;
    }
    const res = placeOrder({
      side,
      symbol: current.symbol,
      quantity: Number(qty),
      price: Number(price),
    });
    if (res.ok) {
      setFeedback({ type: "success", msg: res.message });
      // Reset quantity; keep symbol and price for convenience
      setQty(1);
    } else {
      setFeedback({ type: "error", msg: res.error || "Order failed." });
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Trade</h1>
        <div className="text-sm text-gray-600">
          Cash Balance:{" "}
          <span className="font-semibold text-gray-900">
            ${cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Left: Symbol search & results */}
          <div className="md:col-span-1 space-y-3">
            <label className="text-sm font-medium">Search symbol</label>
            <Input
              placeholder="Search by symbol or name (e.g., AAPL)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="max-h-64 overflow-auto rounded-xl border">
              {results.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => setSelected(s.symbol)}
                  className={
                    "flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50 " +
                    (selected === s.symbol ? "bg-indigo-50" : "")
                  }
                >
                  <div>
                    <div className="font-semibold">{s.symbol}</div>
                    <div className="text-xs text-gray-600">{s.name}</div>
                  </div>
                  <div className="text-sm">${s.price.toFixed(2)}</div>
                </button>
              ))}
              {results.length === 0 && (
                <div className="p-3 text-sm text-gray-500">No matches.</div>
              )}
            </div>
          </div>

          {/* Right: Order ticket */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex gap-2">
              <Button
                className={side === "BUY" ? "" : "bg-gray-200 text-gray-900"}
                onClick={() => setSide("BUY")}
              >
                Buy
              </Button>
              <Button
                className={side === "SELL" ? "" : "bg-gray-200 text-gray-900"}
                onClick={() => setSide("SELL")}
              >
                Sell
              </Button>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={onPlace}>
              <div className="space-y-1">
                <label className="text-sm font-medium">Symbol</label>
                <Input
                  value={selected || ""}
                  onChange={() => {}}
                  placeholder="Select from search"
                  readOnly
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Price (USD)</label>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Order Summary</label>
                <Card className="p-3 text-sm">{summary()}</Card>
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Positions:{" "}
                  {Object.keys(positions).length === 0
                    ? "—"
                    : Object.entries(positions)
                        .map(([sym, q]) => `${sym}: ${q}`)
                        .join(" · ")}
                </div>
                <Button type="submit">Place Order</Button>
              </div>
            </form>

            {feedback && (
              <Card
                className={
                  "p-3 text-sm " +
                  (feedback.type === "success"
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50")
                }
              >
                {feedback.msg}
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
