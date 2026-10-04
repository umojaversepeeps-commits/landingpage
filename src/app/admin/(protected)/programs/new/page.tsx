import Link from "next/link";
import { ProgramForm } from "@/components/admin/program-form";

export default function NewProgramPage() {
  return (
    <section className="admin-section">
      <Link href="/admin/programs" className="back-link">
        ← Programs
      </Link>
      <h2>New program</h2>
      <ProgramForm />
    </section>
  );
}
