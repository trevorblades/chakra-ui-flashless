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
            outline: (props: Dict) => ({
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
}
