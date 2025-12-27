'use client';

import { useEffect, useState } from 'react';

type StatusToastProps = {
  message: string;
  variant?: 'success' | 'error';
  durationMs?: number;
};

const VARIANT_STYLES = {
  success: {
    container: 'border-green-200 bg-white text-green-900',
    accent: 'bg-green-500',
    icon: '✔',
  },
  error: {
    container: 'border-red-200 bg-white text-red-900',
    accent: 'bg-red-500',
    icon: '⚠',
  },
};

export default function StatusToast({ message, variant = 'success', durationMs = 3200 }: StatusToastProps) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    setVisible(true);
    setShouldRender(true);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, durationMs);

    const unmountTimer = setTimeout(() => {
      setShouldRender(false);
    }, durationMs + 400);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [durationMs, message]);

  if (!shouldRender) {
    return null;
  }

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl shadow-gray-300/40 ${styles.container}`}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${styles.accent}`}>
          {styles.icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{variant === 'success' ? 'Success' : 'Heads up'}</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
