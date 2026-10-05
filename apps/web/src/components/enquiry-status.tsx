"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function EnquiryStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <div className="button-row">
      <span className="pill">
        {status === "handled" ? "Handled" : "New enquiry"}
      </span>
      <button
        className="button small secondary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const r = await fetch("/api/v1/operations/enquiries", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                status: status === "handled" ? "new" : "handled",
              }),
            });
            if (!r.ok) throw new Error();
            router.refresh();
          } catch {
            setMessage("Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {status === "handled" ? "Reopen" : "Mark handled"}
      </button>
      <span role="status">{message}</span>
    </div>
  );
}
