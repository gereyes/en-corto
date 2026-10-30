import { expect, mock, test } from 'claude-code/testing'

const LONG = Array.from({ length: 150 }, (_, i) => `palabra${i}`).join(' ')
const SHORT = 'Listo, ya quedó.'
const CODE_ONLY = `Mira:\n\`\`\`\n${LONG}\n\`\`\``
const TABLE_ONLY = `Estado:\n${Array.from({ length: 40 }, (_, i) => `| fila${i} | uno dos tres | cuatro |`).join('\n')}`
const STATUS = `${LONG} reporte`
const BAND = { component: 'AbovePrompt', props: { hasSurvey: false } } as const

const turn = (answer: string, turnId: string, extra: Record<string, unknown> = {}) =>
  ({ answer, durationMs: 1000, isAborted: false, turnId, reason: 'answer', text: answer, ...extra }) as never

test('shows a one-line summary above the prompt only for long explanations', async ($, on) => {
  const asked: string[] = []
  on('session.start', async ($, e) => ({ cwd: e.cwd }) as never)
  on('command.register', async () => ({ value: undefined }) as never)
  on('prompt.submit', async ($, e) => e as never)
  on('turn.complete', async ($, e) => ({ text: (e as { answer: string }).answer }) as never)
  on('model.complete', async ($, e) => {
    const prompt = String((e as { prompt: unknown }).prompt)
    asked.push(prompt)
    const text = prompt.includes('reporte') ? 'NADA.' : 'La agricultura permitió las primeras ciudades.\nlínea extra'
    return { value: { isAnswered: true, text, usage: {} } } as never
  })
  on('ui.render', async ($, e) => {
    const { Box } = $.ui.resolve(e as never)
    return <Box />
  })
  mock.store(on, {})

  const box = async () => {
    const view = await $.ui.mount({ plugin: 'en-corto', surface: 'terminal', ...BAND } as never)
    const title = await view.find({ text: 'En corto' })
    const line = await view.find({ text: 'La agricultura permitió las primeras ciudades.' })
    await view.unmount()
    return { isShown: title !== undefined, hasLine: line !== undefined }
  }

  await $.session.start({ source: 'startup', cwd: '/tmp/p', surface: 'terminal', isInteractive: true } as never)

  for (const answer of [SHORT, CODE_ONLY, TABLE_ONLY]) {
    await $.turn.complete(turn(answer, 't0'))
    expect((await box()).isShown).toBe(false)
  }
  await $.turn.complete(turn(LONG, 't1', { agentId: 'a1' }))
  expect(asked.length).toBe(0)

  await $.turn.complete(turn(LONG, 't2'))
  expect(asked.length).toBe(1)
  expect(asked[0]).toBe(`<respuesta>\n${LONG}\n</respuesta>`)
  expect(await box()).toEqual({ isShown: true, hasLine: true })

  await $.turn.complete(turn(SHORT, 't3'))
  expect((await box()).isShown).toBe(false)

  await $.turn.complete(turn(STATUS, 't4'))
  expect(asked.length).toBe(2)
  expect((await box()).isShown).toBe(false)

  await $.turn.complete(turn(LONG, 't5'))
  await $.prompt.submit({ text: 'otra cosa' } as never)
  expect((await box()).isShown).toBe(false)

  await $.command.run({ command: 'en-corto', args: '' } as never)
  await $.turn.complete(turn(LONG, 't6'))
  expect(asked.length).toBe(3)
})
