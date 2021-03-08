import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {ColorModeContextValue, ColorModeToggleProps} from './types';
import {createDefaultVariables, getColorValue} from './helpers';

const ColorModeContext = createContext({} as ColorModeContextValue);

export function ColorModeToggle({
  theme,
  children,
  customVariables,
  initialColorMode
}: ColorModeToggleProps): JSX.Element {
  const [colorMode, setColorMode] = useState(initialColorMode);

  const defaultVariables = useMemo(() => createDefaultVariables(theme), [
    theme
  ]);

  const toggleColorMode = useCallback(() => {
    const root = window.document.documentElement;

    setColorMode(prev => {
      const newColorMode = prev === 'dark' ? 'light' : 'dark';
      const isDarkMode = newColorMode === 'dark';

      Object.entries({
        ...defaultVariables,
        ...customVariables
      }).forEach(([name, values]) =>
        root.style.setProperty(
          name,
          isDarkMode
            ? `${getColorValue(theme, values[1])}`
            : `${getColorValue(theme, values[0])}`
        )
      );

      root.style.setProperty('--chakra-ui-color-mode', newColorMode);

      return newColorMode;
    });
  }, [colorMode]);

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
