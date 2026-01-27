import { getTrustedHosts } from "@/lib/trusted-hosts";

export async function GET() {
  try {
    const hosts = await getTrustedHosts();
    return Response.json({
      success: true,
      hosts,
    });
  } catch (error) {
    console.error("Error fetching trusted hosts:", error);
    return Response.json(
      { success: false, error: "Failed to fetch trusted hosts" },
      { status: 500 }
    );
  }
}
