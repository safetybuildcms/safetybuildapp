import { Outlet } from 'react-router-dom'
import { AppShell } from '@mantine/core'

export default function Layout() {
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm' }} padding='md'>
      <AppShell.Header>{/* Add your header content */}</AppShell.Header>

      <AppShell.Navbar>{/* Add your navigation content */}</AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
