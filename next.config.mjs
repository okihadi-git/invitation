const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "undanganka.my.id")
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");
const rootRegex = root.replace(/\./g, "\\.");

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // rani-bima.undanganka.my.id  ->  /s/rani-bima  (tanpa middleware)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "host",
              value: `(?<slug>(?!(?:www|app|admin|api)\\.)[a-z0-9-]+)\\.${rootRegex}`,
            },
          ],
          destination: "/s/:slug",
        },
      ],
    };
  },
};
