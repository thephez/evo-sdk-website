#!/usr/bin/env python3
"""
Documentation generator for Evo JS SDK
Reads query and state transition definitions from an api-definitions.json file
and generates both user documentation (HTML) and AI reference (Markdown).

This is adapted from the wasm-sdk website generator to target the Evo SDK.
It focuses on readable examples using EvoSDK facades; it does not include
an in-browser runner yet (can be added later).
"""

import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent


def load_api_definitions(api_definitions_file: Path):
    with open(api_definitions_file, 'r', encoding='utf-8') as f:
        api_data = json.load(f)
    return api_data.get('queries', {}), api_data.get('transitions', {})


def evo_example_for_query(key: str, inputs: list[dict]):
    # Provide EvoSDK examples for common queries. Fallback shows Wasm function style.
    m = {
        'getIdentity': "await client.identities.fetch(id)",
        'getIdentityKeys': "await client.identities.getKeys({ identityId, keyRequestType, specificKeyIds, searchPurposeMap, limit, offset })",
        'getDataContract': "await client.contracts.fetch(id)",
        'getDataContractHistory': "await client.contracts.getHistory({ contractId: id, limit, startAtMs })",
        'getDataContracts': "await client.contracts.getMany(ids)",
        'getDocuments': "await client.documents.query({ contractId, type: documentType, where, orderBy, limit, startAfter, startAt })",
        'getDocument': "await client.documents.get(dataContractId, documentType, documentId)",
        'getDpnsUsername': "await client.dpns.username(identityId)",
        'getDpnsUsernames': "await client.dpns.usernames(identityId, { limit })",
        'dpnsCheckAvailability': "await client.dpns.isNameAvailable(label)",
        'dpnsResolve': "await client.dpns.resolveName(name)",
        'getContestedResources': "await client.group.contestedResources({ documentTypeName, contractId, indexName, startAtValue, limit, orderAscending })",
        'getContestedResourceVoteState': "await client.voting.contestedResourceVoteState({ contractId, documentTypeName, indexName, indexValues, resultType, allowIncludeLockedAndAbstainingVoteTally, startAtIdentifierInfo, count, orderAscending })",
        'getContestedResourceVotersForIdentity': "await client.group.contestedResourceVotersForIdentity({ contractId, documentTypeName, indexName, indexValues, contestantId, startAtVoterInfo, limit, orderAscending })",
        'getContestedResourceIdentityVotes': "await client.voting.contestedResourceIdentityVotes(identityId, { limit, startAtVotePollIdInfo, orderAscending })",
        'getVotePollsByEndDate': "await client.wasm.getVotePollsByEndDate(epoch, limit, startAfter, orderAscending)",
        'getProtocolVersionUpgradeState': "await client.protocol.versionUpgradeState()",
        'getProtocolVersionUpgradeVoteStatus': "await client.protocol.versionUpgradeVoteStatus({ startProTxHash, count })",
        'getEpochsInfo': "await client.epoch.epochsInfo({ startEpoch, count, ascending })",
        'getCurrentEpoch': "await client.epoch.current()",
        'getFinalizedEpochInfos': "await client.epoch.finalizedInfos({ startEpoch, count, ascending })",
        'getEvonodesProposedEpochBlocksByIds': "await client.epoch.evonodesProposedBlocksByIds(epoch, ids)",
        'getEvonodesProposedEpochBlocksByRange': "await client.epoch.evonodesProposedBlocksByRange(epoch, { limit, startAfter, orderAscending })",
        'getTokenStatuses': "await client.tokens.statuses(tokenIds)",
        'getTokenDirectPurchasePrices': "await client.tokens.directPurchasePrices(tokenIds)",
        'getTokenContractInfo': "await client.tokens.contractInfo(dataContractId)",
        'getTokenPerpetualDistributionLastClaim': "await client.tokens.perpetualDistributionLastClaim(identityId, tokenId)",
        'getTokenTotalSupply': "await client.tokens.totalSupply(tokenId)",
        'getGroupInfo': "await client.wasm.getGroupInfo(contractId, groupContractPosition)",
        'getGroupInfos': "await client.wasm.getGroupInfos(contractId, startAtGroupContractPosition, startGroupContractPositionIncluded, count)",
        'getGroupActions': "await client.wasm.getGroupActions(contractId, groupContractPosition, status, startActionId, startActionIdIncluded, count)",
        'getGroupActionSigners': "await client.wasm.getGroupActionSigners(contractId, groupContractPosition, status, actionId)",
        'getStatus': "await client.system.status()",
        'getCurrentQuorumsInfo': "await client.system.currentQuorumsInfo()",
        'getPrefundedSpecializedBalance': "await client.system.prefundedSpecializedBalance(identityId)",
        'getTotalCreditsInPlatform': "await client.system.totalCreditsInPlatform()",
        'getPathElements': "await client.system.pathElements(path, keys)",
        'waitForStateTransitionResult': "await client.system.waitForStateTransitionResult(stateTransitionHash)",
        'getIdentityTokenBalances': "await client.wasm.getIdentityTokenBalances(identityId, tokenIds)",
        'getIdentitiesTokenBalances': "await client.tokens.balances(identityIds, tokenId)",
        'getIdentityTokenInfos': "await client.tokens.identityTokenInfos(identityId, tokenIds, { limit, offset })",
        'getIdentitiesTokenInfos': "await client.tokens.identitiesTokenInfos(identityIds, tokenId)",
        'getIdentity': "await client.identities.fetch(id)",
        'getIdentityNonce': "await client.wasm.getIdentityNonce(identityId)",
        'getIdentityContractNonce': "await client.wasm.getIdentityContractNonce(identityId, contractId)",
        'getIdentityBalance': "await client.wasm.getIdentityBalance(id)",
        'getIdentitiesBalances': "await client.wasm.getIdentitiesBalances(ids)",
        'getIdentityBalanceAndRevision': "await client.wasm.getIdentityBalanceAndRevision(id)",
        'getIdentityByPublicKeyHash': "await client.wasm.getIdentityByPublicKeyHash(publicKeyHash)",
        'getIdentityByNonUniquePublicKeyHash': "await client.wasm.getIdentityByNonUniquePublicKeyHash(publicKeyHash, startAfter)",
    }
    return m.get(key)


