'use client';

import { createContext, useContext } from 'react';
import type { PublicShopConfig } from '@/lib/types';

const DEFAULTS: PublicShopConfig = {
  revolutUsername: '',
  paypalUsername: '',
  contactEmail: 'hello@midg3.shop',
  whatsapp: '',
  facebookUrl: '',
  instagramUrl: '',
};

const ConfigContext = createContext<PublicShopConfig>(DEFAULTS);

export function ConfigProvider({
  value,
  children,
}: {
  value: PublicShopConfig;
  children: React.ReactNode;
}) {
  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useShopConfig(): PublicShopConfig {
  return useContext(ConfigContext);
}
