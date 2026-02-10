import { usePet } from '../store/PetContext';

export function Casket() {
  const { state, dispatch } = usePet();
  const { roomItems } = state;

  const toggleEquip = (id: string, equipped: boolean) => {
    dispatch({ type: 'EQUIP_ITEM', itemId: id, equipped });
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Шкатулка</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Предметы и комната (витрина)
      </p>

      {/* Витрина — комната */}
      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Комната</h2>
        <div
          style={{
            minHeight: 140,
            background: 'linear-gradient(180deg, var(--pastel-peach) 0%, var(--pastel-lavender) 100%)',
            borderRadius: 'var(--radius-sm)',
            padding: 20,
            position: 'relative',
          }}
        >
          <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 8 }}>🐣</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {roomItems.filter((i) => i.equipped).map((i) => (
              <span
                key={i.id}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: '0 2px 8px var(--shadow)',
                }}
              >
                {i.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Предметы в шкатулке</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {roomItems.map((i) => (
            <li
              key={i.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: i.equipped ? 'var(--pastel-mint)' : 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 8,
              }}
            >
              <div>
                <span style={{ marginRight: 8 }}>{i.type === 'toy' ? '🧸' : i.type === 'decoration' ? '🖼️' : '🪑'}</span>
                <span style={{ fontWeight: 600 }}>{i.name}</span>
                {!i.unlocked && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-soft)' }}>(заблокировано)</span>}
              </div>
              {i.unlocked && (
                <button
                  type="button"
                  className="btn btn-soft"
                  style={{ padding: '6px 12px', fontSize: 12 }}
                  onClick={() => toggleEquip(i.id, !i.equipped)}
                >
                  {i.equipped ? 'Снять' : 'Надеть'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
