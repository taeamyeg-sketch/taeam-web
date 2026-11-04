import type { Metadata } from "next";
import ReserveClient from "./ReserveClient";

export const metadata: Metadata = {
  title: "Barcelos reservations",
  description:
    "Reserve a spot for the Barcelos Gateway soft launch on Taeam in Edmonton. Flame grilled peri peri chicken, limited slots.",
  robots: { index: false, follow: false },
};

export default function ReservePage() {
  return <ReserveClient />;
}
