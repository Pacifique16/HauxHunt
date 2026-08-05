/**
 * Shared, app-wide TypeScript types.
 *
 * Keep cross-cutting types here (e.g. nav items, CMS content shapes).
 * Component-local types should stay colocated with their component.
 */

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};
