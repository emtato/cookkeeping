import {ThemedText} from "@/components/themed-text";
import {Pressable, View} from "react-native";
import {Button} from "@expo/ui";
import {useColorScheme as useColourScheme} from 'react-native';
import {Colours} from "@/constants/theme";
import {SymbolView} from "expo-symbols";
import {GroceryItem} from "@/types/groceryItem"

interface GroceryCategoryProps {
    sectionTitle: string,
    sectionItems: GroceryItem[],
    itemChecked: (item: string) => void
}

export default function GroceryCategory({sectionTitle, sectionItems, itemChecked}: GroceryCategoryProps) {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    return <>
        <ThemedText type="subtitle" style={{marginLeft: 5}}>{sectionTitle}</ThemedText>
        {sectionItems.map((item, index) => (
            <View key={`${item}-${index}`} style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Pressable style={{marginLeft: 10}}>
                    {item.checked &&
                        <SymbolView name="checkmark.circle.fill" tintColor={colours.greenhighlight}></SymbolView>}
                    {!item.checked && <SymbolView name="circle" tintColor={colours.greenhighlight}></SymbolView>}
                </Pressable>
                <ThemedText>{item.name}</ThemedText>
            </View>
        ))}
    </>
}
