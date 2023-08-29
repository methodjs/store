import React, { createContext, useId } from 'react';

type InitProviderModel = {
  id: string;
};

const InitProviderContext = createContext<InitProviderModel>({ id: '' });

export function InitProvider({ children }: { children: React.ReactNode }) {
  const id = useId();
  return (
    <InitProviderContext.Provider value={{ id }}>
      {children}
    </InitProviderContext.Provider>
  );
}
