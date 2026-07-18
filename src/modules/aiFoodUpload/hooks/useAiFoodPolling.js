import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pollAiFoodBatch, fetchAiFoodList } from "../store/ai.food.slice";

const POLL_INTERVAL_MS = 2500;

// Generations are persisted server-side (ai_food_generations table), so this
// hook both hydrates the table from the backend on mount — surviving page
// refreshes/navigation — and keeps it live while anything is still in flight.
export function useAiFoodPolling() {
  const dispatch = useDispatch();
  const { batchIds, items } = useSelector((state) => state.aiFood);

  useEffect(() => {
    dispatch(fetchAiFoodList({ limit: 100 }));
  }, [dispatch]);

  const hasInFlightItems = items.some(
    (item) => item.status === "draft" || item.status === "processing",
  );

  useEffect(() => {
    if (!hasInFlightItems) return;
    const interval = setInterval(() => {
      if (batchIds.length > 0) {
        batchIds.forEach((id) => dispatch(pollAiFoodBatch(id)));
      } else {
        dispatch(fetchAiFoodList({ limit: 100 }));
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, batchIds, hasInFlightItems]);
}
