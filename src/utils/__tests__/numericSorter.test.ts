import { numericSorter } from "~utils/sort.utils";

describe("numericSorter", () => {
  it("ascending order", () => {
    const items = [100, 50, 300];

    const sortedItems = items.sort(numericSorter((price) => price, "asc"));

    expect(sortedItems).toStrictEqual([50, 100, 300]);
  });
  it("descending order", () => {
    const items = [100, 50, 300];

    const sortedItems = items.sort(numericSorter((price) => price, "desc"));

    expect(sortedItems).toStrictEqual([300, 100, 50]);
  });
});
