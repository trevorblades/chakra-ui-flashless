# Flashless Chakra UI

## Installation

```bash
npm install chakra-ui-flashless @chakra-ui/theme-tools
```

## Usage

```js
import {extendTheme} from '@chakra-ui/react';
import {flashless} from 'chakra-ui-flashless';

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

## Gatsby

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

## Next.js

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
        <Head>
          <script dangerouslySetInnerHTML={{__html: variables}} />
        </Head>
        <body>
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