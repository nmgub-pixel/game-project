import { db } from "@/db";
import { scores } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  const allScores = await db.select().from(scores).orderBy(desc(scores.score)).limit(10);
  return NextResponse.json(allScores);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newScore = await db.insert(scores).values({
    game: body.game,
    player: body.player,
    score: body.score,
  }).returning();
  return NextResponse.json(newScore[0]);
}
