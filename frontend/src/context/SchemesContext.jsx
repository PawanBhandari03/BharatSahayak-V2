import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSchemeRecords, readCachedRecords, toCard } from '../services/schemeApi';

const SchemesContext = createContext({ records: [], schemes: [], loading: true, source: 'none', error: null });

// language: 'en' | 'hi' | 'mr'. Cards use that language where the data has it, English otherwise.
export function SchemesProvider({ language = 'en', children }) {
  const [records, setRecords] = useState(() => readCachedRecords());
  const [state, setState] = useState({ loading: true, source: 'none', error: null });

  useEffect(() => {
    let live = true;
    fetchSchemeRecords().then(({ schemes, source, error }) => {
      if (!live) return;
      if (schemes.length) setRecords(schemes);
      setState({ loading: false, source, error: error || null });
    });
    return () => { live = false; };
  }, []);

  const schemes = useMemo(() => records.map((r) => toCard(r, language)), [records, language]);
  const value = useMemo(() => ({ records, schemes, language, ...state }), [records, schemes, language, state]);
  return <SchemesContext.Provider value={value}>{children}</SchemesContext.Provider>;
}

export const useSchemes = () => useContext(SchemesContext);
