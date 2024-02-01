import React from 'react'
import { View, FlatList } from 'react-native'
import { List, Text, IconButton } from 'react-native-paper'
import { useElectric } from '../../../../components/ElectricProvider'
import { useLiveQuery } from 'electric-sql/react'
import { Link, Redirect, Stack, useLocalSearchParams } from 'expo-router'
import MemberCard from '../../../../components/MemberCard'
import { Member } from '../../../../generated/client'
import FlatListSeparator from '../../../../components/FlatListSeparator'
import { useAuthenticatedUser } from '../../../../components/AuthProvider'

export default function Family () {
  const { family_id } = useLocalSearchParams<{ family_id?: string }>()
  if (!family_id) return <Redirect href="/families" />

  const userId = useAuthenticatedUser()!
  const { db } = useElectric()!
  const { results: family } = useLiveQuery(db.family.liveUnique({
    include: {
      member: {
        select: {
          member_id: true,
          user_id: true,
        }
      }
    },
    where: {
      family_id: family_id
    }
  }))
  if (!family || !family.member) return null
  const memberships = family.member as Member[]
  const membership = memberships.find((m) => m.user_id === userId)!
  const otherMembers = memberships.filter((m) => m.user_id !== userId)
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: family.name,
          headerRight: () => (
            <Link href={`family/${family_id}/edit`} asChild>
              <IconButton size={20} icon="pencil" />
            </Link>
          )
        }}
      />
      <List.Section>
        <List.Subheader>Profile</List.Subheader>
        <MemberCard memberId={membership.member_id} editable />

        <List.Subheader>Members</List.Subheader>
        { otherMembers.length > 0 ?
          <FlatList
            style={{ padding: 6 }}
            data={otherMembers}
            renderItem={(item) => <MemberCard memberId={item.item.member_id} />}
            keyExtractor={(item) => item.member_id}
            ItemSeparatorComponent={() => <FlatListSeparator />}
          />
          :
          <View style={{ flexDirection:'column', alignItems: 'center' }}>
            <Text variant="bodyLarge">No other members in this family</Text>
          </View>
        }
        
      </List.Section>
    </View>
  )
}
