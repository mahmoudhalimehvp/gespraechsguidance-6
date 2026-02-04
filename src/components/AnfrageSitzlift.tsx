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
    toolsUndInformationen: [] as string[], // Multiselect
    seniorAnrede: '',
    seniorAkademGrad: '',
    seniorVorname: '',
    seniorNachname: '',
    alter: '',
    postleitzahl: '',
    region: '',
  });

  // Telefonnummern-Management
  interface PhoneNumber {
    id: string;
    type: string;
    number: string;
    countryCode: string;
  }
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [phoneModalData, setPhoneModalData] = useState({
    type: 'Mobil',
    number: '',
    countryCode: '+49'
  });
  const [phoneValidationError, setPhoneValidationError] = useState('');
  const nextPhoneIdRef = useRef(1);

  // Produktauswahl: Reiter unter "Produktempfehlung", UI wie im Screenshot (Name, "X von Y AN", ×)
  const [produktTabs, setProduktTabs] = useState<{ id: string; label: string; count: number; maxAN: number }[]>([
    { id: 'sitzlift', label: 'Sitzlift', count: 0, maxAN: 10 },
  ]);
  const [activeProduktTabId, setActiveProduktTabId] = useState<string>('sitzlift');
  const [produktDropdownOpen, setProduktDropdownOpen] = useState(false);
  const nextProduktIdRef = useRef(2);
  const produktDropdownRef = useRef<HTMLDivElement>(null);

  const availableProdukte = [
    // Ambulant
    { value: 'inkontinenzartikel-ambulant', label: 'Inkontinenzartikel', maxAN: 1 },
    { value: 'std-betreuung-ambulant', label: 'Std. Betreuung', maxAN: 2 },
    { value: 'badewanne-zur-dusche-ambulant', label: 'Badewanne zur Dusche', maxAN: 4 },
    { value: 'haushaltshilfe-ambulant', label: 'Haushaltshilfe', maxAN: 2 },
    { value: 'pflegeberatung-vor-ort-ambulant', label: 'Pflegeberatung vor Ort', maxAN: 5 },
    { value: 'intensivpflege-1zu1', label: '1:1 – Intensivpflege', maxAN: 6 },
    { value: 'essen-auf-raedern', label: 'Essen auf Rädern', maxAN: 0 },
    { value: 'hausnotruf', label: 'Hausnotruf', maxAN: 8 },
    { value: 'intensivpflege-wg', label: 'Intensivpflege-WG', maxAN: 3 },
    { value: 'pflegedienst', label: 'Pflegedienst', maxAN: 0 },
    { value: 'pflegekurse-angehoerige', label: 'Pflegekurse für Angehörige', maxAN: 1 },
    { value: 'senioren-wg-ambulant', label: 'Senioren-WG', maxAN: 2 },
    // Bad
    { value: 'badausstellung', label: 'Badausstellung', maxAN: 0 },
    { value: 'badewanne-zur-dusche-bad', label: 'Badewanne zur Dusche', maxAN: 4 },
    { value: 'badewannentuer', label: 'Badewannentür', maxAN: 4 },
    { value: 'badsanierung', label: 'Badsanierung', maxAN: 1 },
    { value: 'seniorenbadewanne', label: 'Seniorenbadewanne', maxAN: 3 },
    // Betreuung
    { value: '24h-betreuung', label: '24 Stunden Betreuung', maxAN: 20 },
    { value: '24h-verhinderungspflege', label: '24h Verhinderungspflege', maxAN: 2 },
    { value: 'deutsche-24h-betreuung', label: 'Deutsche 24h Betreuung', maxAN: 1 },
    { value: 'std-betreuung-betreuung', label: 'Std. Betreuung', maxAN: 2 },
    // Immobilien
    { value: 'immobilienverkauf', label: 'Immobilienverkauf', maxAN: 2 },
    { value: 'immobilienverrentung', label: 'Immobilienverrentung', maxAN: 0 },
    { value: 'pflegeimmobilie', label: 'Pflegeimmobilie', maxAN: 6 },
    // Lifte
    { value: 'aufzug', label: 'Aufzug', maxAN: 0 },
    { value: 'hublift', label: 'Hublift', maxAN: 3 },
    { value: 'patientenlifter', label: 'Patientenlifter', maxAN: 0 },
    { value: 'plattform-rollstuhllift', label: 'Plattform/Rollstuhllift', maxAN: 4 },
    { value: 'senkrechtlift', label: 'Senkrechtlift', maxAN: 2 },
    { value: 'sitzlift', label: 'Sitzlift', maxAN: 10 },
    // Personal
    { value: 'betreuungskraft', label: 'Betreuungskraft', maxAN: 0 },
    { value: 'pflegeazubis', label: 'Pflegeazubis', maxAN: 0 },
    { value: 'pflegedienstleitung', label: 'Pflegedienstleitung', maxAN: 0 },
    { value: 'pflegefachkraft', label: 'Pflegefachkraft', maxAN: 4 },
    { value: 'pflegehelfer', label: 'Pflegehelfer', maxAN: 1 },
    // Produkte
    { value: 'hoertest', label: 'Hörtest', maxAN: 1 },
    { value: 'badewannenlift', label: 'Badewannenlift', maxAN: 1 },
    { value: 'elektromobil', label: 'Elektromobil', maxAN: 4 },
    { value: 'elektrorollstuhl', label: 'Elektrorollstuhl', maxAN: 5 },
    { value: 'inkontinenzartikel-produkte', label: 'Inkontinenzartikel', maxAN: 1 },
    { value: 'pflegebett', label: 'Pflegebett', maxAN: 0 },
    { value: 'pflegehilfsmittel', label: 'Pflegehilfsmittel', maxAN: 8 },
    { value: 'pflegesessel', label: 'Pflegesessel', maxAN: 0 },
    { value: 'rollstuhlrampen', label: 'Rollstuhlrampen', maxAN: 0 },
    // Stationär
    { value: 'betreutes-wohnen', label: 'Betreutes Wohnen', maxAN: 2 },
    { value: 'stationaere-intensivpflege', label: 'Stationäre Intensivpflege', maxAN: 0 },
    { value: 'tagespflege', label: 'Tagespflege', maxAN: 3 },
    { value: 'verhinderungs-kurzzeitpflege', label: 'Verhinderungs-/ Kurzzeitpflege', maxAN: 0 },
    { value: 'vollstationaere-pflege', label: 'Vollstationäre Pflege', maxAN: 0 },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (produktDropdownRef.current && !produktDropdownRef.current.contains(e.target as Node)) {
        setProduktDropdownOpen(false);
      }
    };
    if (produktDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [produktDropdownOpen]);

  const addProduktTab = (value?: string, label?: string, maxAN?: number) => {
    if (value !== undefined && label !== undefined && maxAN !== undefined) {
      const exists = produktTabs.some((t) => t.id === value || t.label === label);
      if (exists) {
        setProduktDropdownOpen(false);
        return;
      }
      setProduktTabs((prev) => [...prev, { id: value, label, count: 0, maxAN }]);
      setActiveProduktTabId(value);
    } else {
      const newId = String(nextProduktIdRef.current++);
      setProduktTabs((prev) => [...prev, { id: newId, label: `Produkt ${newId}`, count: 0, maxAN: 8 }]);
      setActiveProduktTabId(newId);
    }
    setProduktDropdownOpen(false);
  };

  const removeProduktTab = (id: string) => {
    if (produktTabs.length <= 1) return;
    setProduktTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeProduktTabId === id) {
      const remaining = produktTabs.filter((tab) => tab.id !== id);
      setActiveProduktTabId(remaining[0]?.id ?? 'sitzlift');
    }
  };

  // Accordion-Status für Generelle Kriterien, Produktkriterien
  const [generelleKriterienExpanded, setGenerelleKriterienExpanded] = useState(false);
  const [produktkriterienExpanded, setProduktkriterienExpanded] = useState(true); // Standardmäßig ausgeklappt
  const [activeProduktkriterienTab, setActiveProduktkriterienTab] = useState<'nachfrage' | 'einsatzdetails' | 'zeitpunkt'>('nachfrage');


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

  // Telefonnummern-Funktionen
  const openPhoneModal = (phoneId?: string) => {
    if (phoneId) {
      // Bearbeitungsmodus
      const phone = phoneNumbers.find(p => p.id === phoneId);
      if (phone) {
        setPhoneModalData({
          type: phone.type,
          number: phone.number,
          countryCode: phone.countryCode
        });
        setEditingPhoneId(phoneId);
      }
    } else {
      // Neuer Modus
      setPhoneModalData({ type: 'Mobil', number: '', countryCode: '+49' });
      setEditingPhoneId(null);
    }
    setPhoneValidationError('');
    setIsPhoneModalOpen(true);
  };

  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
    setPhoneModalData({ type: 'Mobil', number: '', countryCode: '+49' });
    setEditingPhoneId(null);
    setPhoneValidationError('');
  };

  const validatePhoneNumber = (number: string): boolean => {
    // Entferne Leerzeichen und Sonderzeichen für Validierung
    const cleaned = number.replace(/\s+/g, '').replace(/[-\/]/g, '');
    // Deutsche Telefonnummer: mindestens 10 Ziffern (mit Vorwahl) oder 11 Ziffern (mit 0)
    // International: mindestens 8 Ziffern
    const digitsOnly = cleaned.replace(/\D/g, '');
    return digitsOnly.length >= 8;
  };

  const handlePhoneModalChange = (field: string, value: string) => {
    setPhoneModalData(prev => ({ ...prev, [field]: value }));
    if (field === 'number' && phoneValidationError) {
      // Validierung beim Tippen aktualisieren
      if (validatePhoneNumber(value)) {
        setPhoneValidationError('');
      }
    }
  };

  const savePhoneNumber = () => {
    if (!phoneModalData.number.trim()) {
      setPhoneValidationError('*Keine gültige Telefonnummer');
      return;
    }

    if (!validatePhoneNumber(phoneModalData.number)) {
      setPhoneValidationError('*Keine gültige Telefonnummer');
      return;
    }

    if (editingPhoneId) {
      // Update bestehende Nummer
      setPhoneNumbers(prev => prev.map(phone => 
        phone.id === editingPhoneId
          ? { ...phone, type: phoneModalData.type, number: phoneModalData.number, countryCode: phoneModalData.countryCode }
          : phone
      ));
    } else {
      // Neue Nummer hinzufügen
      const newPhone: PhoneNumber = {
        id: `phone-${nextPhoneIdRef.current++}`,
        type: phoneModalData.type,
        number: phoneModalData.number,
        countryCode: phoneModalData.countryCode
      };
      setPhoneNumbers(prev => [...prev, newPhone]);
    }
    closePhoneModal();
  };

  const callPhoneNumber = (phone: PhoneNumber) => {
    // Hier könnte die Anruf-Logik implementiert werden
    const fullNumber = `${phone.countryCode} ${phone.number}`;
    window.location.href = `tel:${fullNumber.replace(/\s+/g, '')}`;
  };

  const deletePhoneNumber = (id: string) => {
    setPhoneNumbers(prev => prev.filter(phone => phone.id !== id));
  };

  const getCountryFlag = (countryCode: string): JSX.Element | null => {
    const flagMap: { [key: string]: JSX.Element } = {
      '+49': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="160" fill="#000000" y="0"/>
          <rect width="640" height="160" fill="#DD0000" y="160"/>
          <rect width="640" height="160" fill="#FFCE00" y="320"/>
        </svg>
      ),
      '+43': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="160" fill="#ED2939" y="0"/>
          <rect width="640" height="160" fill="#FFFFFF" y="160"/>
          <rect width="640" height="160" fill="#ED2939" y="320"/>
        </svg>
      ),
      '+41': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="640" height="480" fill="#FF0000"/>
          <path d="M170 257.5h300v-35h-300z" fill="#FFFFFF"/>
          <path d="M275 190v100h-35V190z" fill="#FFFFFF"/>
        </svg>
      ),
      '+33': (
        <svg className="country-flag-icon" viewBox="0 0 640 480" width="16" height="12">
          <rect width="213.3" height="480" fill="#002654" x="0"/>
          <rect width="213.3" height="480" fill="#FFFFFF" x="213.3"/>
          <rect width="213.3" height="480" fill="#ED2939" x="426.6"/>
        </svg>
      ),
    };
    return flagMap[countryCode] || null;
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

          {/* Pflegehilfe+ Info Banner */}
          <div className="vermittlungsgarantie-info">
            <span className="info-icon">👑</span>
            <span>Pflegehilfe+ gebucht</span>
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
              <div className="klient-two-rows-container">
                {/* Zeile 1, Spalte 1: Anrede + Akadem. */}
                <div className="klient-col1-row1">
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
                  <div className="form-group klient-akadem-field">
                    <label>Akadem.</label>
                    <input 
                      type="text" 
                      name="akademGrad"
                      value={formData.akademGrad}
                      onChange={handleChange}
                      placeholder="Akademischer Grad angeben"
                    />
                  </div>
                </div>
                {/* Zeile 1, Spalte 2: Vorname + Nachname */}
                <div className="klient-col2-row1">
                  <div className="form-group klient-small-field">
                    <label>Vorname</label>
                    <input 
                      type="text" 
                      name="vorname"
                      value={formData.vorname}
                      onChange={handleChange}
                      placeholder="Vorname angeben"
                    />
                  </div>
                  <div className="form-group klient-small-field">
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
                {/* Spalte 3, beide Zeilen: Kommentar */}
                <div className="form-group klient-comment-field">
                  <label>Interner Kommentar (Klient)</label>
                  <textarea 
                    name="internerKommentar"
                    value={formData.internerKommentar}
                    onChange={handleChange}
                    placeholder="Internes bitte hier eintragen"
                    rows={4}
                  />
                </div>
                {/* Zeile 2, Spalte 1: E-Mail (volle Breite der Spalte) */}
                <div className="form-group klient-email-field">
                  <label>E-Mail</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E-Mail angeben"
                  />
                </div>
                {/* Zeile 2, Spalte 2: Telefonnummer */}
                <div className="form-group phone-group">
                  <label>Telefonnummer</label>
                  <div className="phone-input-wrapper">
                    <button type="button" className="btn-blue" onClick={() => openPhoneModal()}>+ Neue Nummer</button>
                    {phoneNumbers.length === 0 && (
                      <span className="error-message">Eine Telefonnummer ist erforderlich.</span>
                    )}
                    {phoneNumbers.length > 0 && (
                      <div className="phone-numbers-list">
                        {phoneNumbers.map(phone => (
                          <div key={phone.id} className="phone-number-item">
                            {getCountryFlag(phone.countryCode) && (
                              <span className="country-flag-display">{getCountryFlag(phone.countryCode)}</span>
                            )}
                            <span className="phone-type">{phone.type}:</span>
                            <span className="phone-number">{phone.countryCode} {phone.number}</span>
                            <div className="phone-actions">
                              <button 
                                type="button"
                                className="phone-call-btn"
                                onClick={() => callPhoneNumber(phone)}
                                title="Anrufen"
                              >
                                <span className="phone-icon">📞</span>
                                <span>Anrufen</span>
                              </button>
                              <button 
                                type="button"
                                className="phone-edit-btn"
                                onClick={() => openPhoneModal(phone.id)}
                                title="Bearbeiten"
                              >
                                <span className="edit-icon">⚙️</span>
                              </button>
                              <button 
                                type="button"
                                className="phone-delete-btn"
                                onClick={() => deletePhoneNumber(phone.id)}
                                title="Löschen"
                              >
                                <span className="delete-icon">🗑️</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

          {/* Weiterleitung Section (grüne Überschrift, enthält Tools, PLZ, Collapsible, Actions) */}
          <div className="section weiterleitung-section">
            <div className="section-header green">
              <h2>Weiterleitung</h2>
            </div>
            <div className="form-grid">
              <div className="form-row">
                <SelectField
                  name="toolsUndInformationen"
                  value={formData.toolsUndInformationen}
                  onChange={handleSelectChange}
                  label="💬 Tools & Informationen (nur für Deutschland)"
                  placeholder="Auswählen"
                  multiple={true}
                  options={[
                    { value: 'Pflegegrad-Rechner', label: 'Pflegegrad-Rechner' },
                    { value: 'Pflegezuschüsse & -Leistungen', label: 'Pflegezuschüsse & -Leistungen' }
                  ]}
                />
              </div>

              <div className="form-row">
                <label className="field-label-same">Produktempfehlung</label>
              </div>

              {/* Reiter-Container: Tab-Leiste + Inhalt als klassische Reiter */}
              <div className="produkt-reiter-container">
                <div className="produkt-reiter-leiste" ref={produktDropdownRef}>
                  {produktTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`produkt-reiter ${activeProduktTabId === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveProduktTabId(tab.id)}
                    >
                      <span className="produkt-reiter-check">✓</span>
                      <span className="produkt-reiter-label">
                        {tab.label} ({tab.count} von {tab.maxAN} AN)
                      </span>
                      {produktTabs.length > 1 && (
                        <span
                          className="produkt-reiter-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeProduktTab(tab.id);
                          }}
                          aria-label="Reiter entfernen"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="produkt-reiter-dropdown-wrap">
                    <button
                      type="button"
                      className="produkt-reiter-dropdown-btn"
                      onClick={() => setProduktDropdownOpen(!produktDropdownOpen)}
                      aria-expanded={produktDropdownOpen}
                    >
                      <span>{produktTabs.length} ausgewählt</span>
                      <span className="dropdown-arrow">▼</span>
                    </button>
                    {produktDropdownOpen && (
                      <div className="produkt-reiter-dropdown-menu">
                        {availableProdukte.map((p) => {
                          const alreadyAdded = produktTabs.some((t) => t.id === p.value || t.label === p.label);
                          return (
                            <button
                              key={p.value}
                              type="button"
                              className="produkt-reiter-dropdown-option"
                              disabled={alreadyAdded}
                              onClick={() => addProduktTab(p.value, p.label, p.maxAN)}
                            >
                              {p.label} ({p.maxAN})
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="produkt-inhalt-bereich">
                  <div className="produkt-tab-content">
                    {/* Oben: Postleitzahl und Region (beziehen sich auf das ausgewählte Produkt) */}
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
                      <div className="form-group">
                        <label>Region</label>
                        <input 
                          type="text" 
                          name="region"
                          value={formData.region}
                          onChange={handleChange}
                          placeholder="Region angeben"
                        />
                      </div>
                    </div>

                    {/* Accordions: Generelle Kriterien, Produktkriterien */}
                    <div className="accordion-section">
                      {/* Generelle Kriterien Accordion */}
                      <div className="accordion-item">
                        <button 
                          type="button" 
                          className="reiter-unter-plz-header accordion-header"
                          onClick={() => setGenerelleKriterienExpanded(!generelleKriterienExpanded)}
                        >
                          <span className="reiter-unter-plz-text">Generelle Kriterien</span>
                          <span className={`reiter-unter-plz-chevron ${generelleKriterienExpanded ? 'expanded' : ''}`}>
                            {generelleKriterienExpanded ? '▼' : '›'}
                          </span>
                        </button>
                        {generelleKriterienExpanded && (
                          <div className="accordion-content">
                            {/* Inhalt für Generelle Kriterien - später ergänzen */}
                            <p>Inhalte für Generelle Kriterien folgen.</p>
                          </div>
                        )}
                      </div>


                    {/* Produktkriterien: graue Überschrift wie „Informationen“, alle Kriterien fix darunter */}
                      <div className="accordion-item">
                        <button 
                          type="button" 
                          className="reiter-unter-plz-header accordion-header produktkriterien-header"
                          onClick={() => setProduktkriterienExpanded(!produktkriterienExpanded)}
                        >
                          <span className="reiter-unter-plz-text">Produktkriterien:</span>
                          <span className={`reiter-unter-plz-chevron ${produktkriterienExpanded ? 'expanded' : ''}`}>
                            {produktkriterienExpanded ? '▼' : '›'}
                          </span>
                        </button>
                        {produktkriterienExpanded && (
                          <div className="accordion-content produktkriterien-content">
                            {/* Karten nebeneinander - Bedingt basierend auf aktivem Produkt */}
                            <div className="produktkriterien-cards">
                              {(() => {
                                const activeTab = produktTabs.find(tab => tab.id === activeProduktTabId);
                                const isSitzlift = activeTab?.label === 'Sitzlift' || activeTab?.id === 'sitzlift';
                                const isPflegekurseAngehoerige = activeTab?.label === 'Pflegekurse für Angehörige' || activeTab?.id === 'pflegekurse-angehoerige';
                                
                                if (isPflegekurseAngehoerige) {
                                  // Produktkriterien für Pflegekurse für Angehörige
                                  return (
                                    <>
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Einsatzdetails & Haushalt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Krankenkasse Kursteilnehmer*in</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <p className="produktkriterien-description">Die Krankenkasse des Kursteilnehmers ist gefragt, nicht der pflegebedürftigen Person.</p>
                                            <div className="form-group">
                                              <input
                                                type="text"
                                                placeholder="Krankenkasse auswählen"
                                                className="form-input-with-dropdown"
                                              />
                                              <span className="input-dropdown-arrow">▼</span>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Verfügbarkeit Versichertennummer</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="verfuegbarkeitVersichertennummer" value="vor" /> Versichertennummer liegt vor (0)</label>
                                              <label><input type="radio" name="verfuegbarkeitVersichertennummer" value="nicht_vor" /> Versichertennummer liegt nicht vor (0)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Beratungsart</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="checkbox-group">
                                              <label><input type="checkbox" name="beratungsartPflegekurse" value="video" /> Beratung per Video (0)</label>
                                              <label><input type="checkbox" name="beratungsartPflegekurse" value="vor_ort" /> Beratung vor Ort (0)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                } else if (isSitzlift) {
                                  // Sitzlift-Kriterien
                                  return (
                                    <>
                              {/* Karte 1: Haushalt */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Haushalt</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Einverständnis des Seniors</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="einverstaendnisSenior" value="vorhanden" /> Liegt vor (10)</label>
                                      <label><input type="radio" name="einverstaendnisSenior" value="nicht_vorhanden" /> Liegt nicht vor (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Pflegegrad/-stufe</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="pflegegradSitzlift" value="vorhanden" /> Vorhanden (10)</label>
                                      <label><input type="radio" name="pflegegradSitzlift" value="beantragt" /> Beantragt (10)</label>
                                      <label><input type="radio" name="pflegegradSitzlift" value="nicht_vorhanden" /> Nicht vorhanden (10)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Hausart</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="hausart" value="einfamilienhaus" /> Einfamilienhaus (19)</label>
                                      <label><input type="radio" name="hausart" value="zweifamilienhaus" /> Zweifamilienhaus (18)</label>
                                      <label><input type="radio" name="hausart" value="mehrfamilienhaus" /> Mehrfamilienhaus (0)</label>
                                      <label><input type="radio" name="hausart" value="maisonette" /> Maisonette-Wohnung (10)</label>
                                      <label><input type="radio" name="hausart" value="gewerbe" /> Gewerbe (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Immobilie</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="immobilie" value="eigentum" /> Eigentum (10)</label>
                                      <label><input type="radio" name="immobilie" value="miete" /> Miete (14)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Einverständnis des Vermieters</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="einverstaendnisVermieter" value="vorhanden" /> Vorhanden/Eigentümer (10)</label>
                                      <label><input type="radio" name="einverstaendnisVermieter" value="angefragt" /> Angefragt/In Klärung (5)</label>
                                      <label><input type="radio" name="einverstaendnisVermieter" value="nicht_vorhanden" /> Nicht vorhanden (3)</label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Karte 2: Anforderungen */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Anforderungen</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Treppenform + Standort</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="treppenform" value="gerade_innen" /> Gerade Treppe im Innenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="gerade_aussen" /> Gerade Treppe im Außenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="kurvig_innen" /> Kurvige Treppe im Innenbereich (18)</label>
                                      <label><input type="radio" name="treppenform" value="kurvig_aussen" /> Kurvige Treppe im Außenbereich (16)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Etagen</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="etagen" value="1" /> 1 (10)</label>
                                      <label><input type="radio" name="etagen" value="2" /> 2 (18)</label>
                                      <label><input type="radio" name="etagen" value="3" /> 3 (18)</label>
                                      <label><input type="radio" name="etagen" value="4" /> 4 (18)</label>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
                                      Ab 2 Etagen: NUR kurvig und innen möglich
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Treppenbreite</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>8</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="treppenbreite" 
                                        min="70" 
                                        max="150" 
                                        defaultValue="110"
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>70 cm</span>
                                        <span>150 cm</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Körpergewicht des Nutzers</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>10</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="koerpergewicht" 
                                        min="10" 
                                        max="200" 
                                        defaultValue="60"
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>10 kg</span>
                                        <span>200 kg</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Zustand</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="checkbox-group">
                                      <label><input type="checkbox" name="zustand" value="neu" /> Neu (10)</label>
                                      <label><input type="checkbox" name="zustand" value="gebraucht" /> Gebraucht (8)</label>
                                      <label><input type="checkbox" name="zustand" value="miete" /> Miete (0)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Budgetrahmen</span>
                                      <span className="produktkriterien-count" style={{ color: '#4caf50' }}>9</span>
                                    </div>
                                    <div className="slider-group">
                                      <input 
                                        type="range" 
                                        name="budgetrahmen" 
                                        min="4000" 
                                        max="25000" 
                                        step="1000"
                                        defaultValue="12000"
                                        className="produktkriterien-slider"
                                      />
                                      <div className="slider-labels">
                                        <span>4000 €</span>
                                        <span>25000 €</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Karte 3: Zeitpunkt */}
                              <div className="produktkriterien-card">
                                <div className="produktkriterien-card-header">Zeitpunkt</div>
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Vor-Ort-Termin</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="checkbox-group">
                                      <label><input type="checkbox" name="vorOrtTermin" value="vormittags" /> Ja - Vormittags (10)</label>
                                      <label><input type="checkbox" name="vorOrtTermin" value="nachmittags" /> Ja - Nachmittags (10)</label>
                                      <label><input type="checkbox" name="vorOrtTermin" value="nein" /> Nein (3)</label>
                                    </div>
                                  </div>
                                  <div className="produktkriterien-group">
                                    <div className="produktkriterien-group-header">
                                      <span>Bedarf</span>
                                      <span className="produktkriterien-count">0</span>
                                    </div>
                                    <div className="radio-group">
                                      <label><input type="radio" name="bedarfSitzlift" value="schnell" /> Schnellstmöglich (10)</label>
                                      <label><input type="radio" name="bedarfSitzlift" value="wochen" /> In Wochen (7)</label>
                                      <label><input type="radio" name="bedarfSitzlift" value="monate" /> In Monaten (1)</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                                    </>
                                  );
                                } else {
                                  // Alte Kriterien für andere Produkte (z.B. Hausnotruf)
                                  return (
                                    <>
                                      {/* Karte 1: Nachfrage */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Nachfrage</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Art des Notrufsystems</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="artNotruf" value="zuhause" /> Nur zu Hause (17)</label>
                                              <label><input type="radio" name="artNotruf" value="unterwegs" /> Nur unterwegs (16)</label>
                                              <label><input type="radio" name="artNotruf" value="beides" /> Zu Hause und unterwegs (16)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Kontaktperson</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="kontaktperson" value="angehoerige" /> Nur Angehörige (17)</label>
                                              <label><input type="radio" name="kontaktperson" value="notrufzentrale" /> Nur Notrufzentrale (17)</label>
                                              <label><input type="radio" name="kontaktperson" value="beides" /> Angehörige und Notrufzentrale (18)</label>
                                            </div>
                                          </div>
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Wohnsituation</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="wohnsituationNotruf" value="alleine" /> Lebt alleine (18)</label>
                                              <label><input type="radio" name="wohnsituationNotruf" value="nicht_alleine" /> Lebt nicht alleine (18)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Karte 2: Einsatzdetails & Haushalt */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Einsatzdetails & Haushalt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Pflegegrad/-stufe</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="pflegegrad" value="vorhanden" /> Vorhanden (18)</label>
                                              <label><input type="radio" name="pflegegrad" value="beantragt" /> Beantragt (16)</label>
                                              <label><input type="radio" name="pflegegrad" value="nicht_vorhanden" /> Nicht vorhanden (14)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* Karte 3: Zeitpunkt */}
                                      <div className="produktkriterien-card">
                                        <div className="produktkriterien-card-header">Zeitpunkt</div>
                                        <div className="produktkriterien-card-body">
                                          <div className="produktkriterien-group">
                                            <div className="produktkriterien-group-header">
                                              <span>Bedarf</span>
                                              <span className="produktkriterien-count">0</span>
                                            </div>
                                            <div className="radio-group">
                                              <label><input type="radio" name="bedarf" value="schnell" /> Schnellstmöglich (18)</label>
                                              <label><input type="radio" name="bedarf" value="wochen" /> In Wochen (15)</label>
                                              <label><input type="radio" name="bedarf" value="monate" /> In Monaten (11)</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Box unter Produktkriterien: nur bei Pflegekurse für Angehörige */}
                        {(() => {
                          const activeTab = produktTabs.find(tab => tab.id === activeProduktTabId);
                          const isPflegekurseAngehoerige = activeTab?.label === 'Pflegekurse für Angehörige' || activeTab?.id === 'pflegekurse-angehoerige';
                          return isPflegekurseAngehoerige ? (
                            <div className="versichertennummer-box-unter-produktkriterien">
                              <div className="produktkriterien-card produktkriterien-card-versichertennummer">
                                <div className="produktkriterien-card-body">
                                  <div className="produktkriterien-group">
                                    <label className="label-with-info">
                                      <span>Versichertennummer</span>
                                      <span className="info-icon-circle" title="Information">i</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="versichertennummerKursteilnehmer"
                                      placeholder="Versichertennummer Kursteilnehmer*in eintragen"
                                      className="versichertennummer-input"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    {/* Bottom Actions (pro Produkt) */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Telefonnummer Modal */}
      {isPhoneModalOpen && (
        <div className="modal-overlay" onClick={closePhoneModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingPhoneId ? 'Telefon bearbeiten' : 'Telefon'}</h2>
            <div className="modal-form">
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <select
                    className="phone-type-select"
                    value={phoneModalData.type}
                    onChange={(e) => handlePhoneModalChange('type', e.target.value)}
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Festnetz">Festnetz</option>
                    <option value="Geschäftlich">Geschäftlich</option>
                  </select>
                </div>
                <div className="modal-form-group phone-number-group">
                  <div className="country-selector">
                    <span className="country-flag">🇩🇪</span>
                    <select
                      className="country-code-select"
                      value={phoneModalData.countryCode}
                      onChange={(e) => handlePhoneModalChange('countryCode', e.target.value)}
                    >
                      <option value="+49">+49</option>
                      <option value="+43">+43</option>
                      <option value="+41">+41</option>
                      <option value="+33">+33</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    className={`phone-number-input ${phoneValidationError ? 'error' : ''}`}
                    value={phoneModalData.number}
                    onChange={(e) => handlePhoneModalChange('number', e.target.value)}
                    placeholder="01512 3456789"
                  />
                </div>
              </div>
              {phoneValidationError && (
                <div className="modal-error-message">{phoneValidationError}</div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn-orange" onClick={closePhoneModal}>Abbrechen</button>
              <button className="btn-blue" onClick={savePhoneNumber}>Speichern</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnfrageSitzlift;
