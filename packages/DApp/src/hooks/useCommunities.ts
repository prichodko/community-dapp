import { getCommunityDetails } from '../helpers/apiMock'
import { useCommunitiesProvider } from '../providers/communities/provider'
import { useWakuFeature } from '../providers/wakuFeature/provider'
import { BigNumber } from 'ethers'
import { CommunityDetail } from '../models/community'
import { useEffect, useState } from 'react'
import { useContractCalls } from '@usedapp/core'
import { useContracts } from './useContracts'
import { RequestClient, deserializePublicKey } from '@status-im/js'
import { useWaku } from '../providers/waku/provider'

export function useCommunities(publicKeys: string[]) {
  const { waku } = useWaku()

  const { communitiesDetails, dispatch } = useCommunitiesProvider()
  const { featureVotes } = useWakuFeature()
  const { votingContract } = useContracts()

  const votingHistory =
    useContractCalls(
      publicKeys.map((publicKey) => {
        return {
          abi: votingContract.interface,
          address: votingContract.address,
          method: 'getVotingHistory',
          args: [publicKey],
        }
      })
    ) ?? []

  console.log('useCommunities > votingHistory:', votingHistory)

  const [returnCommunities, setReturnCommunities] = useState<(CommunityDetail | undefined)[]>([])

  useEffect(() => {
    // if (!waku) {
    //   return
    // }

    // 0xadfcf42e083e71d8c755da07a2b1bad754d7ca97c35fbd407da6bde9844580ad55

    // note: new instance also means new RequestClient.wakuMessages, or cleared "cache"
    // const requestClient = new RequestClient(waku)

    // for (const votingRoom of votingHistory) {
    //   const deserializedPublicKeys = publicKeys.map((publicKey) => deserializePublicKey(publicKey))
    //   const communityDescription=   await requestClient.fetchCommunityDescription(deserializedPublicKeys)

    // }

    publicKeys.forEach((publicKey, idx) => {
      if (publicKey && votingHistory[idx]) {
        const setCommunity = async () => {
          const communityDetail = await getCommunityDetails(publicKey)
          if (communityDetail) {
            const communityHistory = votingHistory[idx]?.[0]
            if (communityHistory && communityHistory.length > 0) {
              const votingHistory = communityHistory.map((room: any) => {
                const endAt = new Date(room.endAt.toNumber() * 1000)
                return {
                  ID: room.roomNumber.toNumber(),
                  type: room.voteType === 1 ? 'Add' : 'Remove',
                  result:
                    endAt > new Date()
                      ? 'Ongoing'
                      : room.totalVotesFor.gt(room.totalVotesAgainst)
                      ? 'Passed'
                      : 'Failed',
                  date: endAt,
                }
              })
              dispatch({ ...communityDetail, votingHistory })
            } else {
              dispatch({ ...communityDetail, votingHistory: [] })
            }
          }
        }
        setCommunity()
      }
    })
  }, [JSON.stringify(publicKeys), votingHistory])

  useEffect(() => {
    setReturnCommunities(
      publicKeys.map((publicKey) => {
        const detail = communitiesDetails[publicKey]
        if (detail) {
          if (featureVotes[publicKey]) {
            return { ...detail, featureVotes: featureVotes[publicKey].sum }
          } else {
            return { ...detail, featureVotes: BigNumber.from(0) }
          }
        } else {
          return undefined
        }
      })
    )
  }, [communitiesDetails, featureVotes, JSON.stringify(publicKeys)])

  return returnCommunities
}
