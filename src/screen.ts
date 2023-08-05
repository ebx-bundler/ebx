const CLEAR_SCREEN = "\u001Bc";

export function getResetScreen(): (heading: string) => void {
  return () => {
    console.clear();
  };
}
