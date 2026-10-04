import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProgram } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { ProgramForm } from "@/components/admin/program-form";
import { getPrograms } from "@/lib/content";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const programs = await getPrograms({ includeUnpublished: true });
  const program = programs.find((item) => item.id === id);
  if (!program) notFound();

  return (
    <section className="admin-section">
      <Link href="/admin/programs" className="back-link">
        ← Programs
      </Link>
      <div className="admin-section-head">
        <h2>Edit program</h2>
        <form action={deleteProgram}>
          <input type="hidden" name="id" value={program.id} />
          <ConfirmSubmit
            message={`Delete “${program.title}”? This cannot be undone.`}
            className="button button-secondary"
          >
            Delete program
          </ConfirmSubmit>
        </form>
      </div>
      <ProgramForm program={program} />
    </section>
  );
}
