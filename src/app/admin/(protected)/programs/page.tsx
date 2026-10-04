import Link from "next/link";
import { deleteProgram } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { getPrograms } from "@/lib/content";
import {
  formatDate,
  programStatus,
  programStatusLabels,
} from "@/lib/content-types";

export default async function AdminProgramsPage() {
  const programs = await getPrograms({ includeUnpublished: true });

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2>Programs</h2>
        <Link href="/admin/programs/new" className="button button-primary">
          New program
        </Link>
      </div>

      {programs.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Dates</th>
                <th scope="col">Visibility</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => {
                const status = programStatus(program);
                return (
                  <tr key={program.id ?? program.slug}>
                    <td>
                      <strong>{program.title}</strong>
                      <span className="quiet-label block">
                        /programs/{program.slug}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${status}`}>
                        {programStatusLabels[status]}
                      </span>
                    </td>
                    <td>
                      {formatDate(program.startDate) || "—"}
                      {program.endDate &&
                        program.endDate !== program.startDate &&
                        ` – ${formatDate(program.endDate)}`}
                    </td>
                    <td>{program.published ? "Published" : "Draft"}</td>
                    <td>
                      <div className="admin-row-actions">
                        {program.id && (
                          <Link
                            href={`/admin/programs/${program.id}`}
                            className="text-link"
                          >
                            Edit
                          </Link>
                        )}
                        {program.id && (
                          <form action={deleteProgram}>
                            <input type="hidden" name="id" value={program.id} />
                            <ConfirmSubmit
                              message={`Delete “${program.title}”? This cannot be undone.`}
                              className="text-link danger"
                            >
                              Delete
                            </ConfirmSubmit>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">
          No programs yet. Create your first one to get started.
        </p>
      )}
    </section>
  );
}
