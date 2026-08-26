// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

const themeScript = `try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'hc') {
    document.documentElement.setAttribute('data-theme', saved);
  }
} catch (e) {}`;

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" data-theme="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="sys.write() — a journal by Maren Hofstad"
            href="/rss.xml"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,500;1,9..144,700&family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <script>{themeScript}</script>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
