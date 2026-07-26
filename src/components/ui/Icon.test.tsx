import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { iconLoaded } from "@iconify/react";
import { describe, expect, it } from "vitest";
import "./Icon"; // ensures addCollection(solarIcons) has run before iconLoaded checks

// Guards against a later task referencing a `solar:` icon that was not
// bundled into src/components/ui/solar-icons.ts — that icon would silently
// fall back to a runtime fetch from api.iconify.design instead of failing
// loudly, which is why this scans every .tsx file rather than trusting a
// manually kept list.
const ICON_LITERAL = /icon=\{?"(solar:[a-z0-9-]+)"\}?/g;

function findIconLiterals(dir: string): string[] {
  const found = new Set<string>();
  for (const file of readdirRecursive(dir)) {
    const contents = readFileSync(file, "utf-8");
    for (const match of contents.matchAll(ICON_LITERAL)) {
      found.add(match[1]);
    }
  }
  return Array.from(found);
}

function readdirRecursive(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...readdirRecursive(full));
    } else if (full.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

describe("solar icon literal regex", () => {
  // A broken regex (e.g. one that stops matching `icon={"..."}`  or requires
  // a trailing quote in the wrong place) must not be able to make the real
  // src/ scan below pass vacuously. This fixture proves the regex itself
  // extracts both call shapes the codebase uses, independent of how many
  // real call sites currently exist.
  it("extracts both icon=\"solar:x\" and icon={\"solar:x\"} literal shapes", () => {
    const fixture = `
      <Icon icon="solar:fire-linear" width={20} />
      <Icon icon={"solar:star-linear"} width={20} />
    `;
    const found = Array.from(fixture.matchAll(ICON_LITERAL)).map(
      (m) => m[1],
    );
    expect(found).toEqual(["solar:fire-linear", "solar:star-linear"]);
  });
});

describe("bundled Solar icons", () => {
  it("has every icon= literal referenced under src/ bundled locally", () => {
    // Scans all of src/ (not just src/components/) so an <Icon> literal added
    // anywhere — src/lib/, src/sections/, a future directory — is covered.
    // Real call sites exist since Task 7, so this set is non-empty and the
    // assertion does real work; the sanity check below keeps a regex or path
    // regression from quietly turning it back into a vacuous pass.
    const here = dirname(fileURLToPath(import.meta.url));
    const srcDir = join(here, "..", "..");
    const iconNames = findIconLiterals(srcDir);

    expect(iconNames.length).toBeGreaterThan(0);
    for (const name of iconNames) {
      expect(iconLoaded(name)).toBe(true);
    }
  });
});
