/**
 * Navegación principal del sitio, centralizada para el Router.
 *
 * La home vive en "/" (routes/index.tsx) y es la página de entrada (SSR);
 * el resto de rutas navegan en SPA sin recargar la página. A la home se
 * llega por el brand/logotipo, por eso no hay un ítem "home" en el menú.
 * El archivo del blog (/blog/) sigue accesible desde el footer y las cards.
 */
export type NavKind = "route" | "anchor";

export interface NavItem {
  /** Clave para el estado activo (data-nav). */
  key: string;
  label: string;
  href: string;
  kind: NavKind;
}

export const homeHref = "/";

export const mainNav: NavItem[] = [
  { key: "projects", label: "projects", href: "/projects/", kind: "route" },
  { key: "resume", label: "resume", href: "/resume/", kind: "route" },
  { key: "about", label: "about", href: "/about/", kind: "route" },
];
