import {Link} from 'expo-router';
import {Image} from 'expo-image';
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

    const testMeals: Meal[] = [
        {
            id: 3,
            name: 'Tomato basil pasta',
            description: 'Garlicky tomato sauce, fresh basil and parmesan tossed with rigatoni.',
            ingredients: ['Rigatoni', 'Cherry tomatoes', 'Garlic', 'Fresh basil', 'Parmesan', 'Olive oil'],
            steps: ['Cook the pasta until just tender.', 'Simmer the tomatoes and garlic in olive oil.',
                'Toss everything together and finish with basil and parmesan.'],
            dateMeal: 'Dinner on Wednesday',
            image: 'https://pokestop.io/img/pokemon/duosion-256x256.png',
        },
        {
            id: 2,
            name: 'Lemony chickpea couscous',
            description: '',
            ingredients: ['Chickpeas', 'Couscous', 'Spinach', 'Lemon', 'Plain yogurt', 'Cumin'],
            steps: ['Prepare the couscous with hot stock.', 'Warm the chickpeas with cumin and fold in the spinach.',
                'Serve with lemon yogurt.'],
            dateMeal: 'Lunch on Thursday',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfiYB6Ml7HidF2uhaxeXtuQAxLhTDSJzyS9kiylX2JNw&s=10',
        },
        {
            id: 4,
            name: 'Roasted beet & yogurt bowls',
            description: 'Tender roasted beets with herbed yogurt, toasted walnuts and greens.',
            ingredients: ['Beets', 'Plain yogurt', 'Walnuts', 'Mixed greens', 'Dill', 'Lemon'],
            steps: ['Roast the beets until tender.', 'Mix yogurt with dill and lemon.',
                'Layer the beets over greens and top with yogurt and walnuts.'],
            dateMeal: 'Dinner on Friday',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Z8sm6ISVoIg6eetvaanMqqWATc4KU9WmspeQH1vHww&s=10',
        },
        {
            id: 5,
            name: 'Ginger chicken noodle soup',
            description: 'A cosy bowl of chicken, noodles and greens in a ginger broth.',
            ingredients: ['Chicken breast', 'Noodles', 'Ginger', 'Carrots', 'Baby spinach', 'Chicken stock'],
            steps: ['Simmer ginger and carrots in the stock.', 'Cook the chicken and noodles in the broth.',
                'Add spinach just before serving.'],
            dateMeal: 'Breakfast on Saturday',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg3HAxP31Aex5A7ac6Mcu0Kz5NhKlpA0ThDsOOraDQBg&s',
        },
    ]
    const [meals, setMeals] = useState<Meal[]>(testMeals); //make sure is empty list if no meals
    const laterMeals = meals.slice(2, 4); //maybe change to include more

    const testshoppingList: GroceryItem[] = [
        {id: '1', name: 'one egg', checked: true, category: 'eggs', subtext: 'dish a, b c'},
        {id: '2', name: 'another egg', checked: false, category: 'eggs', subtext: 'dish e,a,b'},
        {id: '3', name: 'one last egg', checked: false, category: 'eggs', subtext: 'as'},
        {id: '4', name: 'em', checked: true, category: 'emma', subtext: 'ss'},
        {id: '5', name: 'ma', checked: false, category: 'emma', subtext: ' adad'},
        {id: '6', name: 'bagle', checked: true, category: 'other food', subtext: 'asdasdv'},
        {id: '7', name: 'chip', checked: false, category: 'other food', subtext: 'dfdfdf'}]
    const [items, setGroceryItems] = useState<GroceryItem[]>(testshoppingList); //make sure is empty list if no meals
    const remainingItems = items.filter(item => !item.checked);
    const boughtCount = items.length - remainingItems.length;
    const previewItems = remainingItems.slice(0, 4);
    const hiddenCount = remainingItems.length - previewItems.length;
    const progress = items.length === 0 ? 0 : (boughtCount / items.length) * 100;

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, {backgroundColor: colours.background}]}>
            <ScrollView contentContainerStyle={styles.home_container} showsVerticalScrollIndicator={false}>
                <View style={styles.section_1}>
                    <View style={styles.date_row}>
                        <View style={[styles.date_accent, {backgroundColor: colours.greenhighlight}]}/>
                        <ThemedText themeColour="textSecondary" style={styles.date}>{formattedDate}</ThemedText>
                    </View>
                    <View style={styles.welcome_row}>
                        <ThemedText type="title" style={styles.greeting}>
                            {greeting}, <Text
                            style={{color: colours.greenhighlight, fontStyle: 'italic'}}>{name}!</Text>
                        </ThemedText>
                        {/* TODO: link to import flow */}
                        <Link href="/recipes" asChild>
                            <Pressable>{({pressed}) =>
                                <View style={[styles.import_button,
                                    {backgroundColor: colours.greenhighlight}, pressed && styles.pressed]}>
                                    <SymbolView name={{ios: 'plus', android: 'add', web: 'add'}}
                                                tintColor={colours.background} size={24}/>
                                </View>}
                            </Pressable>
                        </Link>
                    </View>
                </View>

                {/*TODO: urgent section for exprigin / other */}

                {/*section 2*/}
                <View style={styles.section_2}>
                    {/* Show a starting action when there are no planned meals. */}
                    {meals.length == 0 &&
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
                    {meals.slice(0, 2).map((meal, index) =>
                        <Link href="/plan" asChild key={meal.id}>
                            <Pressable>{({pressed}) => <View style={[styles.meal_card,
                                {backgroundColor: colours.backgroundcontainer}, pressed && styles.pressed]}>
                                {meal.image ?
                                    <Image source={{uri: meal.image}} contentFit="cover"
                                           accessibilityLabel={meal.name} style={styles.meal_image}/>
                                    : <View style={[styles.meal_image, styles.meal_placeholder,
                                        {backgroundColor: colours.background}]}>
                                        <SymbolView
                                            name={{ios: 'fork.knife', android: 'restaurant', web: 'restaurant'}}
                                            tintColor={colours.greenhighlight} size={26}/>
                                    </View>}
                                <View style={styles.meal_content}>
                                    <ThemedText style={[styles.meal_position, {color: colours.greenhighlight}]}>
                                        {index === 0 ? `${meal.dateMeal}` : `${meal.dateMeal}`}
                                    </ThemedText>
                                    <ThemedText style={styles.meal_card_title}
                                                numberOfLines={2}>{meal.name}</ThemedText>
                                    <ThemedText themeColour="textSecondary"
                                                style={styles.meal_card_description}
                                                numberOfLines={2}>
                                        {meal.description ? meal.description : "No description :("}
                                    </ThemedText>
                                </View>
                            </View>}
                            </Pressable>
                        </Link>
                    )}
                    {/*section 3*/}
                </View>
                <View style={styles.section_3}>
                    <ThemedText type="subtitle" style={styles.section_title}>The rest of your week</ThemedText>

                    <Link href="/groceries" asChild>
                        <Pressable>{({pressed}) => <View style={[styles.overview_card,
                            {backgroundColor: colours.backgroundcontainer}, pressed && styles.pressed]}>
                            <View style={styles.card_heading}>
                                <View style={[styles.preview_icon, {backgroundColor: colours.background}]}>
                                    <SymbolView
                                        name={{ios: 'basket', android: 'shopping_basket', web: 'shopping_basket'}}
                                        tintColor={colours.greenhighlight} size={21}/>
                                </View>
                                <ThemedText style={styles.card_title}>Groceries</ThemedText>
                                {items.length > 0 &&
                                    <ThemedText themeColour="textSecondary" style={styles.grocery_remaining}>
                                        {remainingItems.length === 0 ? 'All bought ^w^' : `${remainingItems.length} left`}
                                    </ThemedText>}
                                <SymbolView
                                    name={{ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right'}}
                                    tintColor={colours.textSecondary} size={18}/>
                            </View>{/*TODO make each item pressable and update parent for new list*/}
                            {items.length === 0 ?
                                <ThemedText themeColour="textSecondary" style={styles.card_description}>
                                    Nothing on your list yet. Add a few things to get started.
                                </ThemedText>
                                : <>{/* list length not 0*/}
                                    {remainingItems.length > 0 ?
                                        <View style={styles.grocery_chips}>
                                            {previewItems.map(item =>
                                                <View key={item.id} style={[styles.grocery_chip,
                                                    {backgroundColor: colours.background}]}>
                                                    <ThemedText numberOfLines={1} style={styles.grocery_chip_text}>
                                                        {item.name}
                                                    </ThemedText>
                                                </View>
                                            )}
                                            {hiddenCount > 0 &&
                                                <View style={[styles.grocery_chip,
                                                    {backgroundColor: colours.greenhighlightSecondary}]}>
                                                    <ThemedText style={styles.grocery_chip_text}>
                                                        +{hiddenCount} more
                                                    </ThemedText>
                                                </View>}
                                        </View>
                                        : <ThemedText themeColour="textSecondary" style={styles.card_description}>
                                            Everything on this list is bought.
                                        </ThemedText>}
                                    <View style={styles.grocery_progress}>
                                        <ThemedText themeColour="textSecondary" style={styles.grocery_progress_label}>
                                            {boughtCount} of {items.length} bought
                                        </ThemedText>
                                        <View style={[styles.grocery_progress_track,
                                            {backgroundColor: colours.background}]}>
                                            <View style={[styles.grocery_progress_fill,
                                                {
                                                    backgroundColor: colours.greenhighlight,
                                                    width: `${progress}%` as `${number}%`
                                                }]}/>
                                        </View>
                                    </View>
                                </>}
                        </View>}
                        </Pressable>
                    </Link>
                    {meals.length > 0 && laterMeals.length === 0 && <Link href="/plan" asChild>
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
                    {laterMeals.length > 0 && <Link href="/plan" asChild>
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
                            <View style={styles.later_meals}>
                                {laterMeals.map((meal, index) =>
                                    <View key={meal.id} style={[styles.later_meal,
                                        index > 0 && {borderTopWidth: 1, borderTopColor: colours.background}]}>
                                        <ThemedText style={[styles.later_meal_date,
                                            {color: colours.brownhighlight}]}>{meal.dateMeal}</ThemedText>
                                        <ThemedText style={styles.later_meal_title}
                                                    numberOfLines={2}>{meal.name}</ThemedText>
                                    </View>
                                )}
                            </View>
                        </View>}
                        </Pressable>
                    </Link>}
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
        welcome_row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: Spacing.three,
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
            marginTop: -Spacing.four
        },
        date: {
            fontSize: 13,
            lineHeight: 20,
            fontWeight: '600',
            letterSpacing: 0.7,
            marginTop: -Spacing.four
        },
        greeting: {
            flex: 1,
            minWidth: 0,
            fontFamily: Fonts.serif,
            fontSize: 36,
            lineHeight: 44,
            fontWeight: '500',
            marginTop: -Spacing.two

        },
        import_button: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -Spacing.one - Spacing.half
        },

        // Up next
        section_2: {
            marginTop: -Spacing.four,
            gap: Spacing.three,
        },
        section_title: {
            fontSize: 18,
            lineHeight: 20,
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
        meal_card: {
            flexDirection: 'row',
            gap: Spacing.four,
            borderRadius: 22,
            padding: Spacing.four,
        },
        meal_image: {
            width: 104,
            height: 112,
            borderRadius: 16,
        },
        meal_placeholder: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        meal_content: {
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
            gap: Spacing.one,
        },
        meal_position: {
            fontSize: 11,
            lineHeight: 16,
            fontWeight: '700',
            letterSpacing: 1,
        },
        meal_card_title: {
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '600',
        },
        meal_card_description: {
            fontSize: 13,
            lineHeight: 19,
        },
        meal_card_action: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.one,
            marginTop: Spacing.two,
        },
        meal_card_action_text: {
            fontSize: 13,
            lineHeight: 19,
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
        grocery_remaining: {
            fontSize: 12,
            lineHeight: 18,
            fontWeight: '600',
        },
        grocery_chips: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: Spacing.two,
        },
        grocery_chip: {
            maxWidth: '100%',
            borderRadius: 999,
            paddingHorizontal: Spacing.three,
            paddingVertical: Spacing.one,
        },
        grocery_chip_text: {
            fontSize: 13,
            lineHeight: 20,
            fontWeight: '500',
        },
        grocery_progress: {
            gap: Spacing.two,
            marginTop: Spacing.one,
        },
        grocery_progress_label: {
            fontSize: 12,
            lineHeight: 18,
            fontWeight: '600',
        },
        grocery_progress_track: {
            height: 8,
            borderRadius: 4,
            overflow: 'hidden',
        },
        grocery_progress_fill: {
            height: '100%',
            borderRadius: 4,
        },
        later_meals: {
            gap: Spacing.two,
        },
        later_meal: {
            gap: Spacing.one,
            paddingVertical: Spacing.two,
        },
        later_meal_date: {
            fontSize: 11,
            lineHeight: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        later_meal_title: {
            fontSize: 15,
            lineHeight: 22,
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
