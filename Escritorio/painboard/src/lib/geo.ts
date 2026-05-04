export async function getCountryFromIP(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return data.country_code || null
  } catch { return null }
}
