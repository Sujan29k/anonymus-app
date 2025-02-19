import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="w-full p-5 bg-white shadow-md flex justify-between items-center px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="AnonymousApp Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold">AnonymousApp</h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/features"
                className="text-gray-700 hover:text-blue-600"
              >
                Features
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="text-center mt-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to AnonymousApp
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          A secure and anonymous way to communicate. Sign up or log in to get
          your unique link and start receiving anonymous messages.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-6">
          <Link href="/login">
            <Button className="px-6 py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="px-6 py-3 text-lg rounded-lg bg-green-600 hover:bg-green-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Illustration/Image */}
        <div className="mt-12">
          <Image
            src="/secure-messaging.png"
            alt="Secure Messaging Illustration"
            width={400}
            height={400}
            className="mx-auto"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-10 p-4 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} AnonymousApp |
        <Link href="/privacy-policy" className="ml-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        |
        <Link href="/terms" className="ml-2 hover:underline">
          Terms of Service
        </Link>
      </footer>
    </div>
  );
}
