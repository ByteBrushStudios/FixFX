import { getHostingProviders } from "@/lib/providers";

export async function GET() {
  try {
    const providers = await getHostingProviders();
    return Response.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return Response.json(
      { success: false, error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
