import Link from "next/link";

export default function Header() {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight my-8">
      <Link href="/blog">
        <a className="hover:underline">🔙 </a>
      </Link>
    </h2>
  );
}
