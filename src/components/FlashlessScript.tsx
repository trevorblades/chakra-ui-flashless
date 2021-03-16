import * as React from 'react';
import {Dict} from '@chakra-ui/utils';
import {getColor, transparentize} from '@chakra-ui/theme-tools';
import {outdent} from 'outdent';

import {Color, Variables} from '../types';

const baseVariables = {
  '--bg': ['white', 'gray.800'],
  '--text': ['gray.800', 'whiteAlpha.900'],
  '--placeholder-text': ['gray.400', 'whiteAlpha.400'],
  '--border': ['gray.200', 'whiteAlpha.300'],
  '--badge-text': ['white', 'whiteAlpha.800']
};

function createVariables(theme: Dict, customVariables?: Variables): string {
  function colorValue(color: Color) {
    return Array.isArray(color)
      ? transparentize(...color)(theme)
      : getColor(theme, color);
  }

  const defaultVariables = Object.entries(theme.colors)
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
    }, baseVariables);

  return outdent`
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;
    ${Object.entries({
      ...defaultVariables,
      ...customVariables
    })
      .map(
        ([name, values]) =>
          outdent`
            root.style.setProperty(
              '${name}',
              mql.matches
                ? '${colorValue(values[1])}'
                : '${colorValue(values[0])}'
            );
          `
      )
      .join('\n')}
  `;
}

interface FlashlessScriptProps {
  theme: Dict;
  customVariables?: Variables;
}

export function FlashlessScript({
  theme,
  customVariables
}: FlashlessScriptProps): JSX.Element {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: createVariables(theme, customVariables)
      }}
    />
  );
}
