import {ThemedText} from "@/components/themed-text";
import {Pressable, View} from "react-native";
import {Button} from "@expo/ui";
import {useColorScheme as useColourScheme} from 'react-native';
import {Colours} from "@/constants/theme";

export default function GroceryCategory({sectionTitle, sectionItems}: {
    sectionTitle: string, sectionItems: string[]
}) {
    const scheme = useColourScheme();
    const colours = Colours[scheme === 'unspecified' ? 'light' : scheme];
    return <>
        <ThemedText type="subtitle">{sectionTitle}</ThemedText>
        {sectionItems.map((item, index) => (
            <View key={`${item}-${index}`} style={{flexDirection: 'row', gap: 10}}>
                <Pressable style={{width: 20, height: 20, backgroundColor: colours.greenhighlight, borderRadius: 50}}/>
                <ThemedText>{item}</ThemedText>
            </View>
        ))}
    </>
}
