export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function InvitationLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Pinyon+Script&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
