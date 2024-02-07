import { useLiveQuery } from 'electric-sql/react';
import { Link, Redirect, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { List, Text, FAB, Appbar } from 'react-native-paper';

import { useAuthenticatedUser } from '../../../../components/AuthProvider';
import { useElectric } from '../../../../components/ElectricProvider';
import FlatListSeparator from '../../../../components/FlatListSeparator';
import LoadingView from '../../../../components/LoadingView';
import MemberCard from '../../../../components/MemberCard';

export default function Family() {
  const { family_id } = useLocalSearchParams<{ family_id?: string }>();
  if (!family_id) return <Redirect href="/families" />;

  const userId = useAuthenticatedUser()!;
  const { db } = useElectric()!;
  const { results: memberships } = useLiveQuery(
    db.member.liveMany({
      include: {
        family: {
          select: {
            creator_user_id: true,
            name: true,
          },
        },
      },
      where: {
        family_id,
      },
    }),
  );

  const onRemoved = useCallback(
    (memberId: string) =>
      db.member.delete({
        where: { member_id: memberId },
      }),
    [],
  );

  if (!memberships) return <LoadingView />;
  const membership = memberships.find((m) => m.user_id === userId);
  const otherMembers = memberships.filter((m) => m.user_id !== userId);
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: membership.family.name,
          headerRight: () => (
            <Link href={`family/${family_id}/edit`} asChild>
              <Appbar.Action icon="pencil" />
            </Link>
          ),
        }}
      />
      <List.Section>
        <List.Subheader>Profile</List.Subheader>
        <View style={{ padding: 6 }}>
          <MemberCard membership={membership} onRemoved={onRemoved} editable />
        </View>

        <List.Subheader>Members</List.Subheader>
        {otherMembers.length > 0 ? (
          <FlatList
            contentContainerStyle={{ padding: 6 }}
            data={otherMembers}
            renderItem={(item) => <MemberCard membership={item.item} onRemoved={onRemoved} />}
            keyExtractor={(item) => item.member_id}
            ItemSeparatorComponent={() => <FlatListSeparator />}
          />
        ) : (
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text variant="bodyLarge">No other members in this family</Text>
          </View>
        )}
      </List.Section>

      <Link
        style={{
          position: 'absolute',
          marginBottom: 16,
          right: 0,
          bottom: 0,
        }}
        href={`family/${family_id}/invite`}
        asChild>
        <FAB icon="account-plus" label="Invite" />
      </Link>
    </View>
  );
}
