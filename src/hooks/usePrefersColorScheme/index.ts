import {useEffect, useState} from 'react';

import {useHasMounted} from '../useHasMounted';

import {UsePrefersColorSchemePayload} from './types';

/**
 * Gets the color scheme preferred by the user and listen to it's change
 */
export function usePrefersColorScheme(): UsePrefersColorSchemePayload {
  const hasMounted = useHasMounted();
  const [prefersColorScheme, setPrefersColorScheme] = useState(null);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const prefersColorScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    const newColorScheme = prefersColorScheme.matches ? 'dark' : 'light';

    setPrefersColorScheme(newColorScheme);
  }, [hasMounted]);

  return {prefersColorScheme, hasMounted};
}
