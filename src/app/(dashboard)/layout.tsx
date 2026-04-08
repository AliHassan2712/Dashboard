import DashboardLayoutClient from "@/src/components/shared/DashboardLayoutClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}