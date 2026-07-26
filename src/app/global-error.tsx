"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for a crash in the root layout itself. It replaces the
 * whole document, so globals.css and the Montserrat font may not be loaded here.
 * Everything is inline-styled with literal brand tokens and a system sans stack
 * so the fallback still reads as Taeam even with no stylesheet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          background: "#faf6ee",
          color: "#121212",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            marginTop: "12px",
            maxWidth: "24rem",
            color: "#6f6659",
            lineHeight: 1.5,
          }}
        >
          The site hit an unexpected error. Reload and we will try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "28px",
            border: "none",
            cursor: "pointer",
            borderRadius: "9999px",
            background: "#eea742",
            color: "#121212",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
