import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
export const metadata: Metadata = { title: "Mining scenario calculator" };
export default function Page() {
  return (
    <div className="container page">
      <span className="eyebrow">ECONOMICS / SCENARIO MODE</span>
      <h1>Know your assumptions.</h1>
      <p className="page-intro">
        Change the inputs. See the trade-offs. No guaranteed returns.
      </p>
      <Calculator />
    </div>
  );
}
