import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {ColorModeContextValue, ColorModeToggleProps} from '../types';
import {
  createDefaultVariables,
  getColorValue,
  toggleColorVariables
} from '../helpers';
import {usePrefersColorScheme} from '../hooks/usePrefersColorScheme';

const ColorModeContext = createContext({} as ColorModeContextValue);

export function ColorModeToggleProvider({
  theme,
  children,
  customVariables,
  initialColorMode
}: ColorModeToggleProps): JSX.Element {
  const [colorMode, setColorMode] = useState(initialColorMode);
  const {prefersColorScheme, hasMounted} = usePrefersColorScheme();

  const toggleColorMode = useCallback(() => {
    setColorMode(prev => {
      const newColorMode = prev === 'dark' ? 'light' : 'dark';

      return newColorMode;
    });
  }, [colorMode, prefersColorScheme]);

  useEffect(() => {
    const shouldUsePrefersColorScheme =
      hasMounted && !initialColorMode && prefersColorScheme;

    if (!shouldUsePrefersColorScheme) {
      return;
    }

    setColorMode(prefersColorScheme);
  }, [hasMounted, initialColorMode, prefersColorScheme]);

  useEffect(() => {
    if (!colorMode) {
      return;
    }

    toggleColorVariables({theme, colorMode, customVariables});
  }, [theme, customVariables, colorMode]);

  const payload = useMemo(
    () => ({
      colorMode,
      toggleColorMode
    }),
    [colorMode, toggleColorMode]
  );

  return (
    <ColorModeContext.Provider value={payload}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = (): ColorModeContextValue =>
  useContext(ColorModeContext);
