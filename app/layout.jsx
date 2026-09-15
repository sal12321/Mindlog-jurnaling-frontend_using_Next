import "./globals.css";

export const metadata = {
  title: "MindLog",
  description: "Journal app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