def evo_example_for_transition(key: str):
    m = {
        # Identities
        'identityCreate': "await client.identities.create({ assetLockProof, assetLockPrivateKeyWif, publicKeys })",
        'identityTopUp': "await client.identities.topUp({ identityId, assetLockProof, assetLockPrivateKeyWif })",
        'identityCreditTransfer': "await client.identities.creditTransfer({ senderId, recipientId, amount, privateKeyWif, keyId })",
        'identityCreditWithdrawal': "await client.identities.creditWithdrawal({ identityId, toAddress, amount, coreFeePerByte, privateKeyWif, keyId })",
        'identityUpdate': "await client.identities.update({ identityId, addPublicKeys, disablePublicKeyIds, privateKeyWif })",
        # Documents
        'documentCreate': "await client.documents.create({ contractId, type: documentType, ownerId, data, entropyHex, privateKeyWif })",
        'documentReplace': "await client.documents.replace({ contractId, type: documentType, documentId, ownerId, data, revision, privateKeyWif })",
        'documentDelete': "await client.documents.delete({ contractId, type: documentType, documentId, ownerId, privateKeyWif })",
        'documentTransfer': "await client.documents.transfer({ contractId, type: documentType, documentId, ownerId, recipientId, privateKeyWif })",
        'documentPurchase': "await client.documents.purchase({ contractId, type: documentType, documentId, buyerId, price, privateKeyWif })",
        'documentSetPrice': "await client.documents.setPrice({ contractId, type: documentType, documentId, ownerId, price, privateKeyWif })",
        # Tokens
        'tokenMint': "await client.tokens.mint({ contractId, tokenPosition, amount, identityId, privateKeyWif, recipientId, publicNote })",
        'tokenBurn': "await client.tokens.burn({ contractId, tokenPosition, amount, identityId, privateKeyWif, publicNote })",
        'tokenTransfer': "await client.tokens.transfer({ contractId, tokenPosition, amount, senderId, recipientId, privateKeyWif, publicNote })",
        'tokenFreeze': "await client.tokens.freeze({ contractId, tokenPosition, identityToFreeze, freezerId, privateKeyWif, publicNote })",
        'tokenUnfreeze': "await client.tokens.unfreeze({ contractId, tokenPosition, identityToUnfreeze, unfreezerId, privateKeyWif, publicNote })",
        'tokenDestroyFrozen': "await client.tokens.destroyFrozen({ contractId, tokenPosition, identityId: frozenIdentityId, destroyerId, privateKeyWif, publicNote })",
        'tokenSetPriceForDirectPurchase': "await client.tokens.setPriceForDirectPurchase({ contractId, tokenPosition, identityId, priceType, priceData, privateKeyWif, publicNote })",
        'tokenDirectPurchase': "await client.tokens.directPurchase({ contractId, tokenPosition, amount, identityId, totalAgreedPrice, privateKeyWif })",
        'tokenClaim': "await client.tokens.claim({ contractId, tokenPosition, distributionType, identityId, privateKeyWif, publicNote })",
        'tokenConfigUpdate': "await client.tokens.configUpdate({ contractId, tokenPosition, configItemType, configValue, identityId, privateKeyWif, publicNote })",
        # Voting
        'dpnsUsername': "await client.voting.masternodeVote({ masternodeProTxHash, contractId, documentTypeName, indexName, indexValues, voteChoice, votingKeyWif })",
        'masternodeVote': "await client.voting.masternodeVote({ masternodeProTxHash, contractId, documentTypeName, indexName, indexValues, voteChoice, votingKeyWif })",
    }
    return m.get(key)


