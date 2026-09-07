// FedaPay integration — same signature-verification pattern as the "Center"
// worker (HMAC-SHA256 over `${timestamp}.${rawBody}`, header `t=...,s=...`),
// but calling FedaPay's API directly instead of proxying through Supabase:
// MeGo runs 100% on Cloudflare, with no Supabase dependency.

export interface FedapayEnv {
  FEDAPAY_MODE?: string;
  FEDAPAY_SECRET_KEY?: string;
  FEDAPAY_WEBHOOK_KEY?: string;
}

function apiBase(env: FedapayEnv): string {
  return env.FEDAPAY_MODE === "live"
    ? "https://api.fedapay.com/v1"
    : "https://sandbox-api.fedapay.com/v1";
}

export async function createFedapayCheckout(
  env: FedapayEnv,
  params: { orderId: string; amountCents: number; customerName: string; customerPhone?: string },
): Promise<{ transactionId: number; paymentUrl: string }> {
  const base = apiBase(env);
  const headers = {
    Authorization: `Bearer ${env.FEDAPAY_SECRET_KEY ?? ""}`,
    "Content-Type": "application/json",
  };

  const createRes = await fetch(`${base}/transactions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      description: `Commande MeGo ${params.orderId}`,
      amount: Math.round(params.amountCents / 100),
      currency: { iso: "XOF" },
      customer: {
        firstname: params.customerName,
        lastname: "MeGo",
        ...(params.customerPhone
          ? { phone_number: { number: params.customerPhone, country: "bj" } }
          : {}),
      },
    }),
  });
  if (!createRes.ok) {
    throw new Error(`FedaPay transaction creation failed (${createRes.status}): ${await createRes.text()}`);
  }
  const createData = await createRes.json<any>();
  const transactionId = createData?.["v1/transaction"]?.id ?? createData?.id;
  if (!transactionId) throw new Error("FedaPay did not return a transaction id");

  const tokenRes = await fetch(`${base}/transactions/${transactionId}/token`, {
    method: "POST",
    headers,
  });
  if (!tokenRes.ok) {
    throw new Error(`FedaPay token generation failed (${tokenRes.status}): ${await tokenRes.text()}`);
  }
  const tokenData = await tokenRes.json<any>();
  const paymentUrl = tokenData?.url ?? tokenData?.token?.url ?? tokenData?.["v1/token"]?.url;
  if (!paymentUrl) throw new Error("FedaPay did not return a payment url");

  return { transactionId: Number(transactionId), paymentUrl };
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyFedapaySignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookKey: string | undefined,
): Promise<boolean> {
  if (!signatureHeader || !webhookKey) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    }),
  );
  const timestamp = parts["t"];
  const signature = parts["s"];
  if (!timestamp || !signature) return false;
  const expected = await hmacSha256Hex(webhookKey, `${timestamp}.${rawBody}`);
  return expected === signature;
}

export function fedapayEventStatus(event: any): "APPROVED" | "DECLINED" | "CANCELED" | null {
  const eventName = String(event?.name ?? "");
  if (eventName.includes("approved")) return "APPROVED";
  if (eventName.includes("declined")) return "DECLINED";
  if (eventName.includes("canceled")) return "CANCELED";
  return null;
}

export function fedapayEventTransactionId(event: any): number | null {
  const rawId = event?.data?.id ?? event?.transaction?.id;
  return rawId != null ? Number(rawId) : null;
}
