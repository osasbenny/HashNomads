"use client";
import { useState } from "react";
import { scenario, formatFixed, type ScenarioInput } from "@hashnomads/domain";
const defaults: ScenarioInput = {
  hashrateTH: "234",
  powerW: "3510",
  hashpriceUsdPerPHDay: "",
  electricityUsdPerKwh: "",
  uptimePercent: "",
  poolFeePercent: "",
  serviceUsdPerMonth: "",
};
const fields: {
  key: keyof ScenarioInput;
  label: string;
  unit: string;
  step: string;
}[] = [
  { key: "hashrateTH", label: "Nominal hashrate", unit: "TH/s", step: "1" },
  { key: "powerW", label: "Nominal power", unit: "W", step: "1" },
  {
    key: "hashpriceUsdPerPHDay",
    label: "Assumed hashprice",
    unit: "USD / PH / day",
    step: "0.01",
  },
  {
    key: "electricityUsdPerKwh",
    label: "Electricity tariff",
    unit: "USD / kWh",
    step: "0.001",
  },
  { key: "uptimePercent", label: "Assumed uptime", unit: "%", step: "1" },
  { key: "poolFeePercent", label: "Pool fee", unit: "%", step: "0.1" },
  {
    key: "serviceUsdPerMonth",
    label: "Monthly service fee",
    unit: "USD",
    step: "1",
  },
];
export function Calculator() {
  const [input, setInput] = useState(defaults);
  let result: ReturnType<typeof scenario> | undefined,
    error = "";
  try {
    result = scenario(input);
  } catch {
    error =
      "Enter non-negative values with valid precision. Uptime and pool fee must be at most 100%.";
  }
  return (
    <div className="calculator-grid">
      <div className="panel">
        <div className="panel-heading">
          <h3>Your assumptions</h3>
          <button className="text-button" onClick={() => setInput(defaults)}>
            Reset
          </button>
        </div>
        <div className="form-grid">
          {fields.map((f) => (
            <label key={f.key}>
              {f.label}
              <div className="input-unit">
                <input
                  type="number"
                  min="0"
                  max={f.unit === "%" ? 100 : undefined}
                  step={f.step}
                  value={input[f.key]}
                  onChange={(e) =>
                    setInput({ ...input, [f.key]: e.target.value })
                  }
                />
                <span>{f.unit}</span>
              </div>
            </label>
          ))}
        </div>
        <p className="form-note">
          S21 Pro manufacturer specifications are prefilled. Enter hashprice,
          uptime and fees from your research and energy costs from your quote.
          Electricity uses nominal power × uptime × 720 hours.
        </p>
      </div>
      <div className="panel scenario-result" aria-live="polite">
        <span className="eyebrow">30-DAY SCENARIO / USD</span>
        {result ? (
          <>
            <p>Estimated operating surplus</p>
            <div className="result-number">${formatFixed(result.netMinor)}</div>
            <span className="pill">Before hardware, taxes & other costs</span>
            <div className="result-lines">
              {[
                ["Gross mining revenue", result.grossMinor],
                ["Pool fee", -result.poolFeeMinor],
                ["Electricity", -result.electricityMinor],
                ["Platform service", -result.serviceMinor],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <span>{String(label)}</span>
                  <b>${formatFixed(value as bigint)}</b>
                </div>
              ))}
            </div>
            <div className="callout">
              This is a scenario, not a return forecast. Hashprice, difficulty,
              Bitcoin price, uptime, and costs can change. A negative result is
              possible.
            </div>
          </>
        ) : (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
