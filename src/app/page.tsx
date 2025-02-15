import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <p>Anonymous App</p>
      <Link href="/login" className="text-black">
        Login
      </Link>
    </div>
  );
}
