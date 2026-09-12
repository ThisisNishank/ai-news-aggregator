import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import UserPreference from "@/lib/models/UserPreference";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to view preferences" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const preferences = await UserPreference.findOne({
      userId: session.user.id,
    }).lean();

    return NextResponse.json({
      preferences: preferences ?? {
        categories: [],
        language: "en",
        country: "in",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch preferences" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to update preferences" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const categories = Array.isArray(body.categories)
      ? body.categories.filter(
          (category: unknown): category is string =>
            typeof category === "string",
        )
      : [];

    const language =
      typeof body.language === "string" ? body.language : "en";

    const country =
      typeof body.country === "string" ? body.country : "in";

    await connectToDatabase();

    const preferences = await UserPreference.findOneAndUpdate(
      {
        userId: session.user.id,
      },
      {
        userId: session.user.id,
        categories,
        language,
        country,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return NextResponse.json({ preferences });
  } catch {
    return NextResponse.json(
      { error: "Unable to update preferences" },
      { status: 500 },
    );
  }
}