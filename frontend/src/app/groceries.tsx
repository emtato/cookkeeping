import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {BottomTabInset, Colours, Fonts, Spacing} from '@/constants/theme'
import {useColorScheme as useColourScheme} from 'react-native';
import GroceryCategory from "@/components/grocery-category";
import {GroceryItem} from "@/types/groceryItem";
import {useState} from "react";

export default function TabTwoScreen() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [items, setGroceryItems] = useState<GroceryItem[]>([
        {id: '1', name: 'one egg', checked: false, category: 'eggs', subtext: 'dish a, b c'},
        {id: '2', name: 'another egg', checked: false, category: 'eggs', subtext: 'dish e,a,b'},
        {id: '3', name: 'one last egg', checked: false, category: 'eggs', subtext: 'as'},
        {id: '3.5', name: 'turnip', checked: false, category: 'eggs', subtext: 'maitytun'},
        {id: '4', name: 'em', checked: false, category: 'emma', subtext: 'ss'},
        {id: '5', name: 'ma', checked: false, category: 'emma', subtext: ' adad'},
        {id: '6', name: 'bagle', checked: false, category: 'other food', subtext: 'asdasdv'},
        {id: '7', name: 'chip', checked: false, category: 'other food', subtext: 'dfdfdf'},
        {id: '8', name: 'espurr', checked: false, category: 'are you sure this is edible?', subtext: 'creaturee....'}
    ]); //change to actual list from backend later
    const categories = new Set<string>(); //find all grocery categories for map later
    for (const item of items) {
        const category = item.category.toLowerCase();
        const displayName = category.charAt(0).toUpperCase() + category.slice(1);
        categories.add(displayName);
    }
    const groceryCategories = [...categories];

    let boughtCount = 0;
    for (let item of items) {
        if (item.checked) boughtCount++;
    }
    const remainingCount = items.length - boughtCount;
    let progress = 0;
    if (items.length > 0) progress = (boughtCount / items.length) * 100;

    function groceryItemCheckeded(item: GroceryItem) {
        let newList: GroceryItem[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].id == item.id) {
                items[i].checked = !items[i].checked;
            }
            newList.push(items[i]);
        }
        setGroceryItems(newList);
    }

    //TODO: grocery item subtext indicating what dishes/daysuse it.
    //TODO: maybe: divider and below it, next week's list ?
    //TODO: items marked as checked are cleared after 1 hour or manually press "clear all bought" button

    return <ScrollView style={{backgroundColor: colours.background}} contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <View style={styles.titleRow}>
                <ThemedText type="title" style={styles.title}>This week</ThemedText>
                <Pressable onPress={() => setAddIsOpen(!addIsOpen)}
                           style={({pressed}) => [
                               styles.addButton, {backgroundColor: colours.greenhighlight}, pressed && styles.pressed]}>
                    <ThemedText style={[styles.addButtonText, {color: colours.background}]}>Add item</ThemedText>
                </Pressable>
            </View>
            <View style={styles.progress}>
                <ThemedText style={[styles.remainingText, {color: colours.greenhighlight}]}>
                    {remainingCount === 0 && items.length > 0 ? 'All picked up' : `${remainingCount} left to pick up`}
                </ThemedText>
                <ThemedText style={[styles.boughtText, {color: colours.textSecondary}]}>
                    {boughtCount} of {items.length} bought
                </ThemedText>
            </View>
            <View style={[styles.progressTrack, {backgroundColor: colours.backgroundcontainer}]}>
                <View style={[styles.progressFill, {
                    backgroundColor: colours.greenhighlight,
                    width: `${progress}%` as `${number}%`
                }]}/>
            </View>
        </View>
        <View style={styles.categories}>
            {groceryCategories.map((category, index) =>
                <GroceryCategory key={index} sectionTitle={groceryCategories[index]}
                                 sectionItems={items.filter(item => item.category.charAt(0).toUpperCase() + item.category.slice(1) == groceryCategories[index])}
                                 itemChecked={groceryItemCheckeded}/>
            )}
        </View>
        {addIsOpen && <View> /* TODO */

        </View>}
    </ScrollView>

}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.five,
        paddingBottom: BottomTabInset + Spacing.eight,
    },
    header: {
        marginBottom: Spacing.six,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.three,
        marginBottom: Spacing.four,
    },
    title: {
        fontFamily: Fonts.serif,
        fontSize: 36,
        lineHeight: 44,
        fontWeight: '500',
        flexShrink: 1,
    },
    addButton: {
        width: '30%',
        minHeight: 44,
        paddingHorizontal: Spacing.two,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Spacing.three,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.75,
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.two,
        marginBottom: Spacing.two,
    },
    remainingText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
    },
    boughtText: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
    },
    progressTrack: {
        height: 7,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    categories: {
        gap: Spacing.three,
        marginTop: -Spacing.two
    },
});
