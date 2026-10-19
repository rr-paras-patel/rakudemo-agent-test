import { getStoreById, type Store } from "@/data/stores";
import { trips, type Trip } from "@/data/trips";
import { calculateCashback } from "@/lib/cashback";

export interface TripWithDetails extends Trip {
  store: Store;
  cashback: number;
}

/**
 * The single definition of the declined-trip rule: a declined trip earns no
 * cashback and is excluded from totals.
 */
export function countsTowardEarnings(trip: Pick<Trip, "status">): boolean {
  return trip.status !== "declined";
}

export function getTrips(): TripWithDetails[] {
  return trips
    .map((trip) => {
      const store = getStoreById(trip.storeId);
      if (!store) return null;
      const cashback = countsTowardEarnings(trip)
        ? calculateCashback(trip.amount, store.cashbackRate)
        : 0;
      return { ...trip, store, cashback };
    })
    .filter((t): t is TripWithDetails => t !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}
