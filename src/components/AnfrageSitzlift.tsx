import React, { useState, useRef, useEffect } from 'react';
import './AnfrageSitzlift.css';

// SelectField Component für Single- und Multiselect
interface SelectFieldProps {
  name: string;
  value: string | string[];
  onChange: (name: string, value: string | string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  multiple?: boolean;
  label: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Auswählen',
  multiple = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [];
  const singleValue = multiple ? '' : (typeof value === 'string' ? value : '');

  // Schließe Dropdown wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        // Entfernen wenn bereits ausgewählt
        onChange(name, currentValues.filter(v => v !== optionValue));
      } else {
        // Hinzufügen
        onChange(name, [...currentValues, optionValue]);
      }
    } else {
      onChange(name, optionValue);
      setIsOpen(false);
    }
  };

  const removeSelected = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(name, value.filter(v => v !== valueToRemove));
    } else if (!multiple) {
      // Für Single-Select: Wert zurücksetzen
      onChange(name, '');
    }
  };

  const getSelectedLabel = () => {
    if (multiple) {
      return selectedValues.length > 0 ? `${selectedValues.length} ausgewählt` : '';
    } else {
      const selectedOption = options.find(opt => opt.value === singleValue);
      return selectedOption ? selectedOption.label : '';
    }
  };

  const getSelectedTags = () => {
    if (multiple) {
      return selectedValues.map(val => {
        const option = options.find(opt => opt.value === val);
        return { value: val, label: option?.label || val };
      });
    } else {
      if (singleValue) {
        const option = options.find(opt => opt.value === singleValue);
        return option ? [{ value: singleValue, label: option.label }] : [];
      }
      return [];
    }
  };

  const selectedTags = getSelectedTags();

  return (
    <div className={`form-group ${multiple ? 'multiselect-group' : 'singleselect-group'}`}>
      <label>{label}</label>
      <div className="custom-multiselect-wrapper" ref={dropdownRef}>
        <div 
          className={`custom-multiselect ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
        >
          <div className="multiselect-input">
            {selectedTags.length > 0 ? (
              <div className="tags-container">
                {selectedTags.map(tag => (
                  <span key={tag.value} className="input-tag">
                    {tag.label}
                    <button
                      type="button"
                      onClick={(e) => removeSelected(e, tag.value)}
                      className="tag-remove-btn"
                      aria-label="Entfernen"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="placeholder-text">{placeholder}</span>
            )}
          </div>
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isOpen && (
          <div className="dropdown-menu">
            {options.map(option => {
              const isSelected = multiple 
                ? selectedValues.includes(option.value)
                : singleValue === option.value;
              return (
                <div
                  key={option.value}
                  className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className="checkbox-indicator">
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Gesprächsguidance-Komponente
interface GuidanceTip {
  title: string;
  question: string;
  followUp?: string;
  tip?: string;
}

interface GuidanceSection {
  id: string;
  title: string;
  icon: string;
  tips: GuidanceTip[];
}

const guidanceData: GuidanceSection[] = [
  {
    id: 'klient',
    title: 'Klient / Interessent',
    icon: '👤',
    tips: [
      {
        title: 'Anrede & Name',
        question: 'Wie darf ich Sie ansprechen? Frau oder Herr?',
        followUp: 'Können Sie mir bitte Ihren vollständigen Namen nennen?',
        tip: 'Höflich nachfragen und auf akademische Titel achten.'
      },
      {
        title: 'Kontaktdaten',
        question: 'Unter welcher E-Mail-Adresse kann ich Sie erreichen?',
        followUp: 'Welche Telefonnummer ist für Rückfragen am besten erreichbar?',
        tip: 'Mehrere Kontaktmöglichkeiten erfragen für bessere Erreichbarkeit.'
      },
      {
        title: 'Interner Kommentar',
        question: 'Gibt es noch wichtige Informationen, die ich wissen sollte?',
        tip: 'Besondere Umstände, Terminwünsche oder Anmerkungen notieren.'
      }
    ]
  },
  {
    id: 'senior',
    title: 'Senior',
    icon: '👴',
    tips: [
      {
        title: 'Beziehung',
        question: 'In welcher Beziehung stehen Sie zu dem Senior?',
        followUp: 'Sind Sie der Sohn, die Tochter, der Ehepartner?',
        tip: 'Die Beziehung hilft, die Situation besser einzuschätzen.'
      },
      {
        title: 'Pflegegrad',
        question: 'Welchen Pflegegrad hat der Senior aktuell?',
        followUp: 'Wurde bereits eine Erhöhung des Pflegegrades beantragt?',
        tip: 'Falls unbekannt, nach Pflegegradbescheid fragen.'
      },
      {
        title: 'Medizinischer Hintergrund',
        question: 'Gibt es relevante medizinische Einschränkungen?',
        followUp: 'Zum Beispiel: Körperliche Einschränkungen, Altersschwäche, Demenz?',
        tip: 'Mehrere Optionen können zutreffen - alle relevanten nennen lassen.'
      },
      {
        title: 'Mobilität',
        question: 'Wie ist die Mobilität des Seniors einzuschätzen?',
        followUp: 'Kann er/sie noch Treppen steigen? Benötigt er/sie Gehhilfen?',
        tip: 'Wichtig für die Produktauswahl - genau nachfragen.'
      },
      {
        title: 'Barrierefreiheit',
        question: 'Wie ist die Wohnsituation hinsichtlich Barrierefreiheit?',
        followUp: 'Gibt es einen Aufzug? Ist die Wohnung rollstuhlgerecht?',
        tip: 'Mehrere Aspekte können relevant sein - alle erfragen.'
      },
      {
        title: 'Wohnsituation',
        question: 'Wo wohnt der Senior aktuell?',
        followUp: 'Eigene Wohnung, bei Angehörigen, im Pflegeheim?',
        tip: 'Wichtig für die Planung der Installation.'
      },
      {
        title: 'Aktuelle Versorgung',
        question: 'Wie wird der Senior aktuell versorgt?',
        followUp: 'Pflegedienst, Angehörige, Tagespflege?',
        tip: 'Mehrere Versorgungsformen können parallel bestehen.'
      }
    ]
  }
];

const Gespraechsguidance: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const currentGuidance = guidanceData.find(g => g.id === activeSection) || guidanceData[0];

  return (
    <div className="guidance-sidebar">
      <div className="guidance-header">
        <span className="guidance-icon">💡</span>
        <h3>Gesprächsguidance</h3>
      </div>
      <div className="guidance-content">
        <div className="guidance-section-header">
          <span className="section-icon">{currentGuidance.icon}</span>
          <h4>{currentGuidance.title}</h4>
        </div>
        <div className="guidance-tips">
          {currentGuidance.tips.map((tip, index) => (
            <div key={index} className="guidance-tip">
              <div className="tip-title">{tip.title}</div>
              <div className="tip-question">
                <strong>Frage:</strong> {tip.question}
              </div>
              {tip.followUp && (
                <div className="tip-followup">
                  <strong>Nachfrage:</strong> {tip.followUp}
                </div>
              )}
              {tip.tip && (
                <div className="tip-hint">
                  <span className="hint-icon">💡</span>
                  {tip.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnfrageSitzlift: React.FC = () => {
  const [formData, setFormData] = useState({
    // Active section for guidance
    activeGuidanceSection: 'klient',
    // Klient/Interessent Felder (jetzt oben)
    anrede: 'Herr',
    akademGrad: '',
    vorname: 'test',
    nachname: 'test',
    email: 'demo@test.de',
    telefon: '',
    internerKommentar: '',
    
    // Senior Felder
    beziehung: '', // Single-Select
    pflegegrad: '', // Single-Select
    medizinischerHintergrund: [] as string[], // Multiselect
    erhoehungBeantragt: false,
    mobilitaet: '', // Single-Select
    barrierefreiheit: [] as string[], // Multiselect
    wohnsituation: [] as string[], // Multiselect
    aktuelleVersorgung: [] as string[], // Multiselect
    seniorAnrede: '',
    seniorAkademGrad: '',
    seniorVorname: '',
    seniorNachname: '',
    alter: '',
    postleitzahl: '',
    region: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="anfrage-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <span>Pflegehilfe CRM</span>
          </div>
          <div className="nav-links">
            <a href="#">Dashboard</a>
            <a href="#">Klienten</a>
            <a href="#">Anbieter</a>
          </div>
        </div>
        <div className="nav-right">
          <button className="nav-btn green">Neue Anfrage →</button>
          <button className="nav-btn green">Neue Aufgabe →</button>
          <button className="nav-btn green">Neuer Sozialdienst →</button>
          <div className="user-menu">
            <span>Hallo Hannah Venohr</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area - verschoben nach rechts */}
      <div className="main-content-wrapper">
        {/* Gesprächsguidance Sidebar */}
        <Gespraechsguidance activeSection={formData.activeGuidanceSection} />

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="content-header">
            <h1>Anfrage zu Sitzlift in Erstellt: 19. Januar 2026 13:54</h1>
            <div className="header-actions">
              <button className="btn-yellow">
                <span className="icon star-icon">★</span>
                <span>Bewertung</span>
              </button>
              <button className="btn-red">
                <span className="icon">🗑️</span>
                <span>Klienten löschen</span>
              </button>
              <button className="btn-dropdown">
                <span>Aktionen</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <button className="btn-green">
                <span className="icon">+</span>
                <span>Senior hinzufügen</span>
              </button>
              <button className="btn-orange">Schließen</button>
              <button className="btn-blue">
                <span>Freigeben</span>
                <span className="icon">→</span>
              </button>
            </div>
          </div>

          {/* Vermittlungsgarantie Info */}
          <div className="vermittlungsgarantie-info">
            <span className="info-icon">ℹ️</span>
            <span>Vermittlungsgarantie für Sitzlift gebucht</span>
          </div>

          {/* Klient/Interessent Section - jetzt oben */}
          <div 
            className="section klient-section"
            onMouseEnter={() => setFormData(prev => ({ ...prev, activeGuidanceSection: 'klient' }))}
          >
            <div className="section-header green">
              <h2>Klient / Interessent</h2>
              <div className="section-actions">
                <button className="icon-btn">🔄</button>
                <button className="icon-btn">🏠</button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label>Anrede</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="anrede" 
                        value="Frau" 
                        checked={formData.anrede === 'Frau'}
                        onChange={handleChange}
                      />
                      Frau
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="anrede" 
                        value="Herr" 
                        checked={formData.anrede === 'Herr'}
                        onChange={handleChange}
                      />
                      Herr
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Akadem.</label>
                  <input 
                    type="text" 
                    name="akademGrad"
                    value={formData.akademGrad}
                    onChange={handleChange}
                    placeholder="Akademischer Grad angeben"
                  />
                </div>
                <div className="form-group">
                  <label>Vorname</label>
                  <input 
                    type="text" 
                    name="vorname"
                    value={formData.vorname}
                    onChange={handleChange}
                    placeholder="Vorname angeben"
                  />
                </div>
                <div className="form-group">
                  <label>Nachname</label>
                  <input 
                    type="text" 
                    name="nachname"
                    value={formData.nachname}
                    onChange={handleChange}
                    placeholder="Nachname angeben"
                  />
                </div>
              </div>
              <div className="form-row three-columns">
                <div className="form-group">
                  <label>E-Mail</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-Mail angeben"
                  />
                </div>
                <div className="form-group phone-group">
                  <label>Telefonnummer</label>
                  <div className="phone-input-wrapper">
                    <button className="btn-blue">+ Neue Nummer</button>
                    {!formData.telefon && (
                      <span className="error-message">Eine Telefonnummer ist erforderlich.</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Interner Kommentar (Klient)</label>
                  <textarea 
                    name="internerKommentar"
                    value={formData.internerKommentar}
                    onChange={handleChange}
                    placeholder="Internes bitte hier eintragen"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Senior Section */}
          <div 
            className="section senior-section"
            onMouseEnter={() => setFormData(prev => ({ ...prev, activeGuidanceSection: 'senior' }))}
          >
            <div className="section-header green">
              <h2>Senior</h2>
              <button className="btn-grey">Todesfall hinterlegen</button>
            </div>
            <div className="form-grid">
              <div className="form-row four-columns">
                <SelectField
                  name="beziehung"
                  value={formData.beziehung}
                  onChange={handleSelectChange}
                  label="💬 Beziehung"
                  placeholder="Auswählen"
                  multiple={false}
                  options={[
                    { value: 'Mutter', label: 'Mutter' },
                    { value: 'Vater', label: 'Vater' },
                    { value: 'Ehepartner', label: 'Ehepartner' },
                    { value: 'Kind', label: 'Kind' },
                    { value: 'Tochter', label: 'Tochter' },
                    { value: 'Sohn', label: 'Sohn' },
                    { value: 'Schwester', label: 'Schwester' },
                    { value: 'Bruder', label: 'Bruder' },
                    { value: 'Andere', label: 'Andere' }
                  ]}
                />
                <div className="form-group">
                  <SelectField
                    name="pflegegrad"
                    value={formData.pflegegrad}
                    onChange={handleSelectChange}
                    label="💬 Pflegegrad/-stufe"
                    placeholder="Auswählen"
                    multiple={false}
                    options={[
                      { value: 'Pflegegrad 1', label: 'Pflegegrad 1' },
                      { value: 'Pflegegrad 2', label: 'Pflegegrad 2' },
                      { value: 'Pflegegrad 3', label: 'Pflegegrad 3' },
                      { value: 'Pflegegrad 4', label: 'Pflegegrad 4' },
                      { value: 'Pflegegrad 5', label: 'Pflegegrad 5' }
                    ]}
                  />
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="erhoehungBeantragt"
                      checked={formData.erhoehungBeantragt}
                      onChange={handleChange}
                    />
                    Erhöhung beantragt
                  </label>
                </div>
                <SelectField
                  name="medizinischerHintergrund"
                  value={formData.medizinischerHintergrund}
                  onChange={handleSelectChange}
                  label="💬 Medizinischer Hintergrund"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Körperlich eingeschränkt', label: 'Körperlich eingeschränkt' },
                    { value: 'Altersschwäche', label: 'Altersschwäche' },
                    { value: 'Demenz', label: 'Demenz' },
                    { value: 'Herz-Kreislauf-Erkrankung', label: 'Herz-Kreislauf-Erkrankung' },
                    { value: 'Diabetes', label: 'Diabetes' },
                    { value: 'Arthrose', label: 'Arthrose' },
                    { value: 'Schlaganfall', label: 'Schlaganfall' },
                    { value: 'Parkinson', label: 'Parkinson' },
                    { value: 'Andere', label: 'Andere' }
                  ]}
                />
                <SelectField
                  name="mobilitaet"
                  value={formData.mobilitaet}
                  onChange={handleSelectChange}
                  label="💬 Mobilität"
                  placeholder="Auswählen"
                  multiple={false}
                  options={[
                    { value: 'Vollständig mobil', label: 'Vollständig mobil' },
                    { value: 'Eingeschränkt mobil', label: 'Eingeschränkt mobil' },
                    { value: 'Rollstuhl', label: 'Rollstuhl' },
                    { value: 'Gehhilfe', label: 'Gehhilfe' },
                    { value: 'Rollator', label: 'Rollator' },
                    { value: 'Bettlägerig', label: 'Bettlägerig' },
                    { value: 'Treppensteigen möglich', label: 'Treppensteigen möglich' },
                    { value: 'Treppensteigen nicht möglich', label: 'Treppensteigen nicht möglich' }
                  ]}
                />
              </div>
              <div className="form-row">
                <SelectField
                  name="barrierefreiheit"
                  value={formData.barrierefreiheit}
                  onChange={handleSelectChange}
                  label="💬 Barrierefreiheit"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Rollstuhlgerecht', label: 'Rollstuhlgerecht' },
                    { value: 'Treppenlift', label: 'Treppenlift' },
                    { value: 'Aufzug', label: 'Aufzug' },
                    { value: 'Barrierefreies Bad', label: 'Barrierefreies Bad' },
                    { value: 'Keine Barrieren', label: 'Keine Barrieren' }
                  ]}
                />
                <SelectField
                  name="wohnsituation"
                  value={formData.wohnsituation}
                  onChange={handleSelectChange}
                  label="💬 Wohnsituation"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Eigene Wohnung', label: 'Eigene Wohnung' },
                    { value: 'Bei Angehörigen', label: 'Bei Angehörigen' },
                    { value: 'Pflegeheim', label: 'Pflegeheim' },
                    { value: 'Betreutes Wohnen', label: 'Betreutes Wohnen' },
                    { value: 'Wohngemeinschaft', label: 'Wohngemeinschaft' },
                    { value: 'Eigentumswohnung', label: 'Eigentumswohnung' },
                    { value: 'Mietwohnung', label: 'Mietwohnung' }
                  ]}
                />
                <SelectField
                  name="aktuelleVersorgung"
                  value={formData.aktuelleVersorgung}
                  onChange={handleSelectChange}
                  label="💬 Aktuelle Versorgung"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Pflegedienst', label: 'Pflegedienst' },
                    { value: 'Angehörige', label: 'Angehörige' },
                    { value: 'Tagespflege', label: 'Tagespflege' },
                    { value: 'Kurzzeitpflege', label: 'Kurzzeitpflege' },
                    { value: 'Keine', label: 'Keine' }
                  ]}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Anrede</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="seniorAnrede" 
                        value="Frau" 
                        checked={formData.seniorAnrede === 'Frau'}
                        onChange={handleChange}
                      />
                      Frau
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="seniorAnrede" 
                        value="Herr" 
                        checked={formData.seniorAnrede === 'Herr'}
                        onChange={handleChange}
                      />
                      Herr
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Akadem.</label>
                  <input 
                    type="text" 
                    name="seniorAkademGrad"
                    value={formData.seniorAkademGrad}
                    onChange={handleChange}
                    placeholder="Akademischer Grad angeben"
                  />
                </div>
                <div className="form-group">
                  <label>💬 Vorname des Seniors</label>
                  <input 
                    type="text" 
                    name="seniorVorname"
                    value={formData.seniorVorname}
                    onChange={handleChange}
                    placeholder="Vorname angeben"
                  />
                </div>
                <div className="form-group">
                  <label>💬 Nachname des Seniors</label>
                  <input 
                    type="text" 
                    name="seniorNachname"
                    value={formData.seniorNachname}
                    onChange={handleChange}
                    placeholder="Nachname angeben"
                  />
                </div>
                <div className="form-group">
                  <label>💬 Alter</label>
                  <input 
                    type="text" 
                    name="alter"
                    value={formData.alter}
                    onChange={handleChange}
                    placeholder="Alter angeben"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tools & Informationen Section */}
          <div className="section tools-section">
            <h3>Tools & Informationen (nur für Deutschland)</h3>
            <div className="tools-buttons">
              <button className="tool-btn active">✕ Pflegegrad-Rechner</button>
              <button className="tool-btn active">✕ Pflegezuschüsse & -Leistungen</button>
            </div>
            <div className="form-group">
              <label>Sitzlift *</label>
              <div className="selected-item">
                <span>1 ausgewählt</span>
                <span className="remove-icon">✕</span>
              </div>
            </div>
          </div>

          {/* Postleitzahl Section */}
          <div className="section plz-section">
            <div className="form-row">
              <div className="form-group">
                <label>Postleitzahl</label>
                <div className="plz-input-group">
                  <select className="country-code">
                    <option>DE</option>
                  </select>
                  <input 
                    type="text" 
                    name="postleitzahl"
                    value={formData.postleitzahl}
                    onChange={handleChange}
                    placeholder="Postleitzahl angeben"
                  />
                  <button className="btn-search">Suchen</button>
                </div>
                {!formData.postleitzahl && (
                  <span className="error-message">Region *benötigt valide Postleitzahl</span>
                )}
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="collapsible-section">
            <div className="collapsible-header">
              <span>▶</span>
              <span>Informationen</span>
            </div>
          </div>
          <div className="collapsible-section">
            <div className="collapsible-header">
              <span>▶</span>
              <span>Produktkriterien:</span>
              <span className="dot-icon">●</span>
            </div>
          </div>
          <div className="collapsible-section">
            <div className="collapsible-header">
              <span>▶</span>
              <span>UTM Informationen</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bottom-actions">
            <button className="btn-grey">Speichern</button>
            <button className="btn-green">Speichern & Weiter</button>
            <div className="responsible-person">
              Verantwortlicher: hannah.venohr@pflegehilfe.de
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnfrageSitzlift;
