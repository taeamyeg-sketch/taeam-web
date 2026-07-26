import type { Metadata } from "next";
import DriveClient from "./DriveClient";

export const metadata: Metadata = {
  title: "Drive with Taeam",
  description:
    "Deliver with Taeam in Edmonton. See your pay before you accept, keep 100% of tips, and drive on your own schedule.",
};

export default function DrivePage() {
  return <DriveClient />;
}
