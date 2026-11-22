
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Allow this diagnostic endpoint only during local development.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This diagnostic endpoint is disabled outside local development." },
      { status: 404 }
    );
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  const environment = process.env.PESAPAL_ENV || "sandbox";

  if (!consumerKey || !consumerSecret) {
    return NextResponse.json(
      {
        error:
          "Pesapal credentials are missing. Check PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET in .env.local.",
      },
      { status: 500 }
    );
  }

  if (environment !== "sandbox") {
    return NextResponse.json(
      { error: "This diagnostic route is for sandbox testing only." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken",
      {
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
      }
    );

    const data = await response.json();

    if (!response.ok || !data.token) {
      console.error("Pesapal authentication failed:", {
        httpStatus: response.status,
        error: data.error?.message || data.message || "Authentication failed",
      });

      return NextResponse.json(
        {
          ok: false,
          error:
            "Pesapal authentication failed. Check your sandbox credentials and try again.",
        },
        { status: 502 }
      );
    }

    // Never send the access token or merchant credentials to the browser.
    return NextResponse.json({
      ok: true,
      message: "Pesapal sandbox authentication successful.",
      expiryDate: data.expiryDate,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not connect to Pesapal. Check your internet connection.",
      },
      { status: 502 }
    );
  }
}
