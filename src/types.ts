import {ColorMode} from '@chakra-ui/react';
import {Dict} from '@chakra-ui/utils';
import {PropsWithChildren} from 'react';

export type Color = string | [string, number];
export type Variables = Record<string, [Color, Color]>;
export type ColorModeToggleProps = PropsWithChildren<{
  theme: Dict;
  customVariables: Variables;
}>;
export type ColorModeContextValue = {
  colorMode: ColorMode;
  toggleColorMode: () => void;
};
