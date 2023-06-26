export default function assertUnreachable(
  val: never,
  panicMessage?: string
): never {
  throw new Error(
    panicMessage ??
      `Received a value which should not exist: ${JSON.stringify(val)}`
  );
}
