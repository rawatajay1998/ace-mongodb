"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { Input } from "antd";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="login_page">
      <div className="image">
        <Image
          src={"/assets/images/home-banner.jpg"}
          alt="Login Image"
          height={1000}
          width={1000}
        />
        <p className="quote">
          Where luxury meets lifestyle — discover your next address in the heart
          of the city.
        </p>
      </div>
      <div className="content">
        <div className="logo">
          <Image
            src={"/assets/images/ace-logo-blue.png"}
            alt="Login Image"
            height={100}
            width={100}
          />
        </div>
        <h3>Login</h3>
        <div className="form_field">
          <label>Email Address</label>
          <Input
            size="large"
            placeholder="name@mail.com"
            prefix={<Mail size={20} />}
            className="rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form_field">
          <label>Password</label>
          <Input.Password
            size="large"
            placeholder="6+ Characters, 1 Capital letter"
            prefix={<Lock size={20} />}
            className="rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
