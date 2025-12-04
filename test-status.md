# E2E queries status (latest run)

Command: `PLAYWRIGHT_BASE_URL=http://localhost:8081 ./node_modules/.bin/playwright test tests/e2e/queries/query-execution.spec.js --reporter=list`

Server: `python3 -m http.server 8081 -d public` (local)

## Error strings observed
- `Error: Cannot read properties of undefined (reading 'length')` – majority of failures (dataContracts getMany/history, documents getDocuments/getDocument, identity getIdentityKeys, voting/group/DPNS, some epoch ranges).
- `Error: context provider error: invalid quorum: Quorum not found in cache for hash: 000000a8dc1d1228030e9d7972f4420a6128861eaa21e7c774252809b54e4fa0` – e.g., document with proof, some token proof, finalized epoch infos proof.
- `Error: Invalid identity ID: byte length not 32 bytes error: Identifier must be 32 bytes long from bytes` – contestedResourceVotersForIdentity (proof), DPNS getDpnsUsernames (sometimes), getVotePollsByEndDate (proof).
- `Error: Invalid contract ID: byte length not 32 bytes error: Identifier must be 32 bytes long from bytes` – contestedResourceIdentityVotes (proof), some group queries.
- ``Error: transport error: grpc error: status: 'Unknown error', self: "transport error", metadata: {"content-type": "application/grpc-web+proto"}`` – system getTotalCreditsInPlatform (no proof).

## Passing highlights
- getDataContract (with/without proof) passes.
- Many system/epoch/token queries without proof now pass; votePollsByEndDate with proof also passes.

## Likely next steps
- Fix UI param mapping causing `undefined.length` (documentTypeName vs documentType, array handling) in `public/app.js`.
- Investigate identity/contract IDs used in contested/group/DPNS cases.
- Consider skipping proof or refreshing quorums for endpoints hitting “invalid quorum” errors.
