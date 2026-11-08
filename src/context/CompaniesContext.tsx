import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';

import { createCompanyStore } from '../features/companies/accounts';

const CompaniesContext = createContext<ReturnType<typeof createCompanyStore> | undefined>(undefined);

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createCompanyStore);
  return <CompaniesContext.Provider value={store}>{children}</CompaniesContext.Provider>;
}

export function useCompanies() {
  const store = useContext(CompaniesContext);
  if (!store) throw new Error('useCompanies deve ser utilizado dentro de CompaniesProvider.');
  const companies = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  return { companies, store };
}
