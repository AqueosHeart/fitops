import "server-only";

/** Retries only complete PostgreSQL transactions that are safe to retry. */
export async function withTransactionRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
      const metaCode = typeof error === "object" && error && "meta" in error && typeof error.meta === "object" && error.meta && "code" in error.meta
        ? String(error.meta.code)
        : undefined;
      if ((code === "40P01" || code === "40001" || code === "P2034" || metaCode === "40P01" || metaCode === "40001") && attempt < 2) continue;
      throw error;
    }
  }
  throw new Error("Unreachable transaction retry state.");
}
