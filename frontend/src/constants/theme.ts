/**
 * Below are the colours that are used in the app. The colours are defined in the light and dark mode.
 */

import '@/global.css';

import {Platform} from 'react-native';

export const Colours = {
    white: '#ffffff',                // unsued for now
    lightcream: '#e8e0db',           // background              | main text
    cream: '#e0d3c9',                // ?                       | secondary text
    darkgreen: '#131914',            // ?                       | background
    green: '#0a600a',                // main highlight          | secondary highlight
    pastelgreen: '#6fce6f',          // secondary highlight     | main highlight
    lightorange: '#ffcc99',          // ?
    brown: '#523a1a',                // main highlight          | secondary highlight
    lightbrown: '#8f693e',           // secondary highlight     | main highlight
    superdarkbrown: '#130c01',       // main text               | ?
    darkbrown: '#1a1102',            // secondary text          | ?

    light: {
        text: '#130c01',
        textSecondary: '#1a1102',
        background: '#e8e0db',
        greenhighlight: '#0a600a',
        greenhighlightSecondary: '#6fce6f',
        brownhighlight: '#523a1a',
        brownhighlightSecondary: '#8f693e',
    },
    dark: {
        text: '#130c01',
        textSecondary: '#e0d3c9',
        background: '#131914',
        greenhighlight: '#6fce6f',
        greenhighlightSecondary: '#0a600a',
        brownhighlight: '#8f693e',
        brownhighlightSecondary: '#523a1a',
    },
} as const;

export type ThemeColour = keyof typeof Colours.light & keyof typeof Colours.dark;

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: 'system-ui',
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: 'ui-serif',
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: 'ui-rounded',
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: 'ui-monospace',
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: 'var(--font-display)',
        serif: 'var(--font-serif)',
        rounded: 'var(--font-rounded)',
        mono: 'var(--font-mono)',
    },
});

export const Spacing = {
    half: 2,
    one: 4,
    two: 8,
    three: 12,
    four: 16,
    five: 20,
    six: 24,
    seven: 28,
    eight: 32,
    ten: 40,
    twelve: 48,
    fourteen: 56,
    sixteen: 64,
} as const;

export const BottomTabInset = Platform.select({ios: 50, android: 80}) ?? 0;
export const MaxContentWidth = 800;
