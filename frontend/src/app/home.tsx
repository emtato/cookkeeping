import {Link} from 'expo-router';
import {SymbolView} from 'expo-symbols';
import {Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ThemedText} from '@/components/themed-text';
import {BottomTabInset, Colours, Fonts, MaxContentWidth, Spacing} from '@/constants/theme';
import {useTheme} from '@/hooks/use-theme';
import {useState} from "react";
import {Meal} from "@/types/meal";
import {GroceryItem} from "@/types/groceryItem";

export default function HomeScreen() {
    const colours = useTheme();

    const now = new Date();
    const name = "Emilia" // later connect to logged in state + main stuff
    const hours = now.getHours();
    let greeting: string = 'Go to sleep';
    if (hours >= 6 && hours < 12) {
        greeting = 'Good morning';
    } else if (hours >= 12 && hours < 17) {
        greeting = 'Good afternoon';
    } else if (hours >= 17 || hours < 2) {// 5 pm to midnight and midnight to 1:59 am
        greeting = 'Good evening';
    }
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    //TODO:  stylw w more fonts

    const testMeals: Meal[] = [{
        "id": 3, name: "hi", description: 'desc', ingredients: ['ing'], steps: ['step1', 'step2']
    }, {
        "id": 2, name: "asee", description: 'dedededede', ingredients: ['bebebebeb'], steps: ['see', 'bee'],
    }]
    const [meals, setMeals] = useState<Meal[]>(testMeals);

    const testshoppingList: GroceryItem[] = [
        {id: '1', name: 'one egg', checked: false, category: 'eggs', subtext: 'dish a, b c'},
        {id: '2', name: 'another egg', checked: false, category: 'eggs', subtext: 'dish e,a,b'},
        {id: '3', name: 'one last egg', checked: false, category: 'eggs', subtext: 'as'},
        {id: '4', name: 'em', checked: false, category: 'emma', subtext: 'ss'},
        {id: '5', name: 'ma', checked: false, category: 'emma', subtext: ' adad'},
        {id: '6', name: 'bagle', checked: false, category: 'other food', subtext: 'asdasdv'},
        {id: '7', name: 'chip', checked: false, category: 'other food', subtext: 'dfdfdf'}]
    const [items, setGroceryItems] = useState<GroceryItem[]>(testshoppingList);

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, {backgroundColor: colours.background}]}>
            <ScrollView contentContainerStyle={styles.home_container} showsVerticalScrollIndicator={false}>
                <View style={styles.section_1}>
                    <View style={styles.date_row}>
                        <View style={[styles.date_accent, {backgroundColor: colours.greenhighlight}]}/>
                        <ThemedText themeColour="textSecondary" style={styles.date}>{formattedDate}</ThemedText>
                    </View>
                    <ThemedText type="title" style={styles.greeting}>
                        {greeting}, <Text style={{color: colours.greenhighlight, fontStyle: 'italic'}}>{name}!</Text>
                    </ThemedText>
                </View>
                <View style={styles.section_2}>
                    <ThemedText type="subtitle" style={styles.section_title}>Up next</ThemedText>

                    {/* swap starting state with the next planned meals when meals != undef */}
                    {meals == undefined &&
                        <View style={[styles.next_meal, {backgroundColor: colours.backgroundcontainer}]}>
                            <View style={[styles.meal_icon, {backgroundColor: colours.background}]}>
                                <SymbolView name={{ios: 'fork.knife', android: 'restaurant', web: 'restaurant'}}
                                            tintColor={colours.greenhighlight} size={28}/>
                            </View>
                            <ThemedText style={styles.meal_title}>Your next meal?</ThemedText>
                            <ThemedText themeColour="textSecondary" style={styles.meal_description}>
                                Pick something you love and give it a spot in your plan.
                            </ThemedText>
                            <Link href="/plan" asChild>
                                <Pressable>{({pressed}) => <View style={[styles.plan_button,
                                    {backgroundColor: Colours.green}, pressed && styles.pressed]}>
                                    <ThemedText style={styles.button_text}>Plan a meal</ThemedText>
                                    <SymbolView
                                        name={{ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward'}}
                                        tintColor={Colours.white} size={18}/>
                                </View>}
                                </Pressable>
                            </Link>
                        </View>}
                    {meals != undefined && <View>
                        {/* add meal display !*/}


                    </View>}
                </View>
                <View style={styles.section_3}>
                    <ThemedText type="subtitle" style={styles.section_title}>The rest of your week</ThemedText>

                    {/* swap with data when done as well */}
                    {items == undefined && <Link href="/groceries" asChild>
                        <Pressable>{({pressed}) => <View style={[styles.overview_card,
                            {backgroundColor: colours.backgroundcontainer}, pressed && styles.pressed]}>
                            <View style={styles.card_heading}>
                                <View style={[styles.preview_icon, {backgroundColor: colours.background}]}>
                                    <SymbolView
                                        name={{ios: 'basket', android: 'shopping_basket', web: 'shopping_basket'}}
                                        tintColor={colours.greenhighlight} size={21}/>
                                </View>
                                <ThemedText style={styles.card_title}>Groceries</ThemedText>
                                <SymbolView
                                    name={{ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right'}}
                                    tintColor={colours.textSecondary} size={18}/>
                            </View>
                            <ThemedText themeColour="textSecondary" style={styles.card_description}>
                                Everything to pick up, in one place. Check off your list as you shop.
                            </ThemedText>
                            <ThemedText style={[styles.card_action, {color: colours.greenhighlight}]}>View grocery
                                list</ThemedText>
                        </View>}
                        </Pressable>
                    </Link>}
                    {items != undefined && <View>
                        {/* same here*/}

                    </View>}
                    {(meals == undefined || meals.length < 3) && <Link href="/plan" asChild>
                        <Pressable>{({pressed}) => <View style={[styles.overview_card,
                            {backgroundColor: colours.backgroundcontainer}, pressed && styles.pressed]}>
                            <View style={styles.card_heading}>
                                <View style={[styles.preview_icon, {backgroundColor: colours.background}]}>
                                    <SymbolView
                                        name={{ios: 'calendar', android: 'calendar_month', web: 'calendar_month'}}
                                        tintColor={colours.brownhighlight} size={21}/>
                                </View>
                                <ThemedText style={styles.card_title}>Later this week</ThemedText>
                                <SymbolView
                                    name={{ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right'}}
                                    tintColor={colours.textSecondary} size={18}/>
                            </View>
                            <ThemedText themeColour="textSecondary" style={styles.card_description}>
                                A little planning makes the week easier. Make room for your favourite meals.
                            </ThemedText>
                            <ThemedText style={[styles.card_action, {color: colours.greenhighlight}]}>Open meal
                                plan</ThemedText>
                        </View>}
                        </Pressable>
                    </Link>}
                    {meals.length > 2 && <View>


                    </View>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

        screen: {
            flex: 1,
        },
        home_container: {
            width: '100%',
            maxWidth: MaxContentWidth,
            alignSelf: 'center',
            paddingHorizontal: Spacing.five,
            paddingTop: Platform.OS === 'web' ? Spacing.twenty : Spacing.five,
            paddingBottom: BottomTabInset + Spacing.eight,
        },

        // Welcome
        section_1: {
            gap: Spacing.two,
            marginBottom: Spacing.eight,
        },
        date_row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.two,
        },
        date_accent: {
            width: Spacing.four,
            height: 2,
            borderRadius: 1,
        },
        date: {
            fontSize: 13,
            lineHeight: 20,
            fontWeight: '600',
            letterSpacing: 0.7,
        },
        greeting: {
            fontFamily: Fonts.serif,
            fontSize: 36,
            lineHeight: 44,
            fontWeight: '500',
        },

        // Up next
        section_2: {
            gap: Spacing.three,
        },
        section_title: {
            fontSize: 18,
            lineHeight: 26,
            fontWeight: '600',
        },
        next_meal: {
            borderRadius: 24,
            padding: Spacing.six,
            alignItems: 'flex-start',
        },
        meal_icon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.four,
        },
        meal_title: {
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '600',
        },
        meal_description: {
            marginTop: Spacing.two,
            maxWidth: 420,
            fontSize: 15,
            lineHeight: 23,
        },
        plan_button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.three,
            marginTop: Spacing.five,
            paddingVertical: Spacing.three,
            paddingHorizontal: Spacing.four,
            minHeight: 48,
            borderRadius: 16,
        },
        pressed: {
            opacity: 0.75,
            transform: [{scale: 0.99}],
        },
        button_text: {
            color: Colours.white,
            fontSize: 15,
            lineHeight: 22,
            fontWeight: '600',
        },

        // The rest of your week
        section_3: {
            marginTop: Spacing.seven,
            gap: Spacing.three,
        },
        overview_card: {
            borderRadius: 22,
            padding: Spacing.five,
            gap: Spacing.three,
        },
        card_heading: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.three,
        },
        preview_icon: {
            width: 40,
            height: 40,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
        },
        card_title: {
            flex: 1,
            fontSize: 18,
            lineHeight: 26,
            fontWeight: '600',
        },
        card_description: {
            fontSize: 14,
            lineHeight: 22,
            maxWidth: 460,
        },
        card_action: {
            fontSize: 14,
            lineHeight: 22,
            fontWeight: '600',
        },
    })
;
