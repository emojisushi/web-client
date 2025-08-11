export function numericSorter<Value>(
  getValue: (v: Value) => number,
  direction: "asc" | "desc"
) {
  return (a: Value, b: Value) => {
    const a1 = getValue(a);
    const b1 = getValue(b);
    if (direction === "desc") {
      return b1 - a1;
    }
    return a1 - b1;
  };
}
