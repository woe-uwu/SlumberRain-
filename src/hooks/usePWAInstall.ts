import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_INSTALLED_KEY = 'slumberrain_installed';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isStandaloneMQ = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreenMQ = window.matchMedia('(display-mode: fullscreen)').matches;
    const isMinimalUiMQ = window.matchMedia('(display-mode: minimal-ui)').matches;
    const isNavStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const isAndroidApp = typeof document !== 'undefined' && document.referrer.includes('android-app://');
    const isUrlParam =
      window.location.search.includes('source=pwa') ||
      window.location.search.includes('installed=true') ||
      window.location.search.includes('mode=standalone');
    const isSavedStorage = localStorage.getItem(STORAGE_INSTALLED_KEY) === 'true';

    return isStandaloneMQ || isFullscreenMQ || isMinimalUiMQ || isNavStandalone || isAndroidApp || isUrlParam || isSavedStorage;
  } catch {
    return false;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    setIsInstalled(checkIsStandalone());

    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsAndroid(/android/.test(ua));
      setIsIOS(/iphone|ipad|ipod/.test(ua));

      // Re-check display mode matches on resize/mode change
      const standaloneQuery = window.matchMedia('(display-mode: standalone)');
      const handleModeChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setIsInstalled(true);
          try {
            localStorage.setItem(STORAGE_INSTALLED_KEY, 'true');
          } catch {
            // ignore
          }
        }
      };

      try {
        standaloneQuery.addEventListener('change', handleModeChange);
      } catch {
        // fallback for older browsers
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        try {
          localStorage.setItem(STORAGE_INSTALLED_KEY, 'true');
        } catch {
          // ignore
        }
        setDeferredPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        try {
          standaloneQuery.removeEventListener('change', handleModeChange);
        } catch {
          // ignore
        }
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const triggerInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        try {
          localStorage.setItem(STORAGE_INSTALLED_KEY, 'true');
        } catch {
          // ignore
        }
        setDeferredPrompt(null);
        return true;
      }
    } catch {
      // fallback
    }
    return false;
  };

  const setManualInstalled = (installed: boolean) => {
    setIsInstalled(installed);
    try {
      localStorage.setItem(STORAGE_INSTALLED_KEY, installed ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isAndroid,
    isIOS,
    triggerInstall,
    setManualInstalled,
  };
}
