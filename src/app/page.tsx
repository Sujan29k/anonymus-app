"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container">
      {/* Left Section - Image */}
      <div className="image-section">
        <Image
          src="/cov.png"
          alt="Illustration"
          width={500}
          height={500}
          className="illustration"
        />
      </div>

      {/* Right Section - Content */}
      <div className="content-section">
        <Image
          src="/cover.png"
          alt="User Avatar"
          width={90}
          height={90}
          className="avatar"
        />
        <h1 className="title">FortnPage</h1>
        <p className="subtitle">Anonymity Platform</p>

        {/* Buttons */}
        <div className="button-container">
          <Link href="/login">
            <button className="button login-button">Login</button>
          </Link>
          <Link href="/signup">
            <button className="button signup-button">Sign Up</button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f8f9fa;
          padding: 2rem;
          gap: 2rem;
        }

        .image-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          border-radius: 1px;
          height: 85%;
          background-color: #f3f5f6;
        }

        .content-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          border-radius: 1px;
          height: 85%;
          text-align: center;
          background-color: #f4f4f4;
gap: 0.1rem;
};
        }

        .illustration {
          max-width: 90%;
          height: auto;
        }

        .avatar {
          border-radius: 50%;
          margin-bottom: 1rem;
          height:9rem;
          width:9rem;
        }

        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #222;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 2rem;
          color: #666;
          margin-bottom: 3rem;
        }

        .button-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .button {
          padding: 1rem 2.5rem;
          font-size: 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          border: none;
        }

        .button:hover {
          transform: scale(1.05);
        }

        .login-button {
          background-color: #d51a29;
        }

        .login-button:hover {
          background-color: #d56e77;
        }

        .signup-button {
          background-color: #14263f;
        }

        .signup-button:hover {
          background-color: #21506f;
        }
      `}</style>
    </div>
  );
}
