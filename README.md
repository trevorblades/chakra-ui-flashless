# Flashless Chakra UI

This library contains all the tools necessary to implement Chakra UI color modes on statically rendered websites without [the flash](https://github.com/chakra-ui/chakra-ui/issues/1878).

![flash sucks](https://media.giphy.com/media/hXPbekQiT94VkIR4To/giphy.gif)

The approach is based on [a blog post](https://www.joshwcomeau.com/react/dark-mode/) by @joshwcomeau. It goes something like this:

1. Inject a script at the top of your HTML `<body>` that checks the system color mode.
2. Define a bunch of CSS variables for your different UI colors, based on whether the system color mode is light or dark.
3. Use those variables in your CSS instead of raw colors.

This library simplifies the creation of these light-sensitive color variables, and makes it easy to update your Chakra UI theme to use them.

## Installation

Before using this library, you should have installed [Chakra UI](https://chakra-ui.com/docs/getting-started#installation) and its dependencies.

```bash
npm install chakra-ui-flashless
```

## Usage

First, wrap your theme overrides in the `flashless` function. If you use the default theme with no overrides, simply pass `flashless()` to `extendTheme`.

```js
import {extendTheme} from '@chakra-ui/react';
import {flashless} from 'chakra-ui-flashless';

// without overrides
const theme = extendTheme(flashless());

// with overrides
const theme = extendTheme(
  flashless({
    styles: {
      global: {
        'pre, :not(pre) > code': {
          fontSize: 'calc(1em / 1.125)',
          borderRadius: 'sm'
        }
      }
    }
  })
);

export default theme;
```

Next a `<script>` tag must be 

### Gatsby

```jsx
import theme from './src/@chakra-ui/gatsby-plugin/theme';
import {createVariables} from 'chakra-ui-flashless';

const variables = createVariables(theme);

export const onRenderBody = ({setPreBodyComponents}) => {
  setPreBodyComponents([
    <script dangerouslySetInnerHTML={{__html: variables}} />
  ]);
};
```

### Next.js

```jsx
// pages/_document.js
import Document, {Head, Html, Main, NextScript} from 'next/document';
import React from 'react';
import theme from './theme';
import {createVariables} from 'chakra-ui-flashless';

const variables = createVariables(theme);

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <body>
          <script dangerouslySetInnerHTML={{__html: variables}} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

## Custom variables

```jsx
const variables = createVariables(
  theme,
  {
    // define custom color variables
    '--inline-code-bg-color': ['indigo.50', 'gray.900'],
    '--inline-code-text-color': [
      'indigo.800',
      ['indigo.200', 0.5] // supply an array for transparent colors
    ]
  }
);
```

## License

[MIT](./LICENSE)
