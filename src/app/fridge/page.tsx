import type { Metadata } from "next";
import FridgeClient from "./FridgeClient";

export const metadata: Metadata = {
  title: "The Taeam Fridge",
  description:
    "Homemade halal food from home kitchens in Edmonton. The Fridge is coming soon to Taeam.",
};

export default function FridgePage() {
  return <FridgeClient />;
}
