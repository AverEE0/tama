import React, { useState, useEffect } from 'react';
import { PetProvider } from './store/PetContext';
import { Home } from './panels/Home';
import { Routine } from './panels/Routine';
import { Skills } from './panels/Skills';
import { Notifications } from './panels/Notifications';
import { Casket } from './panels/Casket';
import { Memory } from './panels/Memory';
import { Treatment } from './panels/Treatment';

const panels: { path: string; label: string; icon: string; Panel: () => React.ReactElement }[] = [
  { path: '/', label: 'Главная', icon: '🐣', Panel: Home },
  { path: '/routine', label: 'Рутина', icon: '🍽️', Panel: Routine },
  { path: '/skills', label: 'Умения', icon: '🌟', Panel: Skills },
  { path: '/notifications', label: 'Оповещения', icon: '🔔', Panel: Notifications },
  { path: '/casket', label: 'Шкатулка', icon: '📦', Panel: Casket },
  { path: '/memory', label: 'Память', icon: '📷', Panel: Memory },
  { path: '/treatment', label: 'Лечение', icon: '💊', Panel: Treatment },
];

function getHash() {
  return typeof window !== 'undefined' ? window.location.hash.slice(1) || '/' : '/';
}

function Router() {
  const [hash, setHash] = useState(getHash);

  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const current = panels.find((p) => p.path === hash) ?? panels[0];
  const Panel = current.Panel;

  return (
    <>
      <main className="page-transition-enter" key={current.path}>
        <Panel />
      </main>
      <nav className="nav-bottom">
        {panels.map((p) => (
          <a
            key={p.path}
            href={`#${p.path}`}
            className={p.path === current.path ? 'active' : ''}
            title={p.label}
          >
            <span className="icon">{p.icon}</span>
            <span>{p.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

export default function App() {
  return (
    <PetProvider>
      <Router />
    </PetProvider>
  );
}
