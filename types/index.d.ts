export type Summary = { turnId: string; line: string | null }

declare module 'claude-code' {
  interface PluginState {
    'en-corto': { summary: Summary | null }
  }
}
