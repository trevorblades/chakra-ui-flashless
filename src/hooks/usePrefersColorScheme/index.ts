import {useCallback, useEffect, useState} from 'react';

import {useHasMounted} from '../useHasMounted';

import {UsePrefersColorSchemePayload} from './types';

/**
 * Gets the color scheme preferred by the user and listen to it's change
 */
export function usePrefersColorScheme(): UsePrefersColorSchemePayload {
  const hasMounted = useHasMounted();
  const [prefersColorScheme, setPrefersColorScheme] = useState(null);

  const getPrefersColorScheme = useCallback(prefersColorScheme => {
    const newColorScheme = prefersColorScheme.matches ? 'dark' : 'light';

    setPrefersColorScheme(newColorScheme);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', getPrefersColorScheme);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', getPrefersColorScheme);
  }, [getPrefersColorScheme, hasMounted]);

  return {prefersColorScheme, hasMounted};
}
