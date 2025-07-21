import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-middleware"

// Vehicle data without prices - prices are calculated server-side
const VEHICLE_CATALOG = [
  {
    BRAND: "CHANGAN",
    MODEL: "ALSVIN V3",
    TRIM: "DYNAMIC",
    ITEM_DESCRIPTION: "CHANGAN ALSVIN V3 DYNAMIC",
    WARRANTY: "6 YEARS / 200,000KM WHICHEVER COMES FIRST",
    SEGMENT: "SEDAN - B",
  },
  // ... rest of vehicle data without prices
]

export async function GET(request: NextRequest) {
  const user = verifyToken(request)

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(VEHICLE_CATALOG)
}