def render_params(params: list[dict]):
    if not params:
        return '<p class="param-optional">No parameters</p>'
    lines = []
    for p in params:
        name = p.get('name', 'param')
        typ = p.get('type', 'text')
        req = 'required' if p.get('required', False) else 'optional'
        label = p.get('label', name)
        lines.append(f'<div class="param"><code>{name}</code> <em>({typ}, {req})</em> — {label}</div>')
    return '\n'.join(lines)


def generate_docs_html(query_defs: dict, transition_defs: dict) -> str:
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    css = """
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; display: flex; }
.sidebar { width: 280px; background-color: white; box-shadow: 2px 0 4px rgba(0,0,0,0.1); position: fixed; height: 100vh; overflow-y: auto; padding: 20px; }
.sidebar h2 { font-size: 1.2em; margin-bottom: 10px; color: #2c3e50; }
.sidebar ul { list-style: none; padding: 0; margin: 0 0 20px 0; }
.sidebar li { margin-bottom: 5px; }
.content { margin-left: 320px; padding: 30px; max-width: 1100px; }
.category { margin: 15px 0; padding: 10px 14px; background: #fff; border-left: 3px solid #3498db; color: #34495e; font-weight: 600; }
.operation { background: #fff; margin: 16px 0; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 18px; }
.parameters { background: #f9fafb; padding: 12px; border-radius: 4px; }
.example { background: #0b1021; color: #d6e1ff; padding: 12px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9em; }
.description { color: #4a5568; }
.param { color: #475569; padding: 2px 0; }
.section-title { margin-top: 30px; }
    """

    # Sidebar
    sb_queries = []
    for cat_key, cat in query_defs.items():
        entries = []
        for item_key, item in cat.get('queries', {}).items():
            if evo_example_for_query(item_key, item.get('inputs', [])):
                entries.append((item_key, item))
        if not entries:
            continue
        sb_queries.append(f'<li class="category">{cat.get("label", cat_key)}</li>')
        for item_key, item in entries:
            sb_queries.append(f'<li style="margin-left: 14px;"><a href="#q-{item_key}">{item.get("label", item_key)}</a></li>')

    sb_transitions = []
    for cat_key, cat in transition_defs.items():
        entries = []
        for item_key, item in cat.get('transitions', {}).items():
            if evo_example_for_transition(item_key):
                entries.append((item_key, item))
        if not entries:
            continue
        sb_transitions.append(f'<li class="category">{cat.get("label", cat_key)}</li>')
        for item_key, item in entries:
            sb_transitions.append(f'<li style="margin-left: 14px;"><a href="#t-{item_key}">{item.get("label", item_key)}</a></li>')

    # Content: queries
    q_html = []
    for cat_key, cat in query_defs.items():
        entries = []
        for item_key, item in cat.get('queries', {}).items():
            ex = evo_example_for_query(item_key, item.get('inputs', []))
            if ex:
                entries.append((item_key, item, ex))
        if not entries:
            continue
        q_html.append(f'<div class="category">{cat.get("label", cat_key)}</div>')
        for item_key, item, ex in entries:
            params = item.get('inputs', [])
            q_html.append(
                f"""
<div class=\"operation\">\n  <h3 id=\"q-{item_key}\">{item.get('label', item_key)}</h3>\n  <p class=\"description\">{item.get('description','')}</p>\n  <div class=\"parameters\">{render_params(params)}</div>\n  <div class=\"example\">// Evo SDK example\\nconst client = EvoSDK.testnetTrusted();\\nawait client.connect();\\n{ex}</div>\n</div>\n"""
            )

    # Content: transitions
    t_html = []
    for cat_key, cat in transition_defs.items():
        entries = []
        for item_key, item in cat.get('transitions', {}).items():
            ex = evo_example_for_transition(item_key)
            if ex:
                entries.append((item_key, item, ex))
        if not entries:
            continue
        t_html.append(f'<div class="category">{cat.get("label", cat_key)}</div>')
        for item_key, item, ex in entries:
            params = item.get('sdk_params', []) or item.get('inputs', [])
            t_html.append(
                f"""
<div class=\"operation\">\n  <h3 id=\"t-{item_key}\">{item.get('label', item_key)}</h3>\n  <p class=\"description\">{item.get('description','')}</p>\n  <div class=\"parameters\">{render_params(params)}</div>\n  <div class=\"example\">// Evo SDK example (requires keys/funding)\\nconst client = EvoSDK.testnetTrusted();\\nawait client.connect();\\n{ex}</div>\n</div>\n"""
            )

    html = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>Dash Platform Evo JS SDK Documentation</title>
  <link rel=\"icon\" type=\"image/svg+xml\" href=\"https://media.dash.org/wp-content/uploads/blue-d.svg\" />
  <link rel=\"alternate icon\" type=\"image/png\" href=\"https://media.dash.org/wp-content/uploads/blue-d-250.png\" />
  <style>{css}</style>
