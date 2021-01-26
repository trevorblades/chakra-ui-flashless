const merge = require('lodash.merge');
const {outdent} = require('outdent');
const {getColor, transparentize} = require('@chakra-ui/theme-tools');

const baseVariables = {
  '--bg-color': ['white', 'gray.800'],
  '--text-color': ['gray.800', 'whiteAlpha.900'],
  '--placeholder-text-color': ['gray.400', 'whiteAlpha.400'],
  '--border-color': ['gray.200', 'whiteAlpha.300'],
  '--button-ghost-gray': ['inherit', 'whiteAlpha.900'],
  '--button-ghost-gray-hover': ['gray.100', 'whiteAlpha.200'],
  '--button-ghost-gray-active': ['gray.200', 'whiteAlpha.300'],
  '--button-solid-gray': ['gray.100', 'whiteAlpha.200'],
  '--button-solid-gray-hover': ['gray.200', 'whiteAlpha.300'],
  '--button-solid-gray-active': ['gray.300', 'whiteAlpha.400']
};

exports.createVariables = (theme, customVariables) => {
  const colorValue = color =>
    Array.isArray(color)
      ? transparentize(...color)(theme)
      : getColor(theme, color);

  const defaultVariables = Object.entries(theme.colors)
    .filter(([key, value]) => key !== 'gray' || typeof value === 'string')
    .reduce(
      (acc, [c]) => ({
        ...acc,
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
        ([name, [light, dark]]) =>
          outdent`
            root.style.setProperty(
              '${name}',
              mql.matches
                ? '${colorValue(dark)}'
                : '${colorValue(light)}'
            );
          `
      )
      .join('\n')}
  `;
};

const ghost = ({colorScheme: c}) => ({
  color: `var(--button-ghost-${c})`,
  _hover: {bg: `var(--button-ghost-${c}-hover)`},
  _active: {bg: `var(--button-ghost-${c}-active)`}
});

exports.flashless = theme =>
  merge(
    {
      config: {
        useSystemColorMode: true
      },
      styles: {
        global: {
          body: {
            bg: 'var(--bg-color)',
            color: 'var(--text-color)'
          },
          '*::placeholder': {
            color: 'var(--placeholder-text-color)'
          },
          '*, *::before, &::after': {
            borderColor: 'var(--border-color)'
          }
        }
      },
      components: {
        Button: {
          variants: {
            ghost,
            solid: ({colorScheme: c}) => ({
              color: c !== 'gray' && 'var(--bg-color)',
              bg: `var(--button-solid-${c})`,
              _hover: {bg: `var(--button-solid-${c}-hover)`},
              _active: {bg: `var(--button-solid-${c}-active)`}
            }),
            outline: props => ({
              borderColor:
                props.colorScheme === 'gray'
                  ? 'var(--border-color)'
                  : 'currentColor',
              ...ghost(props)
            })
          }
        }
      }
    },
    theme
  );
