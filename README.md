# Flashless Chakra UI

This library contains all the tools necessary to implement Chakra UI color modes on statically rendered websites without [the flash](https://github.com/chakra-ui/chakra-ui/issues/1878).

> **Note:** This technique sets Chakra's colors based on the system color mode and doesn't currently support toggling the color mode within the site.

![night time](https://media.giphy.com/media/l2YSDYQbXeo9M3Ize/giphy.gif)

The approach is based on [a blog post](https://www.joshwcomeau.com/react/dark-mode/) by [@joshwcomeau](https://github.com/joshwcomeau). It goes something like this:

1. Inject a script at the top of your HTML `<body>` that checks the system color mode.
2. Define a bunch of CSS variables for your different UI colors, based on whether the system color mode is light or dark.
3. Use those variables in your CSS instead of raw colors.

This library simplifies the creation of these light-sensitive color variables, and makes it easy to update your Chakra UI theme to use them.

- [Installation](#installation)
- [Usage](#usage)
  - [Gatsby](#gatsby)
  - [Next.js](#nextjs)
- [Custom variables](#custom-variables)
- [License](#license)

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

Next append the `FlashlessScript` component to the top of the HTML `<body>` and pass your Chakra theme as a prop. This looks slightly different depending on your static site generator.

```js
import theme from './theme';

<FlashlessScript theme={theme} />
```

### Gatsby

In `gatsby-ssr.js`, set a `FlashlessScript` as a pre-body component using the [`onRenderBody` API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#onRenderBody).

```jsx
// gatsby-ssr.js
import theme from './src/@chakra-ui/gatsby-plugin/theme';
import {FlashlessScript} from 'chakra-ui-flashless';

export const onRenderBody = ({setPreBodyComponents}) => {
  setPreBodyComponents([
    <FlashlessScript key="chakra-ui-flashless" theme={theme} />
  ]);
};
```

I'd also recommend disabling Chakra's built-in color mode features in the options for its Gatsby plugin.

```js
module.exports = {
  plugins: [
    {
      resolve: '@chakra-ui/gatsby-plugin',
      options: {
        isUsingColorMode: false
      }
    }
  ]
};
```

### Next.js

In Next.js, simply append the `FlashlessScript` to the `<body>` using a [custom `Document`](https://nextjs.org/docs/advanced-features/custom-document).

```jsx
// pages/_document.js
import Document, {Head, Html, Main, NextScript} from 'next/document';
import React from 'react';
import theme from './theme';
import {FlashlessScript} from 'chakra-ui-flashless';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <body>
          <FlashlessScript theme={theme} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

## Custom variables

You can create additional color variables to use in your UI with the `customVariables` prop. It accepts an object that maps CSS variable names to their light and dark variants using an array with two values.

To represent semitransparent colors, you can define a single variant as yet another array with two values: the color, and its opacity.

```js
{
  '--variable-name': [lightVariant, [darkVariant, 0.5]]
}
```

You can pass any named color that is defined in your Chakra theme, and easily manipulate their transparency.

```jsx
<FlashlessScript
  theme={theme}
  customVariables={{
    // define custom color variables
    '--inline-code-bg-color': ['indigo.50', 'gray.900'],
    '--inline-code-text-color': [
      'indigo.800',
      ['indigo.200', 0.5] // supply an array for semitransparent colors
    ]
  }}
/>
```

## License

[MIT](./LICENSE)
