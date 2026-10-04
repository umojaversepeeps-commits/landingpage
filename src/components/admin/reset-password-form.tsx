"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { resetPassword } from "@/app/admin/reset-password/actions";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const captured = useRef(false);

  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get("token_hash") ?? "";
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    );
    // Read the browser-only fragment after hydration; never send it in a GET URL.
    setTokenHash(token);
  }, []);

  return (
    <form action={action} className="admin-form admin-login-form">
      <input
        type="hidden"
        name="tokenHash"
        value={state?.tokenConsumed ? "" : (tokenHash ?? "")}
      />
      <div className="field">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby="password-help"
        />
        <p id="password-help" className="field-help">
          Use 12–128 characters. A long, unique passphrase works well.
        </p>
      </div>
      <div className="field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      </div>
      {state?.error && <p className="field-error" role="alert">{state.error}</p>}
      <button
        type="submit"
        className="button button-primary"
        disabled={pending || tokenHash === null}
      >
        {pending ? "Updating password…" : "Set new password"}
      </button>
    </form>
  );
}
