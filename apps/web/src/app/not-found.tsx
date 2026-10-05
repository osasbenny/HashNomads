import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page">
      <span className="eyebrow">404 / NOT FOUND</span>
      <h1>This route is off the map.</h1>
      <p className="page-intro">
        The page or hardware model could not be found.
      </p>
      <Link className="button primary" href="/">
        Return home
      </Link>
    </div>
  );
}
