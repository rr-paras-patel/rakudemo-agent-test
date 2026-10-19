import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TripsTable from "@/components/TripsTable";
import { getAccountStats } from "@/lib/account";
import { countsTowardEarnings, getTrips } from "@/lib/trips";

describe("declined-trip rule (single predicate)", () => {
  it("countsTowardEarnings is false only for declined", () => {
    expect(countsTowardEarnings({ status: "declined" })).toBe(false);
    for (const status of ["pending", "confirmed", "paid"] as const) {
      expect(countsTowardEarnings({ status })).toBe(true);
    }
  });

  it("trips, account stats and table agree on declined trips", () => {
    const list = getTrips();
    const declined = list.filter((t) => !countsTowardEarnings(t));
    expect(declined.length).toBeGreaterThan(0);
    expect(declined.every((t) => t.cashback === 0)).toBe(true);
    expect(getAccountStats(list).totalTrips).toBe(list.length - declined.length);

    render(<TripsTable trips={declined} />);
    expect(screen.getAllByText("—")).toHaveLength(declined.length);
  });
});
