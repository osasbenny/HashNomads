import Link from "next/link";
import { BookOpen, ArrowUpRight, Calculator, Newspaper } from "lucide-react";
export const metadata = { title: "Bitcoin mining resources" };
export default function Page() {
  return (
    <div className="container page">
      <span className="eyebrow">LEARN BEFORE YOU COMMIT</span>
      <h1>
        More knowledge.
        <br />
        <span className="text-accent">Better decisions.</span>
      </h1>
      <p className="page-intro">
        Explore Bitcoin mining fundamentals, costs and practical questions
        through the Sazmining education library and HashNomads tools.
      </p>
      <div className="benefit-grid">
        <article className="benefit-card">
          <BookOpen />
          <h2>Start with the basics.</h2>
          <p>
            Learn about mining hardware, proof of work, energy costs and the
            questions to ask when getting started.
          </p>
          <a
            className="text-link"
            href="https://www.sazmining.com/learn"
            target="_blank"
            rel="noreferrer"
          >
            Visit Sazmining Learn <ArrowUpRight size={16} />
          </a>
        </article>
        <article className="benefit-card">
          <Newspaper />
          <h2>Keep learning.</h2>
          <p>
            Explore articles and perspectives on the mining industry, service
            models and Bitcoin ownership.
          </p>
          <a
            className="text-link"
            href="https://www.sazmining.com/blog"
            target="_blank"
            rel="noreferrer"
          >
            Read Sazmining articles <ArrowUpRight size={16} />
          </a>
        </article>
        <article className="benefit-card">
          <Calculator />
          <h2>Work through the costs.</h2>
          <p>
            Use your own assumptions to examine energy, fees and operating
            surplus.
          </p>
          <Link className="text-link" href="/calculator">
            Open the calculator <ArrowUpRight size={16} />
          </Link>
        </article>
      </div>
    </div>
  );
}
