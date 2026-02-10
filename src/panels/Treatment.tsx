import { useState } from 'react';
import { usePet } from '../store/PetContext';

const PILLS = 6;
const TARGET = 3;

export function Treatment() {
  const { state, dispatch } = usePet();
  const [gameStarted, setGameStarted] = useState(false);
  const [picks, setPicks] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const health = state.stats.health;
  const isSick = state.stats.status === 'sick' || health < 100;

  const startGame = () => {
    setGameStarted(true);
    setPicks([]);
    setDone(false);
  };

  const togglePill = (index: number) => {
    if (done) return;
    setPicks((prev) => {
      const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      if (next.length >= TARGET) {
        setDone(true);
        dispatch({ type: 'HEAL', amount: 25 });
        dispatch({ type: 'SET_STATS', payload: { status: 'healthy' } });
      }
      return next;
    });
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Лечение</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Мини-игра «Аптечка» и восстановление
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Здоровье</h2>
        <div className="bar-wrap">
          <div className="bar-fill health" style={{ width: `${health}%` }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 8 }}>
          {isSick ? 'Питомцу нужна помощь. Собери таблетки в мини-игре!' : 'Всё в порядке.'}
        </p>
      </section>

      <section className="card">
        <h2 className="card-title">Мини-игра: Аптечка</h2>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '0 0 12px' }}>
          Выбери {TARGET} правильные таблетки (любые три). За успех +25 к здоровью.
        </p>

        {!gameStarted ? (
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Начать игру
          </button>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {Array.from({ length: PILLS }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => togglePill(i)}
                  disabled={done}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 12,
                    border: picks.includes(i) ? '3px solid var(--accent-dark)' : '2px solid var(--accent-soft)',
                    background: picks.includes(i) ? 'var(--accent-soft)' : 'var(--bg-card)',
                    fontSize: 28,
                    cursor: done ? 'default' : 'pointer',
                  }}
                >
                  💊
                </button>
              ))}
            </div>
            {done && (
              <p style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>
                Готово! Здоровье восстановлено.
              </p>
            )}
            <button
              type="button"
              className="btn btn-soft"
              style={{ marginTop: 8 }}
              onClick={startGame}
            >
              Играть снова
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
