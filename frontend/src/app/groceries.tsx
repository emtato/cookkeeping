import {
    Animated,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View
} from 'react-native';

import {ThemedText} from '@/components/themed-text';
import {BottomTabInset, Colours, Fonts, Spacing} from '@/constants/theme'
import {useColorScheme as useColourScheme} from 'react-native';
import GroceryCategory from "@/components/grocery-category";
import {GroceryItem} from "@/types/groceryItem";
import {useCallback, useEffect, useState} from "react";
import {
    addGroceryItem,
    AddGroceryItemRequest,
    UpdateGroceryItemRequest,
    deleteGroceryItem,
    updateGroceryItem,
    getGroceries
} from "@/api/backendApi";
import {Alert} from 'react-native';
import {SymbolView} from 'expo-symbols';

export default function TabTwoScreen() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'dark' ? 'dark' : 'light'];
    const [addIsOpen, setAddIsOpen] = useState(false);
    const [addIsClosing, setAddIsClosing] = useState(false);
    const [popupProgress] = useState(() => new Animated.Value(0));  //controls darkness and popup height
    const {height} = useWindowDimensions();
    const sheetOffset = popupProgress.interpolate({inputRange: [0, 1], outputRange: [height, 0]});
    const [itemName, setitemName] = useState('');
    const [itemCategory, setitemCategory] = useState('');
    const [itemNote, setitemNote] = useState(''); //unused for now
    const [itemId, setitemId] = useState<number | null>(null);
    const [manualQuantity, setManualQuantity] = useState(0);
    const [unit, setUnit] = useState('');
    const [checked, setChecked] = useState(false); //this checked state is not modified during checking, only a flag to store updateItem's checked status
    const [needDate, setNeedDate] = useState<string[]>([]);

    const [items, setGroceryItems] = useState<GroceryItem[]>([
        {id: 1, name: 'one egg', checked: false, category: 'eggs', subtext: 'dish a, b c'},
        {id: 2, name: 'another egg', checked: false, category: 'eggs', subtext: 'dish e,a,b'},
        {id: 3, name: 'one last egg', checked: false, category: 'eggs', subtext: 'as'},
        {id: 4, name: 'turnip', checked: false, category: 'eggs', subtext: 'maitytun'},
        {id: 5, name: 'em', checked: false, category: 'emma', subtext: 'ss'},
        {id: 6, name: 'ma', checked: false, category: 'emma', subtext: ' adad'},
        {id: 7, name: 'bagle', checked: false, category: 'other food', subtext: 'asdasdv'},
        {id: 8, name: 'chip', checked: false, category: 'other food', subtext: 'dfdfdf'},
        {id: 9, name: 'espurr', checked: false, category: 'are you sure this is edible?', subtext: 'creaturee....'}
    ]); //change to actual list from backend later

    /* ———————————————— logic stuff & polling ———————————————————————————*/
    const categories = new Set<string>(); //find all grocery categories for map later
    for (const item of items) {
        const category = item.category.toLowerCase();
        const displayName = category.charAt(0).toUpperCase() + category.slice(1);
        categories.add(displayName);
    }
    const groceryCategories = [...categories];
    const canSaveItem = itemName.trim().length > 0 && itemCategory.trim().length > 0; //check to verifyvalidity of item save attempt

    let boughtCount = 0;
    for (let item of items) {
        if (item.checked) boughtCount++;
    }
    const remainingCount = items.length - boughtCount;
    let progress = 0;
    if (items.length > 0) progress = (boughtCount / items.length) * 100;

    function animatePopup(toValue: number) {
        return Animated.timing(popupProgress, {
            toValue,
            duration: 220,
            useNativeDriver: Platform.OS !== 'web',
        });
    }

    function resetAddItem() {
        setAddIsOpen(false);
        setAddIsClosing(false);
        setitemName('');
        setitemCategory('');
        setitemNote('');
        setitemId(null);
        setManualQuantity(0);
        setUnit('');
        setChecked(false);
        setNeedDate([]);
    }

    function closeAddItem() {
        if (addIsClosing) return;
        setAddIsClosing(true);
        animatePopup(0).start(({finished}) => {
            if (finished) resetAddItem();
        });
    }

    function updateExistingItem(item: GroceryItem) {
        const manualIndex = item.needMealIDs?.findIndex(id => id === null) ?? -1;
        const manualNeedDate = manualIndex >= 0 ? item.needDate?.[manualIndex] : null;

        setitemName(item.name);
        setitemCategory(item.category);
        setitemNote(item.note ?? '');
        setitemId(item.id);
        setManualQuantity(manualIndex >= 0 ? item.quantity?.[manualIndex] ?? 0 : 0);
        setUnit(item.unit ?? '');
        setChecked(item.checked);
        setNeedDate(manualNeedDate != null ? [manualNeedDate] : []);
        setAddIsOpen(true);
    }

    const getAndSetGroceryItems = useCallback(async () => { //keeps the same function between renders rather than creating a new one each time,
        // otherwise this dependency in the below use Effect would restart the effect after each fetch updates state.
        // TODO: Handle a failed refresh and keep the current grocery list in state.
        const items: GroceryItem[] = await getGroceries();
        setGroceryItems(items);
    }, []);

    useEffect(() => {
        getAndSetGroceryItems();
        const timer = setInterval(getAndSetGroceryItems, 30_000);
        return () => clearInterval(timer);
    }, [getAndSetGroceryItems]);

    /* ——————————————————————————————————————— grocery list modification functions ——————————————————————————————————————————————*/
    // Flag a negative user-added amount immediately and send only that amount for update.

    /* The API functions also still ignore unsuccessful HTTP responses, so the screens cannot tell a rejected save from a successful one*/
    async function groceryItemCheckeded(item: GroceryItem) {
        const nextChecked = !item.checked;
        item.checked = nextChecked;

        const checkedItem: UpdateGroceryItemRequest = {
            id: item.id,
            name: item.name,
            manualQuantity: null, //sned null when unchanged since this is only for checked item
            checked: item.checked,
            category: item.category,
            unit: item.unit ?? null,
            note: item.note ?? null
        }
        await updateGroceryItem(checkedItem)
        await getAndSetGroceryItems();
    }

    //TODO: swipe left to delete grocery item (need cofnrim)
    async function saveNewItem() {
        if (addIsClosing) return;
        const name = itemName.trim();
        const category = itemCategory.trim().toLowerCase();
        if (!name || !category) return; //warn user  (add more mandatory fields maybe)
        // TODO: Close the form only after the backend confirms the add succeeded.
        closeAddItem();
        const newItem: AddGroceryItemRequest = {
            name: name,
            quantity: [manualQuantity],
            unit: unit,
            category: category,
            note: itemNote,
            checked: false,
            needDate: needDate // TODO: ecentually decide if adding means also adding date or assuming its for next grocery trip (likely)
        }
        await addGroceryItem(newItem)
        //read response? to insert into the displayed items. or just getAndSetGroceryItems and display new list
        await getAndSetGroceryItems();
    }

    async function updateItem() {
        const name = itemName.trim();
        const category = itemCategory.trim().toLowerCase();
        if (!name || !category) return; //warn user  (add more mandatory fields maybe)
        const newItem: UpdateGroceryItemRequest = {
            id: itemId!!, //were sure id exists since this functio is only attainable when exsiting item pressed
            name: name,
            manualQuantity: manualQuantity,
            unit: unit,
            category: category,
            note: itemNote,
            checked: checked,
            //no needate since update request only changes manual fields
        }
        await updateGroceryItem(newItem);
        await getAndSetGroceryItems();
    }

    async function deleteItem(selectedItems: GroceryItem[]) {
        const newItems = items.filter(item => !selectedItems.includes(item)); //temp thing, retrieve from db future
        setGroceryItems(newItems);
        await deleteGroceryItem(selectedItems.map(item => item.id))
        await getAndSetGroceryItems();
    }


    //TODO: maybe: divider and below it, next week's list ?
    //TODO: items marked as checked are cleared after 1 hour or manually press "clear all bought" button

    return <>
        {/* Grocery list: header, progress, and categories */}
        <ScrollView style={{backgroundColor: colours.background}} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                {/* Title and list actions */}
                <View style={styles.titleRow}>
                    <ThemedText type="title" style={styles.title}>This week</ThemedText>
                    <Pressable onPress={() => { //delete items + only display
                        const checkedItems = items.filter(item => item.checked);
                        if (checkedItems.length > 0) {
                            Alert.alert(checkedItems.length > 1 ? 'Delete items?' : 'Delete item?', 'This cannot be undone.', [
                                {text: 'nononono', style: 'cancel'},
                                {text: 'byebye!', style: 'destructive', onPress: () => deleteItem(checkedItems)}
                            ])
                        } else {
                            Alert.alert('No items selected', 'Select items to delete.', [
                                {text: 'Okay :>', style: 'cancel'}
                            ])
                        }
                    }} style={({pressed}) => [
                        styles.deleteButton, {backgroundColor: colours.backgroundcontainer}, pressed && styles.pressed]}
                               accessibilityRole="button" accessibilityLabel="Delete checked items">
                        <SymbolView name="trash" tintColor={'#aa4444'} size={22}/>
                    </Pressable>
                    <Pressable onPress={() => setAddIsOpen(true)}
                               style={({pressed}) => [
                                   styles.addButton, {backgroundColor: colours.greenhighlight}, pressed && styles.pressed]}>
                        <ThemedText style={[styles.addButtonText, {color: colours.background}]}>Add item</ThemedText>
                    </Pressable>
                </View>
                {/* Bought and remaining counts, followed by the progress bar */}
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
            {/* Grocery items grouped by category */}
            {/* TODO: Normalize category names the same way for headings and filtering so mixed-case items stay visible. */}
            <View style={styles.categories}>
                {groceryCategories.map((category, index) =>
                    <GroceryCategory key={index} sectionTitle={groceryCategories[index]}
                                     sectionItems={items.filter(item => item.category.charAt(0).toUpperCase() + item.category.slice(1) == groceryCategories[index])}
                                     itemChecked={groceryItemCheckeded} itemPressed={updateExistingItem}/>
                )}
            </View>
        </ScrollView>
        {/* popup */}
        {addIsOpen && (
            <Modal transparent onRequestClose={closeAddItem} onShow={() => {
                if (!addIsClosing) {
                    const animation = animatePopup(1); //get animationobject
                    animation.start(); // start aniamtion
                }
            }}>
                <KeyboardAvoidingView behavior="padding" style={styles.modalRoot}
                                      pointerEvents={addIsClosing ? 'none' : 'auto'}>
                    <Animated.View style={[styles.backdrop, {opacity: popupProgress}]} pointerEvents="none"/>
                    <Pressable style={StyleSheet.absoluteFill} onPress={closeAddItem}/>
                    <Animated.View style={[styles.popup, {
                        transform: [{translateY: sheetOffset}],
                        backgroundColor: colours.background,
                        borderColor: colours.greenhighlightSecondary,
                    }]}>
                        <View style={[styles.sheetHandle, {backgroundColor: colours.greenhighlightSecondary}]}/>
                        {/* Popup heading and cancel action */}
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

                        {/* Scrollable popup fields */}
                        <ScrollView style={styles.formScroll} contentContainerStyle={styles.form}
                                    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            {/* Item name and category */}
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>item name</ThemedText>
                                <TextInput value={itemName} onChangeText={setitemName} placeholder="e.g. egg"
                                           placeholderTextColor={colours.textSecondary}
                                           style={[styles.input, {
                                               backgroundColor: colours.backgroundcontainer,
                                               color: colours.text,
                                           }]}/>
                            </View>
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>category</ThemedText>
                                <TextInput value={itemCategory} onChangeText={setitemCategory}
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
                                            <Pressable key={category} onPress={() => setitemCategory(category)}
                                                       style={[styles.categoryChoice, {
                                                           backgroundColor: itemCategory.toLowerCase() === category.toLowerCase() ?
                                                               colours.greenhighlightSecondary : //highlight item on press
                                                               colours.backgroundcontainer
                                                       }]}>
                                                <ThemedText
                                                    style={styles.categoryChoiceText}>{category}</ThemedText>
                                            </Pressable>
                                        )}
                                    </ScrollView>}
                            </View>
                            {/* Editable amount and unit */}
                            <View style={styles.fieldRow}>
                                <View style={[styles.field, styles.halfField]}>
                                    <ThemedText style={styles.fieldLabel}>amount</ThemedText>
                                    {/* TODO: Validate the amount as a nonnegative whole number before sending it. The numeric keyboard still allows invalid pasted text. */}
                                    <TextInput value={String(manualQuantity)}
                                               onChangeText={(text) => setManualQuantity(Number(text))}
                                               inputMode="numeric" placeholder="0"
                                               placeholderTextColor={colours.textSecondary}
                                               style={[styles.input, {
                                                   backgroundColor: colours.backgroundcontainer,
                                                   color: colours.text,
                                               }]}/>
                                </View>
                                <View style={[styles.field, styles.halfField]}>
                                    <ThemedText style={styles.fieldLabel}>unit</ThemedText>
                                    {/* TODO: Connect onChangeText to unit state. */}
                                    <TextInput value={unit} onChangeText={setUnit}
                                               placeholder="g, ml, items"
                                               autoCapitalize="none"
                                               accessibilityLabel="Unit"
                                               placeholderTextColor={colours.textSecondary}
                                               style={[styles.input, {
                                                   backgroundColor: colours.backgroundcontainer,
                                                   color: colours.text,
                                               }]}/>
                                </View>
                            </View>
                            {/* Read-only meal plan amount and total quantity */}
                            <View style={styles.fieldRowTwo}>
                                <View style={[styles.field, styles.halfField]}>
                                    <ThemedText style={styles.fieldLabel}>amount from meal plan</ThemedText>
                                    {/* TODO: Display the quantity required by planned meals here. */}
                                    <View style={[styles.input, styles.readOnlyInput, {
                                        backgroundColor: colours.background,
                                    }]}>
                                        <ThemedText style={{color: colours.textSecondary}}>—</ThemedText>
                                    </View>

                                </View>
                                <View style={[styles.field, styles.halfField]}>
                                    <ThemedText style={styles.fieldLabel}>total quantity (read-only)</ThemedText>
                                    {/* TODO: Display the planned meal amount plus the manual amount here. */}
                                    <View style={[styles.input, styles.readOnlyInput, {
                                        backgroundColor: colours.background,
                                    }]}>
                                        <ThemedText style={{color: colours.textSecondary}}>—</ThemedText>
                                    </View>
                                </View>
                            </View>
                            {/* Optional item note */}
                            <View style={styles.field}>
                                <ThemedText style={styles.fieldLabel}>note (optional)</ThemedText>
                                <TextInput value={itemNote} onChangeText={setitemNote}
                                           placeholder="Quantity, recipe, or reminder"
                                           placeholderTextColor={colours.textSecondary}
                                           style={[styles.input, {
                                               backgroundColor: colours.backgroundcontainer,
                                               color: colours.text,
                                           }]}/>
                            </View>
                        </ScrollView>

                        {/* Save action */}
                        <Pressable onPress={itemId != null ? updateItem : saveNewItem} disabled={!canSaveItem}
                                   style={({pressed}) => [
                                       styles.saveButton,
                                       {backgroundColor: canSaveItem ? colours.greenhighlight : colours.backgroundcontainer},
                                       pressed && styles.pressed]}>
                            <ThemedText style={[styles.saveText, {
                                color: canSaveItem ? colours.background : colours.textSecondary,
                            }]}>Save item</ThemedText>
                        </Pressable>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        )}
    </>

}

