import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState('');
  const [noticeVersion, setNoticeVersion] = useState(0);
  const showNotice = useCallback((text) => {
    setNotice(text);
    setNoticeVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [notice, noticeVersion]);

  return (
    <NoticeContext.Provider value={showNotice}>
      <div className={`notice-region${notice ? ' notice-region--visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">{notice}</div>
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotice phải được dùng bên trong NoticeProvider');
  return context;
}
