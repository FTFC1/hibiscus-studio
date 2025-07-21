import { NextResponse } from "next/server"

export async function GET() {
  const dependencies = {
    jsonwebtoken: false,
    bcryptjs: false,
  }

  try {
    require("jsonwebtoken")
    dependencies.jsonwebtoken = true
  } catch (e) {
    console.log("jsonwebtoken not available:", e)
  }

  try {
    require("bcryptjs")
    dependencies.bcryptjs = true
  } catch (e) {
    console.log("bcryptjs not available:", e)
  }

  return NextResponse.json({
    dependencies,
    nodeVersion: process.version,
    platform: process.platform,
    env: {
      JWT_SECRET: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length || 0,
    },
  })
}
