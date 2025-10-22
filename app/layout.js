import "./globals.css";

export const metadata = { title: "Replai", description: "Client chat links" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
  style={{
    margin: 0,
    background: "#f6f7f9",
    color: "#111",
    fontFamily: "var(--font-main)",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  }}
>

          Replai
        <header
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 32px",
    borderBottom: "1px solid #e6e6e9",
    background: "#ffffff",
  }}
>
  <h2 style={{ margin: 0, color: "#111" }}>Replai</h2>
  <div style={{ fontSize: 14, color: "#777" }}>AI that works for you.</div>
</header>
        {children}
      </body>
    </html>
  );
}
