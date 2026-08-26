/**
 * Navegación principal del sitio, centralizada para el Router.
 *
 * - kind "route": navegación SPA con <A> del Router.
 * - kind "anchor": ancla interna de la home (/#seccion). En la home usa el
 *   ancla nativa (scroll suave CSS + historial correcto); desde otra página
 *   navega en SPA a "/" y fija el hash.
 *
 * La home vive en "/" (sin segmento extra): routes/index.tsx. A la home se
 * llega por el brand/logotipo, por eso no hay un ítem "home" en el menú.
 * El archivo del blog (/blog/) sigue accesible desde el footer y las cards.
 */
export type NavKind = "route" | "anchor";

export interface NavItem {
  /** Clave para el estado activo (data-nav) y el scrollspy. */
  key: string;
  label: string;
  href: string;
  kind: NavKind;
}

export const homeHref = "/";

export const mainNav: NavItem[] = [
  { key: "stack", label: "stack", href: "/#stack", kind: "anchor" },
  { key: "projects", label: "projects", href: "/projects/", kind: "route" },
  { key: "resume", label: "resume", href: "/resume/", kind: "route" },
  { key: "about", label: "about", href: "/about/", kind: "route" },
];

/** Secciones de la home que participan en el scrollspy (claves de mainNav). */
export const homeSections = ["stack", "projects"] as const;
