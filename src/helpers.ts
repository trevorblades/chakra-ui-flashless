import {Color, ToggleColorVariablesParameters, Variables} from './types';
import {Dict} from '@chakra-ui/utils';
import {getColor, transparentize} from '@chakra-ui/theme-tools';

import {BASE_VARIABLES} from './constants';

export function createDefaultVariables(theme: Dict): Variables {
  return Object.entries(theme.colors)
    .filter(entries => typeof entries[1] === 'object')
    .reduce((acc, [c]) => {
      const isGray = c === 'gray';
      return {
        ...acc,
        [`--badge-solid-${c}`]: [`${c}.500`, [`${c}.500`, 0.6]],
        [`--badge-subtle-${c}`]: [`${c}.100`, [`${c}.200`, 0.16]],
        [`--badge-subtle-${c}-text`]: [`${c}.800`, `${c}.200`],
        [`--badge-outline-${c}`]: [`${c}.500`, [`${c}.200`, 0.8]],
        [`--button-ghost-${c}`]: [
          isGray ? 'inherit' : `${c}.600`,
          isGray ? 'whiteAlpha.900' : `${c}.200`
        ],
        [`--button-ghost-${c}-hover`]: [
          `${c}.${isGray ? 100 : 50}`,
          isGray ? 'whiteAlpha.200' : [`${c}.200`, 0.12]
        ],
        [`--button-ghost-${c}-active`]: [
          `${c}.${isGray ? 200 : 100}`,
          isGray ? 'whiteAlpha.300' : [`${c}.200`, 0.24]
        ],
        [`--button-solid-${c}`]: [
          `${c}.${isGray ? 100 : 500}`,
          isGray ? 'whiteAlpha.200' : `${c}.200`
        ],
        [`--button-solid-${c}-hover`]: [
          `${c}.${isGray ? 200 : 600}`,
          isGray ? 'whiteAlpha.300' : `${c}.300`
        ],
        [`--button-solid-${c}-active`]: [
          `${c}.${isGray ? 300 : 700}`,
          isGray ? 'whiteAlpha.400' : `${c}.400`
        ]
      };
    }, BASE_VARIABLES);
}

export function getColorValue(theme: Dict, color: Color): string {
  return Array.isArray(color)
    ? transparentize(...color)(theme)
    : getColor(theme, color);
}

export function toggleColorVariables({
  theme,
  colorMode,
  customVariables
}: ToggleColorVariablesParameters): void {
  const defaultVariables = createDefaultVariables(theme);

  const root = window.document.documentElement;

  const isDarkMode = colorMode === 'dark';

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

  root.style.setProperty('--chakra-ui-color-mode', colorMode);
}
