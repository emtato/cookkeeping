import {NativeTabs} from 'expo-router/unstable-native-tabs';
import {useColorScheme as useColourScheme} from 'react-native';

import {Colours} from '@/constants/theme';

export default function TabManager() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];

    return (
        <NativeTabs
            backgroundColor={colours.background}
            iconColor={colours.greenhighlight}
            labelStyle={{selected: {color: colours.text}}}>

            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/home.png')}
                    renderingMode="template"/>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="groceries">
                <NativeTabs.Trigger.Label>Groceries</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"/>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="plan">
                <NativeTabs.Trigger.Label>Plan</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"/>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="recipes">
                <NativeTabs.Trigger.Label>Recipes</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"/>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
