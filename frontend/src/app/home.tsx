import * as Device from 'expo-device';
import {Platform, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AnimatedIcon} from '@/components/animated-icon';
import {HintRow} from '@/components/hint-row';
import {ThemedText} from '@/components/themed-text';
import {ThemedView} from '@/components/themed-view';
import {WebBadge} from '@/components/web-badge';
import {BottomTabInset, MaxContentWidth, Spacing} from '@/constants/theme';


export default function HomeScreen() {
    const now = new Date();
    const name = "Emilia" // later connect to logged in state + main stuff
    const hours = now.getHours();
    let greeting: string = 'Go to sleep!';
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

    return (
        <View style={styles.home_container}>
            <View style={styles.section_1}>
                <ThemedText type="title">{greeting}, {name}!</ThemedText>
                <ThemedText type="subtitle" style={{marginTop: -Spacing.two}}>{formattedDate.toString()}</ThemedText>
            </View>
            <View style={styles.section_2}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

        home_container: {
            flex: 1,
            flexDirection: 'column',
        },
        section_1: {
            marginTop: Spacing.twenty,
            marginLeft: Spacing.two,
        },
        section_2: {
            marginTop: Spacing.twenty,
            marginLeft: Spacing.two,
            backgroundColor: '#F2EDE5',
            width: '100%',
            height: '20%',
            borderRadius: 50,
            padding: 0,
        }
    })
;
