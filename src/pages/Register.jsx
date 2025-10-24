import React, { useState } from "react";

const Card = ({ className = "", children }) => (
  <div className={"rounded-2xl border bg-white p-6 shadow-sm " + className}>
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
      className
    }
  >
    {children}
  </button>
);
const Input = (props) => (
  <input
    {...props}
    className={
      "w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 " +
      (props.className || "")
    }
  />
);

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // {type, msg}

  const validate = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!validateEmail(email)) return "Enter a valid email address.";
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (pw !== pw2) return "Passwords do not match.";
    return null;
  };

  const safeNavigateLogin = () => {
    // Prefer react-router if app uses it; otherwise hard redirect.
    try {
      const mod = require("react-router-dom"); // will throw if not installed
      if (mod && mod.useNavigate) {
        const nav = mod.useNavigate();
        nav("/login");
        return;
      }
    } catch (_) {}
    window.location.href = "/login";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFeedback({ type: "error", msg: err });
      return;
    }
    setLoading(true);
    setFeedback(null);

    // Mock async "register"
    await new Promise((r) => setTimeout(r, 900));

    setLoading(false);
    setFeedback({
      type: "success",
      msg: "Account created! Redirecting to login…",
    });

    setTimeout(() => safeNavigateLogin(), 650);
  };

  return (
    <div className="mx-auto max-w-md p-4 md:p-8">
      <Card>
        <h1 className="mb-4 text-2xl font-semibold">Create your account</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        {feedback && (
          <div
            className={
              "mt-3 rounded-xl p-3 text-sm " +
              (feedback.type === "success"
                ? "bg-green-50 border border-green-300"
                : "bg-red-50 border border-red-300")
            }
          >
            {feedback.msg}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </div>
      </Card>
    </div>
  );
}
