import type { Metadata } from "next";
import ArbaabClient from "./ArbaabClient";

export const metadata: Metadata = {
  title: "Meet Arbaab",
  description:
    "Arbaab is Taeam's food assistant. Tell it what you're craving and it finds the halal kitchen and builds the order. You always confirm before anything is placed.",
};

export default function ArbaabPage() {
  return <ArbaabClient />;
}
