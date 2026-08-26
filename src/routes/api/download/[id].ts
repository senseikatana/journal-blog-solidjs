import type { APIEvent } from "@solidjs/start/server";

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

interface VercelBlob {
  url: string;
  pathname?: string;
}

/**
 * POST /api/download/{id}  body: { token: string }
 *
 * Validates the per-document access code (DOCS_TOKEN_{ID} env var) and, if
 * valid, streams the private PDF from Vercel Blob. The blob URL is never
 * exposed to the client.
 */
export async function POST({ params, request }: APIEvent) {
  const id = params.id?.toLowerCase();
  if (!id) return json({ error: "missing document id" }, 400);

  let token: string | undefined;
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token;
  } catch {
    return json({ error: "invalid request body" }, 400);
  }

  const envKey = `DOCS_TOKEN_${id.toUpperCase().replace(/-/g, "_")}`;
  const expected = process.env[envKey];
  if (!expected || !token || token !== expected) {
    return json({ error: "unauthorized" }, 401);
  }

  try {
    const listUrl = `https://blob.vercel-storage.com/?prefix=${encodeURIComponent(`docs/${id}`)}&limit=100`;
    const listRes = await fetch(listUrl, {
      headers: { authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!listRes.ok) return json({ error: "storage unavailable" }, 503);

    const { blobs } = (await listRes.json()) as { blobs: VercelBlob[] };
    const blob =
      blobs.find((b) => b.pathname === `docs/${id}.pdf`) ??
      blobs.find((b) => b.pathname === `docs/${id}`) ??
      blobs[0];
    if (!blob) return json({ error: "document not found" }, 404);

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const res = await fetch(blob.url, {
      headers: blobToken ? { authorization: `Bearer ${blobToken}` } : {},
    });
    if (!res.ok || !res.body) return json({ error: "failed to read document" }, 502);

    return new Response(res.body, {
      headers: {
        "content-type": res.headers.get("content-type") ?? "application/pdf",
        "content-disposition": `attachment; filename="${id}.pdf"`,
        "cache-control": "no-store",
      },
    });
  } catch {
    return json({ error: "storage unavailable" }, 503);
  }
}
