import Navbar from "@/components/Navbar";

export default function GroupLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
