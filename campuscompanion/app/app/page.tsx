'use client';
import Header from "@/app/components/header";
import LoginPage from "./pages/auth/page";
import Chat from "./pages/chat/page";
import TestPage from "./pages/test/page";
import { useState, useEffect } from 'react';

export default function Home() {
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    fetch("/api/api/chat/users/current")
      .then((data) => data.json())
      .then((data) => setisAuth(data.unity_id));
  });

  

  return isAuth ? (
    <main className="">
      <Chat />
    </main>
  ) :
    (
      <main className="">
        <LoginPage />
      </main>
    );
}