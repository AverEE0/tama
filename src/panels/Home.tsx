import { useEffect } from 'react';
import { usePet } from '../store/PetContext';
import { getRandom, moodReplicas, actionReplicas } from '../data/replicas';
import type { PetStatus, Mood } from '../types';

const statusLabels: Record<PetStatus, string> = {
  healthy: 'Здоров',
  sick: 'Болен',
  tired: 'Устал',
  hungry: 'Голоден',
  happy: 'Счастлив',
};

const moodLabels: Record<Mood, string> = {
  joy: 'Радость',
  calm: 'Спокойствие',
  sad: 'Грусть',
  excited: 'Возбуждение',
  sleepy: 'Сонливость',
  neutral: 'Обычное',
};

export function Home() {
  const { state, setReplica, setLastAction } = usePet();
  const { stats, currentReplica, lastAction } = state;

  useEffect(() => {
    if (lastAction && actionReplicas[lastAction]) {
      setReplica(getRandom(actionReplicas[lastAction]));
      setLastAction(null);
      const t = setTimeout(() => setReplica(null), 3000);
      return () => clearTimeout(t);
    }
  }, [lastAction, setReplica, setLastAction]);

  useEffect(() => {
    if (currentReplica || lastAction) return;
    const phrases = moodReplicas[stats.mood];
    const id = setInterval(() => {
      setReplica(getRandom(phrases));
      setTimeout(() => setReplica(null), 4000);
    }, 8000);
    return () => clearInterval(id);
  }, [stats.mood, setReplica, lastAction, currentReplica]);

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>
        {stats.name}
      </h1>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-soft)' }}>
        {statusLabels[stats.status]} · {moodLabels[stats.mood]}
      </p>

      {/* 1) Игровая статистика */}
      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="card-title">Статистика</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Энергия</div>
            <div className="bar-wrap">
              <div className="bar-fill energy" style={{ width: `${stats.energy}%` }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Сытость</div>
            <div className="bar-wrap">
              <div className="bar-fill hunger" style={{ width: `${stats.hunger}%` }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Чистота</div>
            <div className="bar-wrap">
              <div className="bar-fill cleanliness" style={{ width: `${stats.cleanliness}%` }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Счастье</div>
            <div className="bar-wrap">
              <div className="bar-fill happiness" style={{ width: `${stats.happiness}%` }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>Здоровье</div>
            <div className="bar-wrap">
              <div className="bar-fill health" style={{ width: `${stats.health}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Питомец + реплика (общение) */}
      <section className="pet-area">
        <div className="pet-avatar">🐣</div>
        <div className="pet-replica">
          {currentReplica || '...'}
        </div>
      </section>

      {/* Быстрые действия — рутина */}
      <section className="card">
        <h2 className="card-title">Быстрые действия</h2>
        <div className="actions-grid">
          <a href="#/routine" style={{ textDecoration: 'none' }}>
            <button type="button" className="action-btn">
              <span className="icon">🍽️</span>
              <span>Покормить</span>
            </button>
          </a>
          <a href="#/routine" style={{ textDecoration: 'none' }}>
            <button type="button" className="action-btn">
              <span className="icon">🚽</span>
              <span>Туалет</span>
            </button>
          </a>
          <a href="#/routine" style={{ textDecoration: 'none' }}>
            <button type="button" className="action-btn">
              <span className="icon">🚶</span>
              <span>Прогулка</span>
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
