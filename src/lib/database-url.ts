/**
 * Resolve the app's database connection string across supported providers.
 * Neon’s Vercel integration exposes the pooled connection as POSTGRES_URL;
 * manual deployments may continue to use DATABASE_URL.
 */
export function getDatabaseUrl(
  environment: Record<string, string | undefined> = process.env,
): string | undefined {
  const url = environment.DATABASE_URL?.trim() || environment.POSTGRES_URL?.trim();
  return url || undefined;
}
