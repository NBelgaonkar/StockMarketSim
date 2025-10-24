import React from "react";

const Card = ({ className = "", children }) => (
  <div className={"rounded-2xl border bg-white p-8 shadow-sm " + className}>
    {children}
  </div>
);
const Button = ({ className = "", href = "#", children }) => (
  <a
    href={href}
    className={
      "inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 " +
      className
    }
  >
    {children}
  </a>
);

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center p-6">
      <Card className="w-full text-center">
        <h1 className="text-3xl font-semibold">Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Home</Button>
          <Button href="/portfolio" className="bg-gray-900 hover:bg-black">
            Portfolio
          </Button>
          <Button href="/trade">Trade</Button>
        </div>
      </Card>
    </div>
  );
}
