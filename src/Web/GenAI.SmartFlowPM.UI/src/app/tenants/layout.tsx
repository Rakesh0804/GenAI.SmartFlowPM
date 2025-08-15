import { AppLayout } from '../../components/layout';

export default function TenantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
