import type { Metadata } from "next";
import ReserveClient from "./ReserveClient";

export const metadata: Metadata = {
  title: "Pitavibe reservations",
  description:
    "Reserve a spot for Pitavibe's Edmonton soft launch on Taeam. Fresh halal pitas, limited slots.",
};

export default function ReservePage() {
  return <ReserveClient />;
}
