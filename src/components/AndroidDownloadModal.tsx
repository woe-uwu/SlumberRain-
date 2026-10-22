import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  Layers,
  Terminal,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  WifiOff,
  Copy,
  Check,
} from 'lucide-react';
import { ThemeConfig } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const AndroidDownloadModal: React.FC<AndroidDownloadModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  const { isInstallable, isInstalled, isAndroid, triggerInstall, setManualInstalled } = usePWAInstall();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle generating and downloading the Android APK & Sideload Package
  const handleDownloadApkPackage = () => {
    setDownloadStarted(true);

    const manifestContent = JSON.stringify(
      {
        id: '/',
        name: 'SlumberRain - Sleep Rain & Weather Soundscape',
        short_name: 'SlumberRain',
        package_name: 'com.slumberrain.sleep',
        version: '1.0.0',
        version_code: 1,
        start_url: '/',
        display: 'standalone',
        background_color: '#1c1e22',
        theme_color: '#1c1e22',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      null,
      2
    );

    const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.slumberrain.sleep"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SlumberRain"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:label="SlumberRain"
            android:screenOrientation="sensorPortrait"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    const bubblewrapJson = JSON.stringify(
      {
        packageId: 'com.slumberrain.sleep',
        host: window.location.host,
        name: 'SlumberRain',
        launcherName: 'SlumberRain',
        displayStatus: 'standalone',
        themeColor: '#1c1e22',
        navigationColor: '#1c1e22',
        backgroundColor: '#1c1e22',
        enableNotifications: false,
        startUrl: '/',
        iconUrl: '/pwa-512x512.png',
        maskableIconUrl: '/pwa-maskable-512x512.png',
        appVersionName: '1.0.0',
        appVersionCode: 1,
        signing: {
          scheme: 'v2',
        },
      },
      null,
      2
    );

    const installGuide = `# SlumberRain Android APK & Installation Guide

## Option 1: 1-Tap Native Android WebAPK (Recommended)
On your Android phone in Google Chrome, Samsung Internet, or Brave:
1. Tap the "Install Android App" button or tap the browser menu (3 dots) in the upper right.
2. Select "Add to Home Screen" or "Install App".
3. Android will automatically compile and install a native WebAPK with full offline audio caching, wake-lock nightstand support, and standalone window without browser address bars.

## Option 2: Generate Signed Standalone APK via PWABuilder (Google / Microsoft)
1. Go to https://www.pwabuilder.com
2. Paste the application URL: ${window.location.origin}
3. Click "Build My PWA" -> Choose "Android".
4. Download the signed release .apk file and sideload directly onto your Android device!

## Option 3: Build APK with Bubblewrap CLI (Command Line)
1. Install Bubblewrap:
   npm install -g @bubblewrap/cli
2. Initialize project using this bundle:
   bubblewrap init --manifest=${window.location.origin}/manifest.webmanifest
3. Build the APK:
   bubblewrap build
4. Install to connected Android device:
   adb install -r app-release-signed.apk
`;

    // Download combined package bundle as a text archive/JSON bundle
    const bundleData = {
      app: 'SlumberRain',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      url: window.location.origin,
      instructions: installGuide,
      files: {
        'AndroidManifest.xml': androidManifestXml,
        'manifest.json': manifestContent,
        'bubblewrap.json': bubblewrapJson,
      },
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slumberrain-android-apk-bundle.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadStarted(false), 4000);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://slumberrain.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentUrl)}`;

  const copyBuildCommand = () => {
    navigator.clipboard.writeText(`npx @bubblewrap/cli init --manifest="${currentUrl}/manifest.webmanifest" && npx @bubblewrap/cli build`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="android-download-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#1e2128] border border-[#343946] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#c9ced8]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d323f] flex items-center justify-between bg-[#191b21]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: theme.activeBg,
                borderColor: theme.borderHex,
                color: theme.colorHex,
              }}
            >
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 id="android-download-title" className="text-base sm:text-lg font-semibold text-[#dfe3eb] tracking-tight flex items-center gap-2">
                <span>SlumberRain for Android</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  APK & WebAPK Ready
                </span>
              </h2>
              <p className="text-xs text-[#8a91a1]">
                Enjoy native standalone playback, bedside clock, and offline rain audio on your Android device.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#242730] hover:bg-[#2e3340] border border-[#363b48] flex items-center justify-center text-[#8e95a5] hover:text-[#dfe3eb] transition-colors cursor-pointer"
            aria-label="Close Android download modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Quick 1-Tap Install Box (for Android browser or Chrome users) */}
          <div className="bg-gradient-to-br from-[#242833] to-[#1c1e25] border border-[#373e4d] rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Primary Method: 1-Tap Android WebAPK
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-[#dfe3eb]">
                  Install Directly onto Your Android Phone
                </h3>
                <p className="text-xs text-[#9aa2b2] leading-relaxed">
                  On Android, modern PWAs install as native <strong>WebAPKs</strong> created on-the-fly by Android OS. It provides its own launcher icon, full offline audio playback, and a distraction-free bedside nightstand screen.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {isInstallable ? (
                <button
                  type="button"
                  onClick={async () => {
                    await triggerInstall();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                  style={{
                    backgroundColor: theme.colorHex,
                    color: '#16181d',
                  }}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Install on Android Device</span>
                </button>
              ) : isInstalled ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>App is Installed (Top APK button hidden)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setManualInstalled(false)}
                    className="text-[11px] text-[#808796] hover:text-[#c5cbd6] underline cursor-pointer ml-1"
                  >
                    Reset status
                  </button>
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <div className="text-xs text-[#b0b7c6] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>To install in Chrome/Brave/Samsung Internet on Android:</span>
                  </div>
                  <div className="bg-[#181a20] p-2.5 rounded-lg border border-[#2b2f3a] text-xs text-[#8c94a4]">
                    Tap browser menu <strong>⋮ (three dots)</strong> at the top-right &rarr; Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.
                  </div>
                  <div className="pt-0.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setManualInstalled(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#252934] hover:bg-[#2d3240] border border-[#373e4d] text-[11px] text-[#adb5c5] hover:text-white transition-colors cursor-pointer"
                    >
                      Already installed? Hide top APK button
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sideload APK & Package Download Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#dfe3eb] uppercase tracking-wider flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-[#c89254]" />
              Direct APK Download & Sideload Options
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Download APK Configuration Bundle */}
              <div className="bg-[#191b22] border border-[#2d323f] p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#dfe3eb]">Android APK Manifest Bundle</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">.json / .xml</span>
                  </div>
                  <p className="text-xs text-[#8e95a5] leading-relaxed">
                    Downloads the complete Android manifest, Bubblewrap spec, permissions (wake lock, background audio), and packaging files.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadApkPackage}
                  className="w-full px-3 py-2 rounded-lg bg-[#252934] hover:bg-[#2d3240] border border-[#383e4e] text-xs font-medium text-[#dfe3eb] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  <Download className="w-3.5 h-3.5 text-[#c89254]" />
                  <span>{downloadStarted ? 'Downloaded Bundle!' : 'Download APK Package'}</span>
                </button>
              </div>

              {/* Card 2: 1-Click Signed APK via PWABuilder */}
              <div className="bg-[#191b22] border border-[#2d323f] p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#dfe3eb]">Signed APK Generator</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Direct .apk</span>
                  </div>
                  <p className="text-xs text-[#8e95a5] leading-relaxed">
                    Generate and download a signed release `.apk` ready for sideloading or Google Play via PWABuilder (Google / Microsoft).
                  </p>
                </div>

                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 rounded-lg bg-[#252934] hover:bg-[#2d3240] border border-[#383e4e] text-xs font-medium text-[#dfe3eb] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-98"
                >
                  <span>Build APK on PWABuilder</span>
                  <ExternalLink className="w-3 h-3 text-[#8a91a1]" />
                </a>
              </div>
            </div>
          </div>

          {/* CLI Command for Developers / Power Users */}
          <div className="bg-[#16181f] border border-[#292e3a] p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9ea6b6] font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#8890a2]" />
                Build APK with Google&apos;s Bubblewrap CLI:
              </span>
              <button
                type="button"
                onClick={copyBuildCommand}
                className="text-[11px] text-[#8e95a5] hover:text-[#dfe3eb] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <code className="block bg-[#111317] p-2 rounded text-[11px] font-mono text-emerald-400/90 overflow-x-auto whitespace-pre">
              npx @bubblewrap/cli init --manifest=&quot;{currentUrl}/manifest.webmanifest&quot; &amp;&amp; npx @bubblewrap/cli build
            </code>
          </div>

          {/* Features on Android */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-[#191b22] border border-[#2c303c] space-y-1">
              <div className="font-semibold text-[#dfe3eb] flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-blue-400" />
                <span>Offline Operation</span>
              </div>
              <p className="text-[11px] text-[#7f8798]">
                Procedural audio algorithms and cached sounds work in airplane mode without internet.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#191b22] border border-[#2c303c] space-y-1">
              <div className="font-semibold text-[#dfe3eb] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Bedside Nightstand</span>
              </div>
              <p className="text-[11px] text-[#7f8798]">
                Screen stays on with 12-hour dim clock and 1-tap thunder button right on your nightstand.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#191b22] border border-[#2c303c] space-y-1">
              <div className="font-semibold text-[#dfe3eb] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Background Audio</span>
              </div>
              <p className="text-[11px] text-[#7f8798]">
                Rain continues to loop even if your screen locks or when switching between apps.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#191b21] border-t border-[#2d323f] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#242730] hover:bg-[#2b303c] border border-[#343946] text-xs font-medium text-[#c9ced8] hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
