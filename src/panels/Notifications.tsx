import { useState } from 'react';
import { usePet } from '../store/PetContext';

const defaultSettings = [
  { id: 'n1', label: 'Напоминание покормить', enabled: true, softPush: true },
  { id: 'n2', label: 'Прогулка', enabled: true, softPush: true },
  { id: 'n3', label: 'Ежедневный отчёт', enabled: true, softPush: true },
  { id: 'n4', label: 'Квесты', enabled: true, softPush: false },
];

export function Notifications() {
  const { state, dispatch } = usePet();
  const [settings, setSettings] = useState(defaultSettings);
  const [reportVisible, setReportVisible] = useState(false);

  const generateReport = () => {
    dispatch({
      type: 'SET_DAILY_REPORT',
      report: {
        date: new Date().toLocaleDateString('ru'),
        feedCount: state.quests.find((q) => q.type === 'feed')?.currentCount ?? 0,
        walkCount: state.quests.find((q) => q.type === 'walk')?.currentCount ?? 0,
        toiletCount: state.quests.find((q) => q.type === 'toilet')?.currentCount ?? 0,
        questsCompleted: state.quests.filter((q) => q.completed).length,
        moodSummary: `Настроение: ${state.stats.mood}, энергия ${state.stats.energy}%`,
      },
    });
    setReportVisible(true);
  };

  const report = state.dailyReport;

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>Оповещения</h1>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-soft)' }}>
        Умные «мягкие» пуши и ежедневный отчёт
      </p>

      <section className="card" style={{ marginTop: 20 }}>
        <h2 className="card-title">Настройки уведомлений</h2>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '0 0 12px' }}>
          Мягкие пуши не будят и не раздражают — показываются тихо.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {settings.map((s) => (
            <li
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid var(--accent-soft)',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                {s.softPush && (
                  <div style={{ fontSize: 11, color: 'var(--text-soft)' }}>Мягкий пуш</div>
                )}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={() =>
                    setSettings((prev) =>
                      prev.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x))
                    )
                  }
                />
                Вкл
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="card-title">Ежедневный отчёт</h2>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', margin: '0 0 12px' }}>
          Краткая сводка за день: рутина, квесты, настроение.
        </p>
        <button type="button" className="btn btn-primary" onClick={generateReport}>
          Сформировать отчёт за сегодня
        </button>

        {reportVisible && report && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              background: 'var(--pastel-peach)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid var(--accent-soft)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Отчёт за {report.date}</div>
            <div style={{ fontSize: 13 }}>
              Покормлено: {report.feedCount} · Прогулок: {report.walkCount} · Туалет: {report.toiletCount}
              <br />
              Квестов выполнено: {report.questsCompleted}
              <br />
              {report.moodSummary}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
