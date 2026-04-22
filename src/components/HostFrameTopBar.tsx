import React from 'react';
import './HostFrameTopBar.css';

const IconHamburger: React.FC = () => (
  <div className="host-twilio-top__menu" aria-hidden>
    <span />
    <span />
    <span />
  </div>
);

const TwilioLogo: React.FC = () => (
  <svg className="host-twilio-top__logo" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 4h6v4H8v8H4V4zm8 0h8v4h-4v12h-4V4z" fill="currentColor" />
  </svg>
);

/**
 * Durchgehender oberer Balken (simuliertes Host-UI) — volle Fensterbreite, darunter erst CRM-Top-Nav.
 */
const HostFrameTopBar: React.FC = () => (
  <header className="host-twilio-top" role="presentation" aria-label="Simuliertes Host (Twilio FLEX)" data-simulated-host-top="true">
    <IconHamburger />
    <div className="host-twilio-top__brand">
      <TwilioLogo />
      <span>TWILIO FLEX</span>
    </div>
  </header>
);

export default HostFrameTopBar;
