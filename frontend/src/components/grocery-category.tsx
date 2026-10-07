import {ThemedText} from "@/components/themed-text";
import {Pressable, StyleSheet, View} from "react-native";
import {useColorScheme as useColourScheme} from 'react-native';
import {Colours, Spacing} from "@/constants/theme";
import {SymbolView} from "expo-symbols";
import {GroceryItem} from "@/types/groceryItem"

interface GroceryCategoryProps {
    sectionTitle: string,
    sectionItems: GroceryItem[],
    itemChecked: (item: GroceryItem) => void
}

export default function GroceryCategory({sectionTitle, sectionItems, itemChecked}: GroceryCategoryProps) {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    return <View style={[styles.category, {backgroundColor: colours.backgroundcontainer}]}>
        <View style={styles.heading}>
            <View style={[styles.headingAccent, {backgroundColor: colours.brownhighlight}]}/>
            <ThemedText style={styles.headingText}>{sectionTitle}</ThemedText>
            <View style={[styles.count, {backgroundColor: colours.background}]}>
                <ThemedText style={[styles.countText, {color: colours.greenhighlight}]}>
                    {sectionItems.length}
                </ThemedText>
            </View>
        </View>
        {sectionItems.map((item, index) => (
            <Pressable key={item.id} onPress={() => itemChecked(item)}
                       style={({pressed}) => [
                           styles.itemRow, //always apply this style
                           {borderTopColor: colours.background}, //always aplpy background colour
                           index > 0 && styles.divider, // add top divider if not first one
                           pressed && styles.pressed]}>
                <SymbolView name={item.checked ? 'checkmark.circle.fill' : 'circle' /*TODO btw this doesnt work on desktop */}
                            tintColor={colours.greenhighlight} size={28} style={styles.checkbox}/>
                <View style={styles.itemText}>
                    <ThemedText style={[
                        styles.itemName,
                        item.checked && { //apply checked rule (change colour + strikethrough)
                            color: colours.textSecondary, textDecorationLine: 'line-through'
                        }]}>{item.name}</ThemedText>
                    {item.subtext && <ThemedText style={[styles.itemSubtext, {color: colours.textSecondary}]}>
                        {item.subtext}
                    </ThemedText>}
                </View>
            </Pressable>
        ))}
    </View>
}

const styles = StyleSheet.create({
    category: {
        borderRadius: 20,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.two,
        paddingBottom: Spacing.half,
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two,
    },
    headingAccent: {
        width: 3,
        height: 20,
        borderRadius: 2,
    },
    headingText: {
        flex: 1,
        minWidth: 0,
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600',
    },
    count: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        paddingHorizontal: Spacing.two,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '700',
    },
    itemRow: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.three,
        paddingVertical: Spacing.two,
    },
    divider: {
        borderTopWidth: 1,
    },
    checkbox: {
        width: 28,
        height: 28,
    },
    itemText: {
        flex: 1,
        minWidth: 0,
    },
    itemName: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '600',
    },
    itemSubtext: {
        fontSize: 12,
        lineHeight: 17,
    },
    pressed: {
        opacity: 0.7,
    },
});
