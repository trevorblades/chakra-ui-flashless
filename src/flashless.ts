import defaultTheme from '@chakra-ui/theme';
import merge from 'lodash.merge';
import {Dict} from '@chakra-ui/utils';

function ghost(props: Dict) {
  const {colorScheme: c} = props;
  return {
    color: `var(--button-ghost-${c})`,
    _hover: {bg: `var(--button-ghost-${c}-hover)`},
    _active: {bg: `var(--button-ghost-${c}-active)`}
  };
}

export function flashless(theme: Dict = defaultTheme): Dict {
  return merge(
    {
      config: {
        useSystemColorMode: true
      },
      styles: {
        global: {
          body: {
            bg: 'var(--bg)',
            color: 'var(--text)'
          },
          '*::placeholder': {
            color: 'var(--placeholder-text)'
          },
          '*, *::before, &::after': {
            borderColor: 'var(--border)'
          }
        }
      },
      components: {
        Badge: {
          variants: {
            solid: ({colorScheme: c}) => ({
              bg: `var(--badge-solid-${c})`,
              color: 'var(--badge-solid-text)'
            }),
            subtle: ({colorScheme: c}) => ({
              bg: `var(--badge-subtle-${c})`,
              color: `var(--badge-subtle-${c}-text)`
            }),
            outline: ({colorScheme: c}) => ({
              color: `var(--badge-outline-${c})`,
              boxShadow: `inset 0 0 0px 1px var(--badge-outline-${c})`
            })
          }
        },
        Button: {
          variants: {
            ghost,
            solid: ({colorScheme: c}) => ({
              color: c !== 'gray' && 'var(--bg)',
              bg: `var(--button-solid-${c})`,
              _hover: {bg: `var(--button-solid-${c}-hover)`},
              _active: {bg: `var(--button-solid-${c}-active)`}
            }),
            outline: (props: Dict) => ({
              borderColor:
                props.colorScheme === 'gray' ? 'var(--border)' : 'currentColor',
              ...ghost(props)
            })
          }
        }
      }
    },
    theme
  );
}
