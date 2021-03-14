import {useEffect, useState} from 'react';

import {useHasMounted} from '../useHasMounted';

import {UsePrefersColorSchemePayload} from './types';

function getNewColorScheme(event: MediaQueryList): string {
  const newColorScheme = event.matches ? 'dark' : 'light';

  return newColorScheme;
}

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

    setPrefersColorScheme(getNewColorScheme(prefersColorScheme));
  }, [hasMounted]);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    function changeListenerPrefersColorScheme(event) {
      setPrefersColorScheme(getNewColorScheme(event));
    }

    const prefersColorScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    prefersColorScheme.addEventListener(
      'change',
      changeListenerPrefersColorScheme
    );

    return function removeListenerPrefersColorScheme() {
      prefersColorScheme.removeEventListener(
        'change',
        changeListenerPrefersColorScheme
      );
    };
  }, [hasMounted]);

  return {prefersColorScheme, hasMounted};
}
