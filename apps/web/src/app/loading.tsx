export default function Loading() {
  return (
    <div className="container page" aria-busy="true" aria-label="Loading page">
      <div className="skeleton" />
      <div className="skeleton short" />
    </div>
  );
}
