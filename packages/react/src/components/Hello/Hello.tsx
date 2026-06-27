export interface HelloProps {
  /** Name to greet. */
  name?: string;
}

/** Minimal cross-framework smoke component (Phase 0 — proves the React skin renders). */
export function Hello({ name = 'World' }: HelloProps) {
  return <span data-framework="react">Hello {name} from React</span>;
}
