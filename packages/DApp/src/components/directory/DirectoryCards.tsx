import React, { useState } from 'react'
import { Card, CardCommunityWrap, CardVoteWrap } from '../Card'
import { CardCommunity } from '../card/CardCommunity'
import { CardFeature } from '../card/CardFeature'
import styled from 'styled-components'
import { CommunityDetail, DirectorySortingEnum } from '../../models/community'
import { FilterList } from '../Filter'
import { Search } from '../Input'
import { PageBar } from '../PageBar'
import { DirectorySortingOptions } from '../../constants/SortingOptions'
import { Colors } from '../../constants/styles'
import { WeeklyFeature } from '../WeeklyFeature'
import { DirectoryCardSkeleton } from './DirectoryCardSkeleton'
import { useDirectoryCommunities } from '../../hooks/useDirectoryCommunities'
import { useContracts } from '../../hooks/useContracts'
import { useContractCall } from '@usedapp/core'
import { votingFromRoom } from '../../helpers/voting'

interface DirectoryCardProps {
  community: CommunityDetail
}

function DirectoryCard({ community }: DirectoryCardProps) {
  if (!community.directoryInfo) {
    return <div />
  }
  let timeLeft: string | undefined = undefined
  if (community.directoryInfo.untilNextFeature) {
    timeLeft = `${community.directoryInfo.untilNextFeature / (3600 * 24 * 7)} weeks left`
  }

  const { votingContract } = useContracts()
  let votingRoom = useContractCall({
    abi: votingContract.interface,
    address: votingContract.address,
    method: 'getCommunityVoting',
    args: [community.publicKey],
  }) as any

  if (votingRoom && (votingRoom.roomNumber.toNumber() === 0 || votingRoom.finalized == true)) {
    votingRoom = undefined
  }

  let currentVoting
  if (votingRoom) {
    currentVoting = votingFromRoom(votingRoom)
  }

  return (
    <Card>
      <CardCommunityWrap>
        &nbsp;
        <CardCommunity community={community} showRemoveButton={true} currentVoting={currentVoting} />
      </CardCommunityWrap>
      <CardVoteWrap style={{ backgroundColor: `${Colors.GrayLight}` }}>
        <CardFeature
          community={community}
          heading={timeLeft ? 'This community has to wait until it can be featured again' : 'Weekly Feature vote'}
          icon={timeLeft ? '⏳' : '⭐'}
          sum={community.directoryInfo.featureVotes?.toNumber()}
          timeLeft={timeLeft}
          currentVoting={currentVoting}
          room={votingRoom}
        />
      </CardVoteWrap>
    </Card>
  )
}

export function DirectoryCards() {
  const [filterKeyword, setFilterKeyword] = useState('')
  const [sortedBy, setSortedBy] = useState(DirectorySortingEnum.IncludedRecently)
  const communities = useDirectoryCommunities(filterKeyword, sortedBy)

  return (
    <>
      <PageBar>
        <Search
          type="text"
          placeholder="Search communities..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.currentTarget.value)}
        />
        <FilterList value={sortedBy} setValue={setSortedBy} options={DirectorySortingOptions} />
      </PageBar>
      <WeeklyFeature endDate={new Date('07/26/2021')} />
      <Voting>
        {communities.map((community) => (
          <DirectoryCard key={community.publicKey} community={community} />
        ))}
        {communities.length === 0 && <DirectoryCardSkeleton />}
      </Voting>
    </>
  )
}

const Voting = styled.div`
  display: flex;
  flex-direction: column;
`
