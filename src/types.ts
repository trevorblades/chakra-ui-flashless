import {ColorMode} from '@chakra-ui/react';
import {Dict} from '@chakra-ui/utils';
import {PropsWithChildren} from 'react';

export type Color = string | [string, number];
export type Variables = Record<string, [Color, Color]>;
export type ColorModeToggleProps = PropsWithChildren<{
  theme: Dict;
  customVariables: Variables;
  initialColorMode?: ColorMode;
}>;
export type ColorModeContextValue = {
  colorMode: ColorMode;
  toggleColorMode: () => void;
};
export type ToggleColorVariablesParameters = {
  theme: Dict;
  colorMode: ColorMode;
  customVariables: Variables;
};
