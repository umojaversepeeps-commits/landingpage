"use client";

import { useActionState } from "react";
import { savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/content-types";
import { ImageField } from "./image-field";

function dateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, undefined);

  return (
    <form action={action} className="admin-form">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="field-grid">
        <div className="field field-span">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={post?.title ?? ""}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="slug">URL slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="auto-generated from the title"
          />
        </div>
        <div className="field">
          <label htmlFor="author">Author</label>
          <input
            id="author"
            name="author"
            defaultValue={post?.author ?? "Umojaverse"}
          />
        </div>
        <div className="field">
          <label htmlFor="publishedAt">Publish date</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={dateInputValue(post?.publishedAt)}
          />
        </div>
        <div className="field">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            defaultValue={(post?.tags ?? []).join(", ")}
            placeholder="Comma separated"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={post?.excerpt ?? ""}
          placeholder="A one or two sentence summary shown on the blog index."
        />
      </div>
      <div className="field">
        <label htmlFor="body">Body (Markdown)</label>
        <textarea
          id="body"
          name="body"
          rows={14}
          defaultValue={post?.body ?? ""}
          placeholder={"## A heading\n\nSome **bold** text, a [link](https://example.com), and:\n\n- a list item\n- another item"}
        />
      </div>

      <ImageField
        name="coverImageUrl"
        label="Cover image"
        defaultValue={post?.coverImageUrl ?? ""}
        folder="posts"
        help="Paste an image URL or upload a file."
      />

      <div className="field">
        <label htmlFor="videoUrl">Video URL</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={post?.videoUrl ?? ""}
          placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
        />
        <p className="field-help">
          YouTube and Vimeo links render as a responsive embed.
        </p>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post ? post.published : false}
        />
        Published (visible on the site)
      </label>

      {state?.error && <p className="field-error">{state.error}</p>}

      <div className="admin-actions">
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
