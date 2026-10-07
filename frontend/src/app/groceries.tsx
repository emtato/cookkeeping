import {KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, TextInput, View} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {BottomTabInset, Colours, Fonts, Spacing} from '@/constants/theme'
import {useColorScheme as useColourScheme} from 'react-native';
import GroceryCategory from "@/components/grocery-category";
import {GroceryItem} from "@/types/groceryItem";
import {useState} from "react";
import {addGroceryItem, AddGroceryItemRequest} from "@/api/backendApi";

export default function TabTwoScreen() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemNote, setNewItemNote] = useState(''); //unused for now
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
    const canSaveItem = newItemName.trim().length > 0 && newItemCategory.trim().length > 0; //check to verifyvalidity of item save attempt

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

    function closeAddItem() {
        setAddIsOpen(false); // add item view doesnt work for desktop: TODO, need hover state (cursor pointer) and add item view itself
        setNewItemName('');
        setNewItemCategory('');
        setNewItemNote('');
    }
        //TODO: swipe left to delete grocery item (cofnrim)
    async function saveNewItem() {
        const name = newItemName.trim();
        const category = newItemCategory.trim().toLowerCase();
        if (!name || !category) return;

        setGroceryItems(previousItems => [...previousItems, {
            id: String(Date.now()),
            name,
            checked: false,
            category,
            subtext: newItemNote.trim()
        }]);
        closeAddItem();
        const newItem: AddGroceryItemRequest = {
            name: name,
            quantity: null, // TODO
            unit: null,  // TODO
            category: category,
            note: null,  // TODO
            checked: false
        }
        await addGroceryItem(newItem)
        //read response?
    }

    //TODO: maybe: divider and below it, next week's list ?
    //TODO: items marked as checked are cleared after 1 hour or manually press "clear all bought" button

    return <>
        <ScrollView style={{backgroundColor: colours.background}} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <ThemedText type="title" style={styles.title}>This week</ThemedText>
                    <Pressable onPress={() => setAddIsOpen(true)}
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
        </ScrollView>
        {/* popup*/}
        {addIsOpen &&
            <Modal transparent animationType="slide" onRequestClose={closeAddItem}>
                <KeyboardAvoidingView behavior="padding" style={styles.modalRoot}>
                    <Pressable style={styles.backdrop} onPress={closeAddItem}/>
                    <View style={[styles.popup, {
                        backgroundColor: colours.background,
                        borderColor: colours.greenhighlightSecondary,
                    }]}>
                        <View style={[styles.sheetHandle, {backgroundColor: colours.greenhighlightSecondary}]}/>
                        <View style={styles.popupHeader}>
                            <View style={styles.popupHeading}>
                                <ThemedText style={styles.popupTitle}>Add an item</ThemedText>
                            </View>
                            <Pressable onPress={closeAddItem} style={styles.cancelButton}>
                                <ThemedText style={[styles.cancelText, {color: colours.greenhighlight}]}>
                                    Cancel
                                </ThemedText>
                            </Pressable>
                        </View>

                        <ScrollView style={styles.formScroll} contentContainerStyle={styles.form}
                                    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>ITEM NAME</ThemedText>
                                <TextInput value={newItemName} onChangeText={setNewItemName} placeholder="e.g. egg"
                                           placeholderTextColor={colours.textSecondary}
                                           style={[styles.input, {
                                               backgroundColor: colours.backgroundcontainer,
                                               color: colours.text,
                                           }]}/>
                            </View>
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>CATEGORY</ThemedText>
                                <TextInput value={newItemCategory} onChangeText={setNewItemCategory}
                                           placeholder="e.g. 🐱🥚ory" placeholderTextColor={colours.textSecondary}
                                           autoCapitalize="words"
                                           style={[styles.input, {
                                               backgroundColor: colours.backgroundcontainer,
                                               color: colours.text,
                                           }]}/>
                                {groceryCategories.length > 0 &&
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                                keyboardShouldPersistTaps="handled"
                                                contentContainerStyle={styles.categoryChoices}>
                                        {groceryCategories.map(category =>
                                            <Pressable key={category} onPress={() => setNewItemCategory(category)}
                                                       style={[styles.categoryChoice, {
                                                           backgroundColor: newItemCategory.toLowerCase() === category.toLowerCase() ?
                                                               colours.greenhighlightSecondary : //highlight item on press
                                                               colours.backgroundcontainer
                                                       }]}>
                                                <ThemedText style={styles.categoryChoiceText}>{category}</ThemedText>
                                            </Pressable>
                                        )}
                                    </ScrollView>}
                            </View>
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>NOTE (OPTIONAL)</ThemedText>
                                <TextInput value={newItemNote} onChangeText={setNewItemNote}
                                           placeholder="Quantity, recipe, or reminder"
                                           placeholderTextColor={colours.textSecondary}
                                           style={[styles.input, {
                                               backgroundColor: colours.backgroundcontainer,
                                               color: colours.text,
                                           }]}/>
                            </View>
                        </ScrollView>

                        <Pressable onPress={saveNewItem} disabled={!canSaveItem}
                                   style={({pressed}) => [
                                       styles.saveButton,
                                       {backgroundColor: canSaveItem ? colours.greenhighlight : colours.backgroundcontainer},
                                       pressed && styles.pressed]}>
                            <ThemedText style={[styles.saveText, {
                                color: canSaveItem ? colours.background : colours.textSecondary,
                            }]}>Save item</ThemedText>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>}
    </>

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

    //popup thingy
    modalRoot: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    popup: {
        width: '100%',
        maxHeight: '160%',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        borderWidth: 1,
        paddingBottom: 480,
        marginBottom: -460,
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.two,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.five,
    },
    popupHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: Spacing.three,
        marginBottom: Spacing.five,
    },
    popupHeading: {
        flex: 1,
    },
    popupTitle: {
        fontFamily: Fonts.serif,
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '500',
    },
    cancelButton: {
        minHeight: 44,
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
    },
    formScroll: {
        flexShrink: 1,
    },
    form: {
        gap: Spacing.four,
        paddingBottom: Spacing.five,
    },
    field: {
        gap: Spacing.two,
    },
    fieldLabel: {
        fontSize: 11,
        lineHeight: 16,
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    input: {
        minHeight: 50,
        borderRadius: 14,
        paddingHorizontal: Spacing.four,
        fontSize: 16,
    },
    categoryChoices: {
        gap: Spacing.two,
        paddingTop: Spacing.half,
    },
    categoryChoice: {
        minHeight: 36,
        borderRadius: 12,
        paddingHorizontal: Spacing.three,
        justifyContent: 'center',
    },
    categoryChoiceText: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
    },
    saveButton: {
        minHeight: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
    },
});