const styles = StyleSheet.create({
    // Screen layout
    content: {
        width: '100%',
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.five,
        paddingBottom: BottomTabInset + Spacing.eight,
    },

    // Header: title and list actions
    header: {
        marginBottom: Spacing.six,
        marginTop: Spacing.ten
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
    deleteButton: {
        width: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Spacing.three,
        marginRight: -Spacing.seven,
    },
    pressed: {
        opacity: 0.75,
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

    // Header: grocery progress
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

    // Grocery categories
    categories: {
        gap: Spacing.three,
        marginTop: -Spacing.two
    },

    // Popup: overlay and sheet
    modalRoot: {
        flex: 1,
        justifyContent: 'flex-end',
        display: 'flex',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        flex: 1,
        flexDirection: 'column'
    },
    popup: {
        width: '100%',
        maxHeight: '85%',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        borderWidth: 1,
        paddingHorizontal: Spacing.five,
        paddingTop: Spacing.two,
        paddingBottom: Spacing.four
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.five,
    },

    // Popup: heading and cancel action
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

    // Popup: form containers and shared fields
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
        marginLeft: Spacing.two,
        marginBottom: -Spacing.one,
    },
    input: {
        width: '100%',
        minWidth: 0,
        minHeight: 50,
        borderRadius: 14,
        paddingHorizontal: Spacing.four,
        fontSize: 16,
    },

    // Popup: category choices
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

    // Popup: amount and unit row
    fieldRow: {
        flexDirection: 'row',
        gap: Spacing.three,
        marginBottom: -Spacing.three,
    },
    halfField: {
        flex: 1, //equal share of space, ratio of 1:1 since each one gets this style
        flexBasis: 0,
        minWidth: 0,
        width: 0,
    },

    // Popup: meal plan amount and total row
    fieldRowTwo: {
        marginTop: Spacing.three,
        flexDirection: 'row',
        gap: Spacing.three,
        marginBottom: -Spacing.three,
    },
    readOnlyInput: {
        justifyContent: 'center',
        marginTop: -Spacing.two,
    },

    // Popup: save action
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
