import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-surface overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-surface">
        {children}
      </main>
    </div>
  );
};