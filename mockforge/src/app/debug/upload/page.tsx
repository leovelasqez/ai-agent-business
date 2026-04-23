"use client";

import { useRef, useState } from "react";

function describeFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) {
    return {
      exists: false,
      name: null,
      size: null,
      type: null,
    };
  }

  return {
    exists: true,
    name: value.name,
    size: value.size,
    type: value.type,
  };
}

export default function DebugUploadPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [responseText, setResponseText] = useState<string>("No request sent yet.");
  const [clientDebug, setClientDebug] = useState<string>("No inspection yet.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDisabledInProduction =
    process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_ENABLE_DEBUG_UPLOAD_PAGE;

  const inspectClientState = () => {
    const input = fileInputRef.current;
    const files = input?.files;
    const inputFile = files && files.length > 0 ? files[0] : null;
    const form = formRef.current;
    const formData = form ? new FormData(form) : null;
    const formFile = formData ? formData.get("file") : null;

    const snapshot = {
      input: {
        filesLength: files?.length ?? 0,
        file: describeFile(inputFile),
        value: input?.value ?? null,
      },
      formData: {
        file: describeFile(formFile),
      },
    };

    setClientDebug(JSON.stringify(snapshot, null, 2));
    return snapshot;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponseText("Sending request...");

    try {
      inspectClientState();

      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/debug/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      setResponseText(text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown client error";
      setResponseText(JSON.stringify({ ok: false, error: "CLIENT_FETCH_FAILED", message }, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDisabledInProduction) {
    return (
      <main className="min-h-screen bg-white px-6 py-10 text-black">
        <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
          <h1 className="text-2xl font-bold">Debug upload disabled</h1>
          <p className="mt-3 text-sm text-neutral-600">
            This internal page is not enabled in production.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Debug Upload</h1>
        <p className="text-sm text-neutral-600">
          Esta página inspecciona el file input en cliente y luego envía con <code>fetch + FormData</code>.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-6">
          <div>
            <label htmlFor="debug-file" className="mb-2 block text-sm font-medium">Product image</label>
            <input
              ref={fileInputRef}
              id="debug-file"
              name="file"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="block w-full"
              onChange={inspectClientState}
            />
          </div>

          <div>
            <label htmlFor="debug-productName" className="mb-2 block text-sm font-medium">Product name</label>
            <input id="debug-productName" name="productName" type="text" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label htmlFor="debug-category" className="mb-2 block text-sm font-medium">Category</label>
            <input id="debug-category" name="category" type="text" className="w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label htmlFor="debug-preset" className="mb-2 block text-sm font-medium">Preset</label>
            <select id="debug-preset" name="preset" className="w-full rounded border px-3 py-2" defaultValue="clean_studio">
              <option value="clean_studio">Clean studio</option>
              <option value="lifestyle_scene">Lifestyle scene</option>
              <option value="ad_creative">Ad creative</option>
            </select>
          </div>

          <div>
            <label htmlFor="debug-format" className="mb-2 block text-sm font-medium">Format</label>
            <select id="debug-format" name="format" className="w-full rounded border px-3 py-2" defaultValue="1:1 square">
              <option value="1:1 square">1:1 square</option>
              <option value="4:5 portrait">4:5 portrait</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={inspectClientState} className="rounded border px-4 py-2 text-sm">
              Inspect client state
            </button>
            <button type="submit" className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Upload + Generate"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border bg-neutral-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Client debug</h2>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm">{clientDebug}</pre>
        </section>

        <section className="rounded-2xl border bg-neutral-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Raw response</h2>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm">{responseText}</pre>
        </section>
      </div>
    </main>
  );
}
