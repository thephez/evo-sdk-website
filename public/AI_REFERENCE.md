# Evo SDK API Reference (Generated)

This file is generated from api-definitions.json and shows available queries and state transitions.

## Queries
### Identity Queries
- Get Identity (`getIdentity`): Fetch an identity by its identifier
- Get Identity Keys (`getIdentityKeys`): Retrieve keys associated with an identity
- Get Identity Nonce (`getIdentityNonce`): Get the current nonce for an identity
- Get Identity Contract Nonce (`getIdentityContractNonce`): Get the nonce for an identity in relation to a specific contract
- Get Identity Balance (`getIdentityBalance`): Get the credit balance of an identity
- Get Identities Balances (`getIdentitiesBalances`): Get balances for multiple identities
- Get Identity Balance and Revision (`getIdentityBalanceAndRevision`): Get both balance and revision number for an identity
- Get Identity by Unique Public Key Hash (`getIdentityByPublicKeyHash`): Find an identity by its unique public key hash
- Get Identity by Non-Unique Public Key Hash (`getIdentityByNonUniquePublicKeyHash`): Find identities by non-unique public key hash
- Get Identity Token Balances (`getIdentityTokenBalances`): Get token balances for an identity
- Get Identities Token Balances (`getIdentitiesTokenBalances`): Get token balance for multiple identities
- Get Identity Token Info (`getIdentityTokenInfos`): Get token information for an identity's tokens
- Get Identities Token Info (`getIdentitiesTokenInfos`): Get token information for multiple identities with a specific token
### Data Contract Queries
- Get Data Contract (`getDataContract`): Fetch a data contract by its identifier
- Get Data Contract History (`getDataContractHistory`): Get the version history of a data contract
- Get Data Contracts (`getDataContracts`): Fetch multiple data contracts by their identifiers
### Document Queries
- Get Documents (`getDocuments`): Query documents from a data contract
- Get Document (`getDocument`): Fetch a specific document by ID
### DPNS Queries
- Get DPNS Usernames (`getDpnsUsername`): Get DPNS usernames for an identity
- DPNS Check Availability (`dpnsCheckAvailability`): Check if a DPNS username is available
- DPNS Resolve Name (`dpnsResolve`): Resolve a DPNS name to an identity ID
### Voting & Contested Resources
- Get Contested Resources (`getContestedResources`): Get list of contested resources
- Get Contested Resource Vote State (`getContestedResourceVoteState`): Get the current vote state for a contested resource
- Get Contested Resource Voters for Identity (`getContestedResourceVotersForIdentity`): Get voters who voted for a specific identity in a contested resource
- Get Contested Resource Identity Votes (`getContestedResourceIdentityVotes`): Get all votes cast by a specific identity
- Get Vote Polls by End Date (`getVotePollsByEndDate`): Get vote polls within a time range
### Protocol & Version
- Get Protocol Version Upgrade State (`getProtocolVersionUpgradeState`): Get the current state of protocol version upgrades
- Get Protocol Version Upgrade Vote Status (`getProtocolVersionUpgradeVoteStatus`): Get voting status for protocol version upgrades
### Epoch & Block
- Get Epochs Info (`getEpochsInfo`): Get information about epochs
- Get Current Epoch (`getCurrentEpoch`): Get information about the current epoch
- Get Finalized Epoch Info (`getFinalizedEpochInfos`): Get information about finalized epochs
- Get Evonodes Proposed Epoch Blocks by IDs (`getEvonodesProposedEpochBlocksByIds`): Get proposed blocks by evonode IDs
- Get Evonodes Proposed Epoch Blocks by Range (`getEvonodesProposedEpochBlocksByRange`): Get proposed blocks by range
### Token Queries
- Get Token Statuses (`getTokenStatuses`): Get token statuses
- Get Token Direct Purchase Prices (`getTokenDirectPurchasePrices`): Get direct purchase prices for tokens
- Get Token Contract Info (`getTokenContractInfo`): Get information about a token contract
- Get Token Perpetual Distribution Last Claim (`getTokenPerpetualDistributionLastClaim`): Get last claim information for perpetual distribution
- Get Token Total Supply (`getTokenTotalSupply`): Get total supply of a token
### Group Queries
- Get Group Info (`getGroupInfo`): Get information about a group
- Get Group Infos (`getGroupInfos`): Get information about multiple groups
- Get Group Actions (`getGroupActions`): Get actions for a group
- Get Group Action Signers (`getGroupActionSigners`): Get signers for a group action
### System & Utility
- Get Status (`getStatus`): Get system status
- Get Current Quorums Info (`getCurrentQuorumsInfo`): Get information about current quorums
- Get Prefunded Specialized Balance (`getPrefundedSpecializedBalance`): Get prefunded specialized balance
- Get Total Credits in Platform (`getTotalCreditsInPlatform`): Get total credits in the platform
- Get Path Elements (`getPathElements`): Access any data in the Dash Platform state tree. This low-level query allows direct access to GroveDB storage by specifying a path through the tree structure and keys to retrieve at that path. Common paths include: Identities (32), Tokens (96), DataContractDocuments (64), Balances (16), Votes (80), and more.
- Wait for State Transition Result (`waitForStateTransitionResult`): Internal query to wait for and retrieve the result of a previously submitted state transition

## State Transitions
### Identity Transitions
- Identity Create (`identityCreate`): Create a new identity with initial credits
- Identity Top Up (`identityTopUp`): Add credits to an existing identity
- Identity Update (`identityUpdate`): Update identity keys (add or disable)
- Identity Credit Transfer (`identityCreditTransfer`): Transfer credits between identities
- Identity Credit Withdrawal (`identityCreditWithdrawal`): Withdraw credits from identity to Dash address
### Document Transitions
- Document Create (`documentCreate`): Create a new document
- Document Replace (`documentReplace`): Replace an existing document
- Document Delete (`documentDelete`): Delete an existing document
- Document Transfer (`documentTransfer`): Transfer document ownership
- Document Purchase (`documentPurchase`): Purchase a document
- Document Set Price (`documentSetPrice`): Set or update document price
### Token Transitions
- Token Burn (`tokenBurn`): Burn tokens
- Token Mint (`tokenMint`): Mint new tokens
- Token Claim (`tokenClaim`): Claim tokens from a distribution
- Token Set Price (`tokenSetPriceForDirectPurchase`): Set or update the price for direct token purchases
- Token Direct Purchase (`tokenDirectPurchase`): Purchase tokens directly at the configured price
- Token Config Update (`tokenConfigUpdate`): Update token configuration settings
- Token Transfer (`tokenTransfer`): Transfer tokens between identities
- Token Freeze (`tokenFreeze`): Freeze tokens for a specific identity
- Token Unfreeze (`tokenUnfreeze`): Unfreeze tokens for a specific identity
- Token Destroy Frozen (`tokenDestroyFrozen`): Destroy frozen tokens
### Voting Transitions
- DPNS Username (`dpnsUsername`): Cast a vote for a contested DPNS username
- Contested Resource (`masternodeVote`): Cast a vote for contested resources as a masternode
