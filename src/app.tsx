import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import SiteChrome from "~/components/SiteChrome";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <SiteChrome>{props.children}</SiteChrome>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
