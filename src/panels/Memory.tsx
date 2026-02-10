import { usePet } from '../store/PetContext';

export function Memory() {
  const { state, addMoment } = usePet();
  const { moments } = state;

  const addDemo = () => {
    addMoment({
      date: Date.now(),
      title: 'Хороший день',
      description: 'Погуляли и поели вместе.',
      type: 'moment',
    });
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Память</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Альбом моментов и открытки
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Альбом моментов</h2>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '0 0 12px' }}>
          Сохраняй важные события и открытки.
        </p>
        <button type="button" className="btn btn-soft" onClick={addDemo}>
          + Добавить момент (демо)
        </button>
      </section>

      <section className="card">
        <h2 className="card-title">Моменты и открытки</h2>
        {moments.length === 0 ? (
          <p style={{ color: 'var(--text-soft)', fontSize: 13 }}>Пока пусто. Выполняй квесты и сохраняй моменты!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {moments.map((m) => (
              <li
                key={m.id}
                style={{
                  padding: 14,
                  background: m.type === 'postcard' ? 'var(--pastel-yellow)' : 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 10,
                  border: m.type === 'postcard' ? '2px dashed var(--accent)' : 'none',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{m.description}</div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 6 }}>
                  {new Date(m.date).toLocaleString('ru')} · {m.type === 'postcard' ? '🖼️ Открытка' : '📷 Момент'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
