import './globals.css'
import {ClusterProvider} from '@/components/cluster/cluster-data-access'
import { DashboardProvider } from '@/components/dashboard/dashboard-data-access'
import {SolanaProvider} from '@/components/solana/solana-provider'
import {UiLayout} from '@/components/ui/ui-layout'
import {ReactQueryProvider} from './react-query-provider'

export const metadata = {
  title: "SafeFlows.ai",
  description: "Description",
};

const links: { label: string; path: string }[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Notifications', path: '/notifications' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <DashboardProvider>
            <ClusterProvider>
              <SolanaProvider>
                <UiLayout links={links}>{children}</UiLayout>
              </SolanaProvider>
            </ClusterProvider>
          </DashboardProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
