import type { Metadata } from 'next';

import { ResetPassword } from '~/lib/pages/reset-password';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return <ResetPassword />;
}
