/**
 * Echte CRM-Berechtigung: Nur wenn `REACT_APP_CRM_ADMIN=true` gesetzt ist,
 * dürfen Nutzer Admin-Funktionen (z. B. Anruf-Einstellungen der Landingpage) sehen und bedienen.
 * In Produktion über Umgebungsvariable / Deployment steuern.
 */
export function isCrmAdminUser(): boolean {
  return process.env.REACT_APP_CRM_ADMIN === 'true';
}
