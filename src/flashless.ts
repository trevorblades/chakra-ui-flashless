import defaultTheme from '@chakra-ui/theme';
import merge from 'lodash.merge';
import {Dict} from '@chakra-ui/utils';

const Badge = {
  variants: {
    solid(props: Dict) {
      const {colorScheme: c} = props;
      return {
        bg: `var(--badge-solid-${c})`,
        color: 'var(--badge-text)'
      };
    },
    subtle(props: Dict) {
      const {colorScheme: c} = props;
      return {
        bg: `var(--badge-subtle-${c})`,
        color: `var(--badge-subtle-${c}-text)`
      };
    },
    outline(props: Dict) {
      const {colorScheme: c} = props;
      return {
        color: `var(--badge-outline-${c})`,
        boxShadow: `inset 0 0 0px 1px var(--badge-outline-${c})`
      };
    }
  }
};

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
        Badge,
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
        },
        Tag: {
          variants: {
            subtle: (props: Dict) => ({
              container: Badge.variants.subtle(props)
            }),
            solid: (props: Dict) => ({
              container: Badge.variants.solid(props)
            }),
            outline: (props: Dict) => ({
              container: Badge.variants.outline(props)
            })
          }
        }
      }
    },
    theme
  );
}
