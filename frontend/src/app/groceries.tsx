import {Image} from 'expo-image';
import {SymbolView} from 'expo-symbols';
import {Platform, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ExternalLink} from '@/components/external-link';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {Collapsible} from '@/components/ui/collapsible';
import {BottomTabInset, MaxContentWidth, Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';
import {Colours} from '@/constants/theme'
import {useColorScheme as useColourScheme} from 'react-native';
import GroceryCategory from "@/components/grocery-category";
import {GroceryItem} from "@/types/groceryItem";
import {useState} from "react";

export default function TabTwoScreen() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    const [items, setGroceryItems] = useState<GroceryItem[]>([
        {id: '1', name: 'one egg', checked: false, category: 'eggs', subtext: 'dish a, b c'},
        {id: '2', name: 'another egg', checked: false, category: 'eggs', subtext: 'dish e,a,b'},
        {id: '3', name: 'one last egg', checked: false, category: 'eggs', subtext: 'as'},
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

    return <ScrollView style={{backgroundColor: colours.background}}>
        <View style={{marginTop: 50}}>
            {groceryCategories.map((category, index) =>
                <GroceryCategory key={index} sectionTitle={groceryCategories[index]}
                                 sectionItems={items.filter(item => item.category.charAt(0).toUpperCase() + item.category.slice(1) == groceryCategories[index])}
                                 itemChecked={groceryItemCheckeded}/>
            )}

        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        maxWidth: MaxContentWidth,
        flexGrow: 1,
    },
    titleContainer: {
        gap: Spacing.three,
        alignItems: 'center',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.six,
    },
    centerText: {
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
    linkButton: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.two,
        borderRadius: Spacing.five,
        justifyContent: 'center',
        gap: Spacing.one,
        alignItems: 'center',
    },
    sectionsWrapper: {
        gap: Spacing.five,
        paddingHorizontal: Spacing.four,
        paddingTop: Spacing.three,
    },
    collapsibleContent: {
        alignItems: 'center',
    },
    imageTutorial: {
        width: '100%',
        aspectRatio: 296 / 171,
        borderRadius: Spacing.three,
        marginTop: Spacing.two,
    },
    imageReact: {
        width: 100,
        height: 100,
        alignSelf: 'center',
    },
});
