export const ALLOWED_CHAR_CHECK =
  // biome-ignore lint/style/useNamedCaptureGroup: positional groups keep this hot-path regex allocation-free; indices unused (zod .regex only tests)
  /^(?!.*([!@#$%^&*(),.?":{}|<>,.#/])\1)([\w -]+)$/gu;
