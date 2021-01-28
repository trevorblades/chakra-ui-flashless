import * as React from 'react';
import {Dict} from '@chakra-ui/utils';
import {getColor, transparentize} from '@chakra-ui/theme-tools';
import {outdent} from 'outdent';

const baseVariables = {
  '--bg': ['white', 'gray.800'],
  '--text': ['gray.800', 'whiteAlpha.900'],
  '--placeholder-text': ['gray.400', 'whiteAlpha.400'],
  '--border': ['gray.200', 'whiteAlpha.300'],
  '--badge-solid-text': ['white', 'whiteAlpha.800'],
  '--button-ghost-gray': ['inherit', 'whiteAlpha.900'],
  '--button-ghost-gray-hover': ['gray.100', 'whiteAlpha.200'],
  '--button-ghost-gray-active': ['gray.200', 'whiteAlpha.300'],
  '--button-solid-gray': ['gray.100', 'whiteAlpha.200'],
  '--button-solid-gray-hover': ['gray.200', 'whiteAlpha.300'],
  '--button-solid-gray-active': ['gray.300', 'whiteAlpha.400']
};

type Color = string | [string, number];
type Variables = Record<string, [Color, Color]>;

function createVariables(theme: Dict, customVariables?: Variables): string {
  function colorValue(color: Color) {
    return Array.isArray(color)
      ? transparentize(...color)(theme)
      : getColor(theme, color);
  }

  const defaultVariables = Object.entries(theme.colors)
    .filter(([key, value]) => key !== 'gray' || typeof value === 'string')
    .reduce(
      (acc, [c]) => ({
        ...acc,
        [`--badge-solid-${c}`]: [`${c}.500`, [`${c}.500`, 0.6]],
        [`--badge-subtle-${c}`]: [`${c}.100`, [`${c}.200`, 0.16]],
        [`--badge-subtle-${c}-text`]: [`${c}.800`, `${c}.200`],
        [`--badge-outline-${c}`]: [`${c}.500`, [`${c}.200`, 0.8]],
        [`--button-ghost-${c}`]: [`${c}.600`, `${c}.200`],
        [`--button-ghost-${c}-hover`]: [`${c}.50`, [`${c}.200`, 0.12]],
        [`--button-ghost-${c}-active`]: [`${c}.100`, [`${c}.200`, 0.24]],
        [`--button-solid-${c}`]: [`${c}.500`, `${c}.200`],
        [`--button-solid-${c}-hover`]: [`${c}.600`, `${c}.300`],
        [`--button-solid-${c}-active`]: [`${c}.700`, `${c}.400`]
      }),
      baseVariables
    );

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
