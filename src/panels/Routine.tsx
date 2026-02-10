import { usePet } from '../store/PetContext';
import { getRandom, actionReplicas } from '../data/replicas';

export function Routine() {
  const { state, doRoutine, setReplica } = usePet();
  const { quests } = state;

  const handleAction = (action: 'feed' | 'toilet' | 'walk') => {
    doRoutine(action);
    const phrases = actionReplicas[action];
    if (phrases) setReplica(getRandom(phrases));
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Рутина дня</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Покорми, выгуляй и следи за туалетом
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Действия</h2>
        <div className="actions-grid">
          <button type="button" className="action-btn" onClick={() => handleAction('feed')}>
            <span className="icon">🍽️</span>
            <span>Покормить</span>
          </button>
          <button type="button" className="action-btn" onClick={() => handleAction('toilet')}>
            <span className="icon">🚽</span>
            <span>Туалет</span>
          </button>
          <button type="button" className="action-btn" onClick={() => handleAction('walk')}>
            <span className="icon">🚶</span>
            <span>Прогулка</span>
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Мини-квесты</h2>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '0 0 12px' }}>
          Выполняй действия — квесты обновятся автоматически.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {quests.map((q) => (
            <li
              key={q.id}
              style={{
                padding: '12px',
                background: q.completed ? 'var(--pastel-mint)' : 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 8,
                border: q.completed ? '2px solid var(--pastel-mint)' : '2px solid transparent',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>{q.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{q.description}</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>
                {q.completed ? '✅ Выполнено' : `${q.currentCount}/${q.targetCount} · Награда: ${q.reward}`}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
