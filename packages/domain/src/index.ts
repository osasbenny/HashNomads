export type Role =
  "customer" | "support" | "operations" | "finance_compliance" | "admin";
export type Permission =
  | "own:read"
  | "support:manage"
  | "fleet:manage"
  | "finance:manage"
  | "identity:review"
  | "system:manage";
const permissions: Record<Role, readonly Permission[]> = {
  customer: ["own:read"],
  support: ["own:read", "support:manage"],
  operations: ["own:read", "fleet:manage"],
  finance_compliance: ["own:read", "finance:manage", "identity:review"],
  admin: [
    "own:read",
    "support:manage",
    "fleet:manage",
    "finance:manage",
    "identity:review",
    "system:manage",
  ],
};
export function can(role: Role, permission: Permission) {
  return permissions[role]?.includes(permission) ?? false;
}
export function requirePermission(role: Role, permission: Permission) {
  if (!can(role, permission)) throw new Error("FORBIDDEN");
}
export function requireOwner(
  actorCustomerId: string,
  resourceCustomerId: string,
) {
  if (actorCustomerId !== resourceCustomerId) throw new Error("NOT_FOUND");
}
export function parseFixed(value: string, decimals = 2): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18)
    throw new Error("INVALID_PRECISION");
  if (!/^\d+(\.\d+)?$/.test(value)) throw new Error("INVALID_AMOUNT");
  const [whole, fraction = ""] = value.split(".");
  if (fraction.length > decimals) throw new Error("EXCESS_PRECISION");
  return (
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, "0") || "0")
  );
}
export function formatFixed(value: bigint, decimals = 2) {
  const sign = value < 0n ? "-" : "";
  const v = value < 0n ? -value : value;
  if (decimals === 0) return `${sign}${v}`;
  return `${sign}${v / 10n ** BigInt(decimals)}.${(v % 10n ** BigInt(decimals)).toString().padStart(decimals, "0")}`;
}
export interface ScenarioInput {
  hashrateTH: string;
  powerW: string;
  hashpriceUsdPerPHDay: string;
  electricityUsdPerKwh: string;
  uptimePercent: string;
  poolFeePercent: string;
  serviceUsdPerMonth: string;
}
export function scenario(input: ScenarioInput) {
  const hash = parseFixed(input.hashrateTH, 3),
    power = parseFixed(input.powerW, 0);
  const hashprice = parseFixed(input.hashpriceUsdPerPHDay, 4),
    tariff = parseFixed(input.electricityUsdPerKwh, 4);
  const uptime = parseFixed(input.uptimePercent, 2),
    fee = parseFixed(input.poolFeePercent, 2);
  if (uptime > 10000n || fee > 10000n || hash > 100000000n || power > 10000000n)
    throw new Error("INVALID_ASSUMPTION");
  // USD cents, floor at ledger precision; no binary float arithmetic.
  const grossMinor = (hash * hashprice * 30n * uptime) / 1000000000000n;
  const poolFeeMinor = (grossMinor * fee) / 10000n;
  const electricityMinor = (power * 24n * 30n * tariff * uptime) / 1000000000n;
  const serviceMinor = parseFixed(input.serviceUsdPerMonth);
  return {
    grossMinor,
    poolFeeMinor,
    electricityMinor,
    serviceMinor,
    netMinor: grossMinor - poolFeeMinor - electricityMinor - serviceMinor,
  };
}
export const minerTransitions = {
  inventory: ["reserved", "assigned"],
  reserved: ["inventory", "assigned"],
  assigned: ["deployment_pending"],
  deployment_pending: ["installing"],
  installing: ["active", "maintenance"],
  active: ["degraded", "offline", "maintenance", "decommission_pending"],
  degraded: ["active", "offline", "maintenance"],
  offline: ["active", "maintenance"],
  maintenance: ["active", "decommission_pending"],
  decommission_pending: ["decommissioned"],
  decommissioned: [],
} as const;
export type MinerState = keyof typeof minerTransitions;
export function transitionMiner(from: MinerState, to: MinerState) {
  if (!(minerTransitions[from] as readonly string[]).includes(to))
    throw new Error("INVALID_TRANSITION");
  return to;
}
export function telemetryFreshness(
  observedAt: Date,
  now: Date,
  reportedOnline: boolean,
  thresholdMs = 300000,
) {
  const age = now.getTime() - observedAt.getTime();
  if (age < 0 || age > thresholdMs) return "stale";
  return reportedOnline ? "online" : "offline";
}
export const catalogue = [
  {
    id: "s21-pro",
    manufacturer: "BITMAIN",
    name: "Antminer S21 Pro",
    hashrateTH: 234,
    powerW: 3510,
    efficiency: "15",
    priceMinor: null,
    cooling: "Air cooled",
    source:
      "https://m.bitmain.com/cn/product/detail?pid=00020250822202036968slFI2fAC0683",
  },
];
export const facilities = [
  {
    id: "texas",
    name: "Texas",
    region: "Texas, United States",
    country: "US",
    rate: "0.062",
    climate: "Wind-connected energy",
    status: "Accepting enquiries",
    image: "https://www.sazmining.com/images/texas.webp",
  },
  {
    id: "paraguay",
    name: "Paraguay",
    region: "Paraguay, South America",
    country: "PY",
    rate: "0.059",
    climate: "Hydroelectric energy",
    status: "Accepting enquiries",
    image: null,
  },
  {
    id: "norway",
    name: "Norway",
    region: "Norway, Europe",
    country: "NO",
    rate: null,
    climate: "Heat reuse · 99% carbon-free energy",
    status: "Currently full",
    image: null,
  },
  {
    id: "south-dakota",
    name: "South Dakota",
    region: "South Dakota, United States",
    country: "US",
    rate: null,
    climate: "Air-cooled infrastructure",
    status: "Currently full",
    image: "https://www.sazmining.com/images/south-dakota.avif",
  },
];
