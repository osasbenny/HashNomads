import type { Metadata } from "next";
import V2Page from "@/components/v2-page";

export const metadata: Metadata = {
  title: "Profitability Calculator",
  description: "HashNomads calculator information and customer guidance.",
};

export default function Page() {
  return <V2Page />;
}
