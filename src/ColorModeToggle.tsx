import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {ColorModeToggleProps} from './types';
import {createDefaultVariables, getColorValue} from './helpers';

const ColorModeContext = createContext({});

export function ColorModeToggle({
  theme,
  children,
  customVariables
}: ColorModeToggleProps): JSX.Element {
  const [colorMode, setColorMode] = useState(undefined);

  const defaultVariables = useMemo(() => createDefaultVariables(theme), [
    theme
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--chakra-ui-color-mode'
    );

    setColorMode(initialColorValue);
  }, []);

  const toggleColorMode = useCallback(() => {
    const root = window.document.documentElement;

    setColorMode(prev => {
      const newColorMode = prev === 'dark' ? 'light' : 'dark';
      const isLightMode = newColorMode === 'dark';

      localStorage.setItem('chakra-ui-color-mode', newColorMode);

      Object.entries({
        ...defaultVariables,
        ...customVariables
      }).forEach(([name, values]) =>
        root.style.setProperty(
          name,
          isLightMode
            ? `${getColorValue(theme, values[1])}`
            : `${getColorValue(theme, values[0])}`
        )
      );

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

export const useColorMode = () => useContext(ColorModeContext);
