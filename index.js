const {outdent} = require('outdent');
const {getColor} = require('@chakra-ui/theme-tools');

exports.createVariables = (theme, variables = []) => {
  const createVar = (name, light, dark) => outdent`
    root.style.setProperty(
      '${name}',
      mql.matches
        ? '${getColor(theme, dark)}'
        : '${getColor(theme, light)}'
    );
  `;

  return outdent`
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;
    ${createVar('--bg-color', 'white', 'gray.800')}
    ${createVar('--text-color', 'gray.800', 'whiteAlpha.900')}
    ${createVar('--placeholder-text-color', 'gray.400', 'whiteAlpha.400')}
    ${createVar('--border-color', 'gray.200', 'whiteAlpha.300')}
    ${createVar('--button-text-color', 'white', 'gray.800')}
    ${createVar('--button-bg-color-gray', 'gray.100', 'whiteAlpha.200')}
    ${createVar('--button-bg-color-gray-hover', 'gray.200', 'whiteAlpha.300')}
    ${createVar('--button-bg-color-gray-active', 'gray.300', 'whiteAlpha.400')}
    ${Object.entries(theme.colors)
      .filter(([key, value]) => key !== 'gray' || typeof value === 'string')
      .map(
        ([color]) => outdent`
          ${createVar(
            `--button-bg-color-${color}`,
            `${color}.500`,
            `${color}.200`
          )}
          ${createVar(
            `--button-bg-color-${color}-hover`,
            `${color}.600`,
            `${color}.300`
          )}
          ${createVar(
            `--button-bg-color-${color}-active`,
            `${color}.700`,
            `${color}.400`
          )}
        `
      )
      .concat(variables.map(args => createVar(...args)))
      .join('\n')}
  `;
};

/*
supports custom variables

createVariables(
  theme,
  [
    ['--inline-code-bg-color', 'indigo.50', 'gray.900'],
    ['--inline-code-text-color', 'indigo.800', 'indigo.200']
  ]
)
*/

exports.overrides = {
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
        solid: ({colorScheme: c}) => ({
          color: c !== 'gray' && 'var(--button-text-color)',
          bg: `var(--button-bg-color-${c})`,
          _hover: {bg: `var(--button-bg-color-${c}-hover)`},
          _active: {bg: `var(--button-bg-color-${c}-active)`}
        })
      }
    }
  }
};
