import React from 'react';
import './HostFrameSidebar.css';

const stroke = 1.5;

const IconDb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v4c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    <path d="M5 10v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4" />
  </svg>
);

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 12l10 5 10-5" />
    <path d="M2 17l10 5 10-5" />
  </svg>
);

const IconUserGear = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <circle cx="8.5" cy="6.5" r="2.6" />
    <path d="M3.5 20v-1.2c0-2 1.8-3.5 5-3.5s5 1.5 5 3.5V20" />
    <g transform="translate(16, 12) scale(0.45)">
      <circle r="3" />
      <path d="M0-3.5v2.2M0 1.3v2.2M-3.1-1.1l1.9 1.1M1.1-1.1L3-2.2M-3.1 1.1L-1.2.2M1.1 1.1L3 2.2" strokeWidth="1.4" />
    </g>
  </svg>
);

const IconLayout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="9" x2="9" y2="21" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <line x1="12" y1="7" x2="12" y2="7.01" />
  </svg>
);

const IconCog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <rect x="4" y="12" width="4" height="8" rx="0.5" />
    <rect x="10" y="8" width="4" height="12" rx="0.5" />
    <rect x="16" y="4" width="4" height="16" rx="0.5" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} aria-hidden>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconPhoneBlue = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
    <path
      d="M6.5 2h3.5l1.5 4.5-2 1.2c.6 1.2 1.3 2.3 2.1 3.1.8.8 1.9 1.5 3.1 2.1l1.2-2L22 12.5V16c0 1-1 2-2.5 2.1C9.8 18.5 3.5 10.2 3.4 4.5 3.3 3 4.2 2 5.2 2h1.3z"
      fill="currentColor"
    />
  </svg>
);

const IconPhoneOutgoing = () => (
  <svg viewBox="0 0 64 64" width="68" height="68" fill="currentColor" aria-hidden>
    <g transform="translate(2, 6) scale(1.85)">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </g>
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(28, 4)"
    >
      <line x1="0" y1="22" x2="20" y2="2" />
      <line x1="20" y1="2" x2="8" y2="2" />
      <line x1="20" y1="2" x2="20" y2="16" />
    </g>
  </svg>
);

const IconBell = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M6 8a6 6 0 1112 0c0 3 2 3 2 5H4c0-2 2-2 2-5" />
    <path d="M9 20h6" />
  </svg>
);

const IconHangup = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M3 3l4 4c-1 2-1.4 3.2-1.4 5.4 0 3.1 1.1 4.8 2.1 5.6 1.5 1.1 2.2 1.1 2.2 1.1h4.2s.7 0 2.2-1.1c1-0.8 2.1-2.5 2.1-5.6 0-2.2-.4-3.4-1.4-5.4l4-4" />
  </svg>
);

const railItems: { key: string; node: React.ReactNode; active?: boolean }[] = [
  { key: 'db', node: <IconDb /> },
  { key: 'layers', node: <IconLayers />, active: true },
  { key: 'user', node: <IconUserGear /> },
  { key: 'layout', node: <IconLayout /> },
  { key: 'info', node: <IconInfo /> },
  { key: 'cog', node: <IconCog /> },
  { key: 'bars', node: <IconBarChart /> },
  { key: 'eye', node: <IconEye /> }
];

const DEMO_NUMBER = '+49 176 56813844';
const CALLER_ID = '+49 6131 4932003';

const HostFrameSidebar: React.FC = () => (
  <div className="host-frame" data-simulated-host="true" role="complementary" aria-label="Simuliertes Twilio-Flex-Panel (nur Darstellung)">
    <div className="host-frame__body">
      <nav className="host-frame__rail" aria-hidden>
        {railItems.map((item) => (
          <div
            key={item.key}
            className={
              item.active
                ? 'host-frame__rail-icon host-frame__rail-icon--active'
                : 'host-frame__rail-icon'
            }
          >
            {item.node}
          </div>
        ))}
      </nav>

      <div className="host-frame__main">
        <div className="host-frame__notice">
          <span className="host-frame__notice-icon" aria-hidden>
            <IconBell />
          </span>
          <span>We need your permission to enable…</span>
        </div>

        <div className="host-frame__callbar">
          <span className="host-frame__phone-blue" aria-hidden>
            <IconPhoneBlue />
          </span>
          <div className="host-frame__callbar-mid">
            <span className="host-frame__num-small">{DEMO_NUMBER}</span>
            <span className="host-frame__status">Connecting call…</span>
          </div>
          <button type="button" className="host-frame__hang-sm" tabIndex={-1} aria-hidden>
            <IconHangup />
          </button>
        </div>

        <div className="host-frame__spacer" aria-hidden>
          <span className="host-frame__grip" />
        </div>

        <div className="host-frame__status-block">
          <div className="host-frame__klingel">Klingelzeit</div>
          <div className="host-frame__timer" aria-hidden>
            00:00:07
          </div>
          <div className="host-frame__num-lg">{DEMO_NUMBER}</div>
          <div className="host-frame__tabs">
            <button type="button" className="host-frame__tab host-frame__tab--active" tabIndex={-1}>
              Call
            </button>
            <button type="button" className="host-frame__tab" tabIndex={-1}>
              Info
            </button>
          </div>
        </div>

        <section className="host-frame__connecting">
          <h2 className="host-frame__connecting-title">CONNECTING CALL</h2>
          <div className="host-frame__connecting-ico" aria-hidden>
            <IconPhoneOutgoing />
          </div>
          <p className="host-frame__connecting-num">{DEMO_NUMBER}</p>
          <div className="host-frame__meta">
            <div>Your caller ID: {CALLER_ID}</div>
            <div>Queue: Outbound Call</div>
          </div>
          <button type="button" className="host-frame__hang-lg" tabIndex={-1} aria-hidden>
            <IconHangup />
          </button>
        </section>
      </div>
    </div>
  </div>
);

export default HostFrameSidebar;
