import React, { useState } from 'react';
import './Dashboard.css';

interface DashboardProps {
  userDisplayName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userDisplayName }) => {
  const [statTab, setStatTab] = useState<'meine' | 'alle'>('meine');
  const [statTab2, setStatTab2] = useState<'meine' | 'alle'>('meine');

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard – {userDisplayName}</h1>

      <div className="dashboard-grid">
        <div className="dashboard-col dashboard-col--left">
          <section className="dash-widget dash-widget--blue">
            <button type="button" className="dash-widget-head dash-widget-head--blue">
              <span>Meine heutigen WVL (0)</span>
              <span className="dash-widget-chevron" aria-hidden="true">
                ›
              </span>
            </button>
            <div className="dash-widget-body">
              <p className="dash-empty-msg">
                Keine offenen Aufgaben. Sie haben alle Ihre Aufgaben bearbeitet. Herzlichen Dank dafür! :-)
              </p>
            </div>
          </section>

          <section className="dash-widget dash-widget--blue">
            <button type="button" className="dash-widget-head dash-widget-head--blue">
              <span>Meine offenen Anfragen (1)</span>
              <span className="dash-widget-chevron" aria-hidden="true">
                ›
              </span>
            </button>
            <div className="dash-widget-body dash-widget-body--table">
              <div className="dash-filters">
                <label className="dash-filter-field">
                  <span>Start-Datum</span>
                  <input type="text" placeholder="" readOnly className="dash-filter-input" />
                </label>
                <span className="dash-filter-bis">bis</span>
                <label className="dash-filter-field">
                  <span>Ende-Datum</span>
                  <input type="text" placeholder="" readOnly className="dash-filter-input" />
                </label>
                <label className="dash-filter-field dash-filter-field--grow">
                  <span className="sr-only">Suche</span>
                  <input
                    type="search"
                    placeholder="Vor-, Nach-, Produktname"
                    className="dash-filter-input dash-filter-input--search"
                  />
                </label>
              </div>
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Interesse an</th>
                      <th>Interner Kommentar</th>
                      <th className="dash-table-actions-head" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Test</td>
                      <td>Haushaltshilfe</td>
                      <td />
                      <td className="dash-table-actions">
                        <select className="dash-page-size" defaultValue="20" aria-label="Zeilen pro Seite">
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                        <button type="button" className="dash-icon-btn dash-icon-btn--save" title="Speichern">
                          💾
                        </button>
                        <button type="button" className="dash-icon-btn" title="Öffnen">
                          ↗
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="dash-pagination">
                <button type="button" className="dash-page-btn" aria-label="Zurück">
                  ‹
                </button>
                <span className="dash-page-current">1</span>
                <button type="button" className="dash-page-btn" aria-label="Weiter">
                  ›
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-col dashboard-col--right">
          <section className="dash-widget dash-widget--purple">
            <button type="button" className="dash-widget-head dash-widget-head--purple">
              <span>Meine Statistik (13. März 2026 – 20. März 2026)</span>
              <span className="dash-widget-chevron" aria-hidden="true">
                ›
              </span>
            </button>
            <div className="dash-widget-body dash-widget-body--stat">
              <div className="dash-stat-toolbar">
                <div className="dash-stat-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={statTab === 'meine'}
                    className={statTab === 'meine' ? 'is-active' : ''}
                    onClick={() => setStatTab('meine')}
                  >
                    Meine
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={statTab === 'alle'}
                    className={statTab === 'alle' ? 'is-active' : ''}
                    onClick={() => setStatTab('alle')}
                  >
                    Alle
                  </button>
                </div>
                <button type="button" className="dash-stat-refresh" title="Aktualisieren" aria-label="Aktualisieren">
                  ⟳
                </button>
              </div>
              <div className="dash-chart" aria-hidden="true">
                <div className="dash-chart-inner">
                  <div className="dash-chart-y-labels">
                    <span>1</span>
                    <span>0</span>
                  </div>
                  <div className="dash-chart-plot">
                    <div className="dash-chart-grid" />
                    <svg className="dash-chart-svg" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <line
                        x1="0"
                        y1="80"
                        x2="400"
                        y2="80"
                        stroke="#4caf50"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="dash-chart-x">
                      {['13.3.', '14.3.', '15.3.', '16.3.', '17.3.', '18.3.', '19.3.', '20.3.'].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="dash-chart-legend">
                  <span className="dash-legend-swatch" /> Zahlungseingänge
                </div>
              </div>
              <div className="dash-stat-dates">
                <input type="text" className="dash-date-input" defaultValue="13.03.26" readOnly aria-label="Von" />
                <span>bis</span>
                <input type="text" className="dash-date-input" defaultValue="20.03.26" readOnly aria-label="Bis" />
              </div>
            </div>
          </section>

          <section className="dash-widget dash-widget--purple">
            <button type="button" className="dash-widget-head dash-widget-head--purple">
              <span>Meine Statistik</span>
              <span className="dash-widget-chevron" aria-hidden="true">
                ›
              </span>
            </button>
            <div className="dash-widget-body dash-widget-body--stat">
              <div className="dash-stat-toolbar">
                <div className="dash-stat-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={statTab2 === 'meine'}
                    className={statTab2 === 'meine' ? 'is-active' : ''}
                    onClick={() => setStatTab2('meine')}
                  >
                    Meine
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={statTab2 === 'alle'}
                    className={statTab2 === 'alle' ? 'is-active' : ''}
                    onClick={() => setStatTab2('alle')}
                  >
                    Alle
                  </button>
                </div>
                <button type="button" className="dash-stat-refresh" title="Aktualisieren" aria-label="Aktualisieren">
                  ⟳
                </button>
              </div>
              <div className="dash-chart dash-chart--compact" aria-hidden="true">
                <div className="dash-chart-inner">
                  <div className="dash-chart-y-labels">
                    <span>1</span>
                    <span>0</span>
                  </div>
                  <div className="dash-chart-plot">
                    <div className="dash-chart-grid" />
                    <svg className="dash-chart-svg" viewBox="0 0 400 80" preserveAspectRatio="none">
                      <line
                        x1="0"
                        y1="55"
                        x2="400"
                        y2="55"
                        stroke="#4caf50"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="dash-chart-x">
                      {['13.3.', '14.3.', '15.3.', '16.3.', '17.3.', '18.3.', '19.3.', '20.3.'].map((d) => (
                        <span key={`b-${d}`}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="dash-chart-legend">
                  <span className="dash-legend-swatch" /> Zahlungseingänge
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
