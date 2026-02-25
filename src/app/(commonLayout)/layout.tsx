"use client";
import Navbar from "@/components/(shared)/Navbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container mx-auto px-4">
        <Navbar></Navbar>
        {children}
      </div>
    </>
  );
}
