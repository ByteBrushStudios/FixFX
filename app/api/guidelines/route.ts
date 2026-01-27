import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "packages/providers/GUIDELINES.md");
    const content = await readFile(filePath, "utf-8");

    return Response.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error reading guidelines:", error);
    return Response.json(
      { success: false, error: "Failed to read guidelines" },
      { status: 500 },
    );
  }
}
