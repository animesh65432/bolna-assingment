"use client"
import Home from "@/components/Home";
import { useContext } from "react"
import { ToastContainer } from "react-toastify";
import Login from "@/components/Login";
import { UserContext } from "@/context/user";

export default function HomePage() {
  const { IsLoggedIn } = useContext(UserContext)!;
  return (
    <main className=" bg-white h-dvh">
      {IsLoggedIn ? <Home /> : <Login />}
      <ToastContainer />
    </main>
  );
}
