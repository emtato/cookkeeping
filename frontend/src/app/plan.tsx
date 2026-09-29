import {ThemedView} from "@/components/themed-view";
import {ThemedText} from "@/components/themed-text";
import {useColorScheme as useColourScheme} from "react-native";
import {Colours} from "@/constants/theme";

export default function TabTwoScreen() {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];

    return <ThemedView style={{backgroundColor: colours.background}}>
        <ThemedText type="title">
            Welcome to&nbsp;meowy2
        </ThemedText>
    </ThemedView>
}
