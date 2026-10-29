import { notFound } from "next/navigation";

// Unknown paths under /en or /pl render the localized 404 inside the site layout.
export default function CatchAll() {
  notFound();
}

export function generateStaticParams() { return [{ rest: ["404"] }]; }
