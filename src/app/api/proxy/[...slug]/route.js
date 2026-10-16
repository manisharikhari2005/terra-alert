import { NextResponse } from "next/server";

async function proxyRequest(request, routeContext) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { success: false, error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  const { params } = routeContext;
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];
  const path = Array.isArray(slug) ? slug.join("/") : String(slug);
  const searchParams = request.nextUrl.searchParams.toString();
  const query = searchParams ? `?${searchParams}` : "";

  const url = `${backendUrl.replace(/\/+$/, "")}/${path}${query}`;

  try {
    const res = await fetch(url, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: text };
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Proxy request failed" },
      { status: 502 },
    );
  }
}

export async function GET(request, context) {
  return proxyRequest(request, context);
}

export async function POST(request, context) {
  return proxyRequest(request, context);
}

export async function PATCH(request, context) {
  return proxyRequest(request, context);
}

export async function PUT(request, context) {
  return proxyRequest(request, context);
}

export async function DELETE(request, context) {
  return proxyRequest(request, context);
}

export async function HEAD(request, context) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request, context) {
  return proxyRequest(request, context);
}
