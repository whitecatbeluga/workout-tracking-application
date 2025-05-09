import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase-config";
import { getMonthDiff } from "../utils/get-month-diff";
export const useRegistrationInfo = () => {
  const [monthsSinceRegistered, setMonthsSinceRegistered] = useState<number>(0);

  useEffect(() => {
    const creationTime = auth.currentUser?.metadata.creationTime;
    if (!creationTime) return;
    const created = new Date(creationTime);
    const now = new Date();
    setMonthsSinceRegistered(getMonthDiff(created, now));
  }, []);

  return { monthsSinceRegistered };
};
