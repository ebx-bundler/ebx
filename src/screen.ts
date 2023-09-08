export function getResetScreen(): (heading?: string) => void {
  return (heading) => {
    console.clear();
    if (heading) {
      console.log(heading);
    }
  };
}
