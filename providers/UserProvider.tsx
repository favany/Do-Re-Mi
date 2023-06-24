'use client';

import { MyUserContextProvider } from '@/hooks/useUser';

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => (
  <MyUserContextProvider>{children}</MyUserContextProvider>
);

export default UserProvider;
