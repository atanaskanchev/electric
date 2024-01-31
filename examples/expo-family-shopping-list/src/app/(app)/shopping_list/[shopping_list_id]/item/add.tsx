import React from 'react'
import { View } from 'react-native'
import ShoppingListItemEditor, { ShoppingListItemProperties } from '../../../../../components/ShoppingListItemEditor'
import { useElectric } from '../../../../../components/ElectricProvider'
import { genUUID } from 'electric-sql/util'
import { Redirect, router, useLocalSearchParams } from 'expo-router'

export default function AddShoppingListItem () {
  const { shopping_list_id } = useLocalSearchParams<{ shopping_list_id?: string }>()
  if (!shopping_list_id) return <Redirect href="/"/>

  const { db } = useElectric()!
  const onCreate = async (props: ShoppingListItemProperties) => {
    if (!props?.name) return;
    await db.shopping_list_item.create({
      data: {
        item_id: genUUID(),
        list_id: shopping_list_id,
        name: props!.name,
        quantity: props?.quantity ?? 1,
        comment: props?.comment,
        updated_at: new Date(),
        added_at: new Date(),
        completed: false,
      }
    })
    router.back()
  }

  return (
    <View>
      <ShoppingListItemEditor
        onSubmit={onCreate}
        submitText="Add item"  
      />
    </View>
  )
}