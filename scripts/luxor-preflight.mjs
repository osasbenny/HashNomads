// Read-only account capability check. Credentials come from a private environment
// file, never CLI arguments, browser code or logged provider response bodies.
const key = process.env.LUXOR_API_KEY?.trim();
if (!key || /\s/.test(key)) {
  console.error(
    "LUXOR_API_KEY must be supplied through a private environment file.",
  );
  process.exit(2);
}

const base = "https://app.luxor.tech/api/v2/";
const checks = [
  {
    name: "subaccounts",
    path: "pool/subaccounts?page_number=1&page_size=10",
    collection: "subaccounts",
  },
  {
    name: "bitcoinWorkers",
    path: "pool/workers/BTC?page_number=1&page_size=10",
    collection: "workers",
  },
];

let verified = true;
let authenticatedPoolReadVerified = false;
let workerReadVerified = false;
let noSubaccountsAvailable = false;
let subaccountNames = [];
for (const check of checks) {
  const observedAt = new Date().toISOString();
  if (check.name === "bitcoinWorkers" && !authenticatedPoolReadVerified) {
    console.log(
      JSON.stringify({
        check: check.name,
        observedAt,
        result: "skipped",
        reason: "subaccount_read_not_verified",
      }),
    );
    continue;
  }
  if (check.name === "bitcoinWorkers" && noSubaccountsAvailable) {
    console.log(
      JSON.stringify({
        check: check.name,
        observedAt,
        result: "skipped",
        reason: "no_subaccounts_available",
      }),
    );
    continue;
  }
  try {
    const url = new URL(check.path, base);
    if (check.name === "bitcoinWorkers") {
      // Luxor requires a subaccount or site even though the reference marks
      // these query parameters optional. Use names from the verified read only.
      for (const name of subaccountNames)
        url.searchParams.append("subaccount_names", name);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: key, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    if (!response.ok) {
      verified = false;
      console.log(
        JSON.stringify({
          check: check.name,
          observedAt,
          httpStatus: response.status,
          result:
            response.status === 401
              ? "unauthorized"
              : response.status === 403
                ? "forbidden"
                : response.status === 429
                  ? "rate_limited"
                  : response.status === 400
                    ? "invalid_request"
                    : "unavailable",
        }),
      );
      await response.body?.cancel();
      continue;
    }
    const body = await response.json();
    const records = body?.[check.collection];
    if (!Array.isArray(records)) {
      verified = false;
      console.log(
        JSON.stringify({
          check: check.name,
          observedAt,
          httpStatus: response.status,
          result: "unexpected_response_shape",
        }),
      );
      continue;
    }
    if (check.name === "subaccounts") {
      if (
        records.some(
          (record) => typeof record?.name !== "string" || !record.name.trim(),
        )
      ) {
        verified = false;
        console.log(
          JSON.stringify({
            check: check.name,
            observedAt,
            result: "unexpected_response_shape",
          }),
        );
        continue;
      }
      authenticatedPoolReadVerified = true;
      subaccountNames = records.map((record) => record.name);
      noSubaccountsAvailable =
        records.length === 0 && !body.pagination?.next_page_url;
      if (!subaccountNames.length && !noSubaccountsAvailable) {
        authenticatedPoolReadVerified = false;
        verified = false;
      }
    } else workerReadVerified = true;
    const total = body.pagination?.item_count;
    console.log(
      JSON.stringify({
        check: check.name,
        observedAt,
        httpStatus: response.status,
        result: "read_verified",
        returnedRecords: records.length,
        totalRecords: Number.isSafeInteger(total) && total >= 0 ? total : null,
        morePages: Boolean(body.pagination?.next_page_url),
      }),
    );
  } catch {
    verified = false;
    // Do not print exception messages, response bodies, identifiers or headers.
    console.log(
      JSON.stringify({
        check: check.name,
        observedAt,
        result: "request_failed",
      }),
    );
  }
}
console.log(
  JSON.stringify({
    authenticatedPoolReadVerified,
    workerReadVerified,
    noSubaccountsAvailable,
    physicalDeploymentVerified: false,
    payoutVerified: false,
    effectiveWritePermissionsVerified: false,
  }),
);
process.exitCode = verified ? 0 : 1;
