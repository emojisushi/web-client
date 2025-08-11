import { fuzzySearch } from "~utils/fuzzySearch";

it("partial search", () => {
  const items = [
    {
      name: "філадельфія",
    },
  ];

  const searchResults = fuzzySearch(items, "філа", (el) => el.name);

  expect(searchResults.length).toBe(1);
});

it("case sensitive search", () => {
  const items = [
    {
      name: "Філадельфія",
    },
  ];

  const searchResults = fuzzySearch(items, "філадельфія", (el) => el.name, {
    caseSensitive: true,
  });

  expect(searchResults.length).toBe(0);
});

it("one error", () => {
  const items = [
    {
      name: "Банзай",
    },
  ];

  const searchResults = fuzzySearch(items, "Бандай", (el) => el.name, {
    maxAllowedModifications: 1,
  });

  expect(searchResults.length).toBe(1);
});

it("two errors", () => {
  const items = [
    {
      name: "Банзай",
    },
  ];

  const searchResults = fuzzySearch(items, "Бардай", (el) => el.name, {
    maxAllowedModifications: 2,
  });

  expect(searchResults.length).toBe(1);
});
