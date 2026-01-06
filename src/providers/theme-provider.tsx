'use client';

import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from 'next-themes';
import { Children } from 'react';

export function ThemeProvider ({children, ...props }: ThemeProviderProps) {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}