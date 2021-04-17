import React, { useCallback, useState } from 'react';

export type NavigationStateType = {
  title: string;
  subtitle: string;
  extra: React.ReactNodeArray;
};

export type NavigationType = NavigationStateType & {
  setTitles(params: { title?: string, subtitle?: string, extra?: React.ReactNodeArray }): void;
};

export const NavigationContext = React.createContext<NavigationType>(undefined!);

const DEFAULT_STATE: NavigationStateType = {
  title: 'RELI',
  subtitle: '',
  extra: [],
};

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<NavigationStateType>(DEFAULT_STATE);

  const setTitles: NavigationType['setTitles'] = useCallback(({ subtitle, title, extra }) => {
    setState({
      subtitle: subtitle || DEFAULT_STATE.subtitle,
      title: title || DEFAULT_STATE.title,
      extra: extra || DEFAULT_STATE.extra,
    });
  }, []);

  return (
    <NavigationContext.Provider value={{ ...state, setTitles }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = () => React.useContext(NavigationContext);

export default useNavigation;
