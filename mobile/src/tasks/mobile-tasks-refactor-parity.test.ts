import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  readFlattenedMobileTasksHookSignatures,
  readMobileTasksSemanticSource,
  readMobileTasksStyleSource
} from './mobile-tasks-source-family.test-support'
import { readFlattenedMobileTasksRenderTokens } from './mobile-tasks-render-parity.test-support'
import {
  readFlattenedMobileTasksCoreStatements,
  readMobileTasksDeclarationSignatures
} from './mobile-tasks-execution-parity.test-support'

const hash = (parts: string[] | string): string =>
  createHash('sha256')
    .update(Array.isArray(parts) ? parts.join('\n') : parts)
    .digest('hex')

// Bound requests change source signatures the same way bound provider, workspace-creation and
// settings requests did: the method string and the envelope read leave the screen and an operation
// name arrives. The behaviour they used to pin is pinned by the recordings in
// mobile/rpc-foundation/goldens instead, which did not move.
//
// The screen-holdout migration takes the last two sends out of this family — the filter sheet's
// linear.selectWorkspace and the screen-root hook's repo.list. Hook, statement, declaration, render
// and style counts are all unchanged, and `semantics` is a pure deletion of four lines, none in:
// two `rpc:` call signatures and the two method literals they carried. The render-token hash moves
// because the picker's handler now names an operation instead of the client.
//
// Step 7's first half moves four of the six again, and moves nothing else. Checked readers on the
// item and list operations delete the reply casts these consumers carried, plus the three shape
// tests the reader now answers for: both `Array.isArray(payload)` guards on the checks read and the
// `typeof count === 'number'` fallback on the item count. Hook, statement, declaration and render
// counts are unchanged, and the render-token hash does not move at all — nothing this family sees
// changed inside a JSX tree. `semantics` is a pure deletion of ten lines.
//
// Round-1 review moves four, and names what each one is. The reaction reader stops matching
// `content` against an arm set mobile invented and forwards it, so `DetailComment` loses the eight
// phantom arms and `COMMENT_REACTION_EMOJI` stops being keyed by them: that is ten string literals
// gone and the `?? ''` fallback's one added, the whole of `semantics`' 3,290 -> 3,281. The eight
// alias-only bindings the deleted casts left behind (`const result = created` and its seven
// siblings) are inlined, which moves the hook and statement hashes without moving their counts.
// Only those eight: the Linear arm of task creation keeps its own `result`, which is a declaration
// with a name rather than an alias for one.
// No `rpc:` signature and no `jsx:` signature moves, the render-token hash does not move, and
// counts stay at 350 hooks, 417 statements and 194 declarations.
//
// The `gitlab.todos` fixture correction moves the same three hashes once more and no others: the
// to-do row is checked now, so the reader's cast is gone from the list-loading hook and the row
// type it forwarded is declared by what the reader proves. Counts are unchanged again, and
// `semantics` does not move, because no RPC call, runtime string or JSX host signature does.
//
// Round 2 moves two, and only because one member widens. `GitHubDetailFile.viewerViewedState` is
// `string` rather than the host's three arms, because the reader forwards it now: that is the
// declaration hash and the three arm literals, `semantics` 3,281 -> 3,278. `status` keeps its arms
// and moves nothing, because its only consumer sends it back as a param the host validates against
// the same set. Hook, statement and render hashes do not move; nothing executable changed.
//
// The landscape safe-area fix adds 'left' and 'right' to the surface's SafeAreaView edges.
// That is two more string literals in `semantics` and two more render tokens; hook,
// statement, declaration and style hashes and every count but those two are untouched.
const SCREEN_RPC_SCREEN_HOOKS = 'a550246eac444aea535ab18d50bc4db6204195ae812665a6beb40a3f5ab553d8'
const PRE_REFACTOR_DIFF_HOOKS = '93c7189b32bed8456cc51814fffa8ce80cf62011ef968a9d53ddec2b9686f58f'
const SCREEN_RPC_STATEMENTS = 'ffa60f57cb239bf02c4c7080847565711cb5c59e3b09d4850a6ce62e986624fa'
const MAIN_REBASED_DECLARATIONS = 'da0a29f09d8a2178e1a937988484f95ffa2938aea94a50a56f797fd631df6072'
const SCREEN_RPC_SEMANTICS = '643411f68426de3e0c503677ba913b0ad89bb29a37194ccf60d85411cd159e3f'
const PRE_REFACTOR_STYLES = '1db6af69c791d9963928541ad5310942fcbda6d984b422c90b6eb92b6816579a'
const SCREEN_RPC_RENDER_TREE = '59aee9673da93a7b6cb1ad214aa1ec292d40313578227071b0e40df2ccfffff4'

describe('Mobile Tasks refactor parity', () => {
  it('preserves recursively flattened hook and dependency order', () => {
    const screenHooks = readFlattenedMobileTasksHookSignatures('MobileTasksScreen')
    expect(screenHooks).toHaveLength(350)
    expect(hash(screenHooks)).toBe(SCREEN_RPC_SCREEN_HOOKS)

    const diffHooks = readFlattenedMobileTasksHookSignatures('GitHubPrFileDiff')
    expect(diffHooks).toHaveLength(3)
    expect(hash(diffHooks)).toBe(PRE_REFACTOR_DIFF_HOOKS)
  })

  it('preserves every screen statement in execution order', () => {
    const statements = readFlattenedMobileTasksCoreStatements()
    expect(statements).toHaveLength(417)
    expect(hash(statements)).toBe(SCREEN_RPC_STATEMENTS)
  })

  it('preserves every moved top-level declaration', () => {
    const declarations = readMobileTasksDeclarationSignatures()
    expect(declarations).toHaveLength(194)
    expect(hash(declarations)).toBe(MAIN_REBASED_DECLARATIONS)
  })

  it('preserves RPC calls, runtime strings, and JSX host signatures', () => {
    const semantics = readMobileTasksSemanticSource()
    expect(semantics.split('\n')).toHaveLength(3_280)
    expect(hash(semantics)).toBe(SCREEN_RPC_SEMANTICS)
  })

  it('preserves render expressions and event handlers in tree order', () => {
    const tokens = readFlattenedMobileTasksRenderTokens()
    expect(tokens).toHaveLength(35_197)
    expect(hash(tokens)).toBe(SCREEN_RPC_RENDER_TREE)
  })

  it('preserves every StyleSheet property and value', () => {
    expect(hash(readMobileTasksStyleSource())).toBe(PRE_REFACTOR_STYLES)
  })
})
