// The header owns responsive navigation state so the page shell remains small.
import { ArrowUpRight, Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Operations', href: '#operations' },
  { label: 'Impact', href: '#impact' },
  { label: 'Access', href: '#access' },
  { label: 'Workspace', href: '#workspace' },
  { label: 'Partner', href: '#partner' }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Agricore home">
        <span className="brand-mark">
          <Leaf size={20} />
        </span>
        <span>Agricore</span>
      </a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-action" href="#partner">
        <span>Start partnership</span>
        <ArrowUpRight size={17} />
      </a>
      <button
        className="icon-button menu-button"
        type="button"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
