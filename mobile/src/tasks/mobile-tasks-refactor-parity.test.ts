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
// The landscape safe-area fix adds 'left' and 'right' to the surface's SafeAreaView edges, so
// semantics and the render tree each gain those two literals. Hooks, statements, declarations and
// styles are untouched.
const SCREEN_RPC_SCREEN_HOOKS = '1b455d87ed00a1e70a5b3cac0110272e818da9a0d245e9043fc9d2649587831f'
const PRE_REFACTOR_DIFF_HOOKS = '93c7189b32bed8456cc51814fffa8ce80cf62011ef968a9d53ddec2b9686f58f'
const SCREEN_RPC_STATEMENTS = '67ea80f265e4a2e25b3d7e7d9b93664a150a27b93dcfbc39cbdd551de7b4a653'
const MAIN_REBASED_DECLARATIONS = '6ad0397123e59fc1047a14049c86ff31d81723673a7a7f5c41677471aec58415'
const LANDSCAPE_SAFE_AREA_SEMANTICS =
  'd20aa2e2d35aa68d2257cf53c8edea8418e1ce1fe988930be636914dbdcf3a4a'
const PRE_REFACTOR_STYLES = '1db6af69c791d9963928541ad5310942fcbda6d984b422c90b6eb92b6816579a'
const LANDSCAPE_SAFE_AREA_RENDER_TREE =
  '59aee9673da93a7b6cb1ad214aa1ec292d40313578227071b0e40df2ccfffff4'

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
    expect(semantics.split('\n')).toHaveLength(3_302)
    expect(hash(semantics)).toBe(LANDSCAPE_SAFE_AREA_SEMANTICS)
  })

  it('preserves render expressions and event handlers in tree order', () => {
    const tokens = readFlattenedMobileTasksRenderTokens()
    expect(tokens).toHaveLength(35_197)
    expect(hash(tokens)).toBe(LANDSCAPE_SAFE_AREA_RENDER_TREE)
  })

  it('preserves every StyleSheet property and value', () => {
    expect(hash(readMobileTasksStyleSource())).toBe(PRE_REFACTOR_STYLES)
  })
})
