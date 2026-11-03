import "./site.css";

export const metadata = {
  title: "undanganka – Undangan pernikahan digital",
  description: "Undangan pernikahan digital dengan alamat sendiri, foto dari dashboard, dan daftar tamu yang rapi.",
};

export default function SiteLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
