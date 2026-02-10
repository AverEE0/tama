import { usePet } from '../store/PetContext';
import type { AgeStage } from '../types';

const ageLabels: Record<AgeStage, string> = {
  egg: 'Яйцо',
  baby: 'Малыш',
  child: 'Ребёнок',
  teen: 'Подросток',
  adult: 'Взрослый',
  elder: 'Пожилой',
};

export function Skills() {
  const { state, dispatch } = usePet();
  const { stats, skills } = state;

  const unlock = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill || skill.unlocked) return;
    const parentsOk = skill.parentIds.every((pid) => skills.find((s) => s.id === pid)?.unlocked);
    const ageOk = !skill.requiredAge || skill.requiredAge === stats.ageStage;
    if (parentsOk && ageOk) dispatch({ type: 'UNLOCK_SKILL', skillId: id });
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Умения</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Дерево навыков и возрастные этапы
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Возрастной этап</h2>
        <div
          style={{
            padding: 16,
            background: 'var(--pastel-lavender)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {ageLabels[stats.ageStage]}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '12px 0 0' }}>
          Этап влияет на доступные навыки. Питомец растёт со временем и заботой.
        </p>
      </section>

      <section className="card">
        <h2 className="card-title">Дерево навыков</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {skills.map((s) => {
            const canUnlock =
              !s.unlocked &&
              s.parentIds.every((pid) => skills.find((p) => p.id === pid)?.unlocked) &&
              (!s.requiredAge || s.requiredAge === stats.ageStage);
            return (
              <div
                key={s.id}
                style={{
                  padding: 14,
                  background: s.unlocked ? 'var(--pastel-mint)' : 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: s.unlocked ? '2px solid var(--pastel-mint)' : '2px solid var(--accent-soft)',
                  opacity: s.unlocked ? 1 : canUnlock ? 1 : 0.7,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{s.description}</div>
                    {s.requiredAge && (
                      <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 4 }}>
                        Этап: {ageLabels[s.requiredAge]}
                      </div>
                    )}
                  </div>
                  {s.unlocked ? (
                    <span style={{ color: 'var(--accent-dark)', fontWeight: 700 }}>✓</span>
                  ) : canUnlock ? (
                    <button
                      type="button"
                      className="btn btn-soft"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={() => unlock(s.id)}
                    >
                      Открыть
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
