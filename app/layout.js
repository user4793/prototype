import "./globals.css";

export const metadata = { title: "Replai", description: "Client chat links" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{
          background: "#0f0f12",
          borderBottom: "1px solid #1e1e23",
          padding: "14px 24px",
          fontWeight: 600,
          fontSize: "18px"
        }}>
          Replai
        </header>
        {children}
      </body>
    </html>
  );
}
