import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, computeKpis, filterSales } from "./analytics";
import { SALES } from "./sales-data";

describe("Porsche sales analytics", () => {
  it("totals all 100 sales at R$ 88.660.000", () => {
    const k = computeKpis(SALES);
    expect(k.count).toBe(100);
    expect(k.revenue).toBe(88_660_000);
    expect(k.avgPrice).toBe(886_600);
  });

  it("picks the Porsche 911 as best seller with 23 units (23%)", () => {
    const k = computeKpis(SALES);
    expect(k.topModel).toBe("911");
    expect(k.topModelCount).toBe(23);
    expect(k.topModelShare).toBe(23);
  });

  it("combines model and city filters", () => {
    const rows = filterSales(SALES, { ...EMPTY_FILTERS, modelo: "911", cidade: "São Paulo" });
    expect(rows).toHaveLength(8);
    expect(computeKpis(rows).revenue).toBe(10_220_000);
  });

  it("combines year and payment filters", () => {
    expect(filterSales(SALES, { ...EMPTY_FILTERS, ano: "2024", pagamento: "PIX" })).toHaveLength(26);
  });

  it("searches by city name ignoring case", () => {
    expect(filterSales(SALES, { ...EMPTY_FILTERS, search: "  CURITIBA " })).toHaveLength(17);
  });
});
