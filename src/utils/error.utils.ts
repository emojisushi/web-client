export const isChunkLoadError = (error: unknown): error is Error => {
  return error instanceof Error && error.name === "ChunkLoadError";
};