</head>
<body>
  <div class=\"sidebar\">
    <h2>Evo SDK Docs</h2>
    <div style=\"font-size:12px;color:#6b7280;margin:4px 0 12px\">Generated: {now}</div>
    <div class=\"section-header\">Queries</div>
    <ul>{''.join(sb_queries)}</ul>
    <div class=\"section-header\">State Transitions</div>
    <ul>{''.join(sb_transitions)}</ul>
  </div>
  <div class=\"content\">
    <h1>Dash Platform Evo JS SDK</h1>
    <p>This documentation is generated from API definitions and shows EvoSDK usage examples.</p>
    <h2 class=\"section-title\">Queries</h2>
    {''.join(q_html)}
    <h2 class=\"section-title\">State Transitions</h2>
    <p class=\"description\">State transitions require valid identities and private keys on the selected network. Examples below show method usage.</p>
    {''.join(t_html)}
  </div>
  <script type=\"module\">import {{ EvoSDK }} from '../dist/evo-sdk.module.js'; window.EvoSDK = EvoSDK;</script>
</body>
</html>
"""
    return html


def generate_ai_reference_md(query_defs: dict, transition_defs: dict) -> str:
    lines = [
        '# Evo SDK API Reference (Generated)',
        '',
        'This file is generated from api-definitions.json and shows available queries and state transitions.',
        '',
        '## Queries',
    ]
    for cat_key, cat in query_defs.items():
        entries = []
        for item_key, item in cat.get('queries', {}).items():
            if evo_example_for_query(item_key, item.get('inputs', [])):
                entries.append((item_key, item))
        if not entries:
            continue
        lines.append(f"### {cat.get('label', cat_key)}")
        for item_key, item in entries:
            lines.append(f"- {item.get('label', item_key)} (`{item_key}`): {item.get('description','')}")
    lines.append('')
    lines.append('## State Transitions')
    for cat_key, cat in transition_defs.items():
        entries = []
        for item_key, item in cat.get('transitions', {}).items():
            if evo_example_for_transition(item_key):
                entries.append((item_key, item))
        if not entries:
            continue
        lines.append(f"### {cat.get('label', cat_key)}")
        for item_key, item in entries:
            lines.append(f"- {item.get('label', item_key)} (`{item_key}`): {item.get('description','')}")
    return '\n'.join(lines) + '\n'


def main():
    # Require colocated api-definitions.json (no fallbacks)
    api_file = ROOT / 'api-definitions.json'
    if not api_file.exists():
        raise SystemExit(f'api-definitions.json not found at {api_file}')

    queries, transitions = load_api_definitions(api_file)

    docs_html = generate_docs_html(queries, transitions)
    (ROOT / 'docs.html').write_text(docs_html, encoding='utf-8')

    ai_md = generate_ai_reference_md(queries, transitions)
    (ROOT / 'AI_REFERENCE.md').write_text(ai_md, encoding='utf-8')

    manifest = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'source_api': 'api-definitions.json',
        'files': ['docs.html', 'AI_REFERENCE.md']
    }
    import json as _json
    (ROOT / 'docs_manifest.json').write_text(_json.dumps(manifest, indent=2), encoding='utf-8')
    print('Generated: docs.html, AI_REFERENCE.md, docs_manifest.json')


if __name__ == '__main__':
    main()
