import { faqs } from "@/lib/commercial";
export function FAQ() {
  return (
    <div className="faq-list">
      {faqs.map((f) => (
        <details key={f.question}>
          <summary>
            {f.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
