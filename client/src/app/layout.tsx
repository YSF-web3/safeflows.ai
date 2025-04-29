import "./globals.css";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";
import { DashboardProvider } from "@/components/dashboard/dashboard-data-access";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";
import { ReactQueryProvider } from "./react-query-provider";
import { NotificationsProvider } from "@/components/notifications/alert-data-access";

export const metadata = {
  title: "SafeFlows.ai",
  description: "Description",
};

const links: { label: string; path: string; isNew?: boolean }[] = [
  { label: "Dashboard", path: "/" },
  { label: "Notifications", path: "/notifications" },
  { label: "Pools", path: "/pools" },
  { label: "MCP", path: "/mcp", isNew: true },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <DashboardProvider>
                <NotificationsProvider>
                  <UiLayout links={links}>{children}</UiLayout>
                </NotificationsProvider>
              </DashboardProvider>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
