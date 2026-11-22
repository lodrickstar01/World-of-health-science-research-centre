
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PESAPAL_AUTH_URL =
  "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { ok: false, error: "Diagnostic route is disabled outside development." },
      { status: 404 }
    );
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET?.trim();
  const environment = process.env.PESAPAL_ENV?.trim().toLowerCase();

  if (environment && environment !== "sandbox") {
    return NextResponse.json(
      { ok: false, error: "This route only supports sandbox testing." },
      { status: 400 }
    );
  }

  if (!consumerKey || !consumerSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Pesapal environment variables.",
        check: [
          "PESAPAL_CONSUMER_KEY",
          "PESAPAL_CONSUMER_SECRET",
        ],
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(PESAPAL_AUTH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const rawBody = await response.text();

    let data: {
      token?: string;
      expiryDate?: string;
      status?: string;
      message?: string;
      error?: {
        type?: string;
        code?: string;
        message?: string;
      } | null;
    };

    try {
      data = JSON.parse(rawBody);
    } catch {
      console.error("Pesapal returned a non-JSON response:", {
        httpStatus: response.status,
        contentType: response.headers.get("content-type"),
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Pesapal returned an unexpected response format.",
          httpStatus: response.status,
        },
        { status: 502 }
      );
    }

    // Safe diagnostic: never log credentials or the access token.
    console.info("Pesapal authentication diagnostic:", {
      httpStatus: response.status,
      apiStatus: data.status ?? null,
      message: data.message ?? null,
      errorCode: data.error?.code ?? null,
      errorMessage: data.error?.message ?? null,
      tokenReceived: Boolean(data.token),
    });

    if (!response.ok || !data.token) {
      return NextResponse.json(
        {
          ok: false,
          error: "Pesapal did not issue an access token.",
          httpStatus: response.status,
          apiStatus: data.status ?? null,
          message: data.message ?? null,
          providerError: data.error?.message ?? null,
          hint:
            "Verify that both values are copied exactly from Pesapal's official sandbox credentials file. If they are correct, contact Pesapal developer support.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Pesapal sandbox authentication successful.",
      expiryDate: data.expiryDate ?? null,
    });
  } catch (error) {
    const timedOut =
      error instanceof Error && error.name === "TimeoutError";

    console.error("Pesapal connection error:", {
      type: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        ok: false,
        error: timedOut
          ? "Pesapal authentication request timed out."
          : "Could not connect to Pesapal.",
      },
      { status: 502 }
    );
  }
}
