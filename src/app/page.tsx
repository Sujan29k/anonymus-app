import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="text-center">
      <p>Anonymous App</p>
      <Button>
        <Link href="/login" className="text-black">
          Login
        </Link>
      </Button>
    </div>
  );
}
