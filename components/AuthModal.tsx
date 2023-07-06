'use client';

import {
  SupabaseClient,
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import Modal from './Modal';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import useAuthModal from '@/hooks/useAuthModal';
import { useEffect } from 'react';

export default function AuthModal() {
  const SupabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  return (
    <Modal
      title="欢迎回来👏"
      description="登陆(用户名faaa@live.com/密码123456)"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="dark"
        providers={[]}
        // providers={['google', 'github', 'apple', 'notion', 'spotify']}
        magicLink
        supabaseClient={SupabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e',
              },
            },
          },
        }}
      />
    </Modal>
  );
}
