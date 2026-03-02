import { NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Hem' },
  { to: '/tokens', label: 'Token-sannolikheter' },
  { to: '/vectors', label: 'Vektorrymd' },
]

export function Navigation() {
  return (
    <nav className="flex gap-6">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `text-sm transition-colors ${
              isActive
                ? 'text-uu-red font-semibold'
                : 'text-uu-dark hover:text-uu-red'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
