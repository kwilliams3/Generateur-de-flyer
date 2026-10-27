import { forwardRef, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Clock3, FileSearch, FileText, GraduationCap, MapPin, Monitor, UserRound, UsersRound } from 'lucide-react';
import { FlyerData } from '@/types/flyer';
import enspdLogo from '@/assets/enspd-logo.png';
import './flyer.css';
import { FLYER_HEIGHT, FLYER_WIDTH } from '@/lib/flyer-export';

export const FlyerPreview = forwardRef<HTMLDivElement, { data: FlyerData }>(({ data }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FLYER_WIDTH));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  const title = data.thesisTitle || "Votre thème de mémoire";
  const titleSize = title.length > 220 ? 28 : title.length > 175 ? 32 : title.length > 130 ? 35 : 38;
  const titleSeparator = title.lastIndexOf(':');
  const juryIcons = [UsersRound, FileSearch, FileText];
  return (
    <div ref={containerRef} className="flyer-preview-container" style={{ height: FLYER_HEIGHT * scale }}>
      <div ref={ref} id="soutenance-poster" className="soutenance-poster" style={{ width: FLYER_WIDTH, transform: `scale(${scale})` }}>
        <img className="poster-background" src="/images/soutenance-background.png" alt="" />
        <div className="poster-composition">
        <img className="poster-school-logo" src={enspdLogo} alt="École Nationale Supérieure Polytechnique de Douala" />
        <div className="poster-heading">
          <GraduationCap className="poster-cap" size={90} strokeWidth={1.4} />
          <div className="poster-script-title">Soutenance</div>
          <div className="poster-year">Ingénieurs <strong>{data.year}</strong></div>
          <div className="poster-heading-underline" />
        </div>
        <div className="poster-department">
          <svg className="poster-department-shape" viewBox="0 0 486 136" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="department-orange" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff7900" />
                <stop offset="0.55" stopColor="#ff8b00" />
                <stop offset="1" stopColor="#ff6827" />
              </linearGradient>
            </defs>
            <path d="M31 2 L415 2 Q448 0 461 33 L483 96 Q494 132 456 134 L29 121 Q1 120 1 92 L1 35 Q1 2 31 2Z" fill="url(#department-orange)" stroke="#ffcc89" strokeWidth="2" />
          </svg>
          <Monitor size={70} strokeWidth={1.8} />
          <span className="poster-code">&lt;/&gt;</span>
          <div><span>DÉPARTEMENT DE</span><strong>GÉNIE INFORMATIQUE<br />&amp; TÉLÉCOMMUNICATION</strong></div>
        </div>
        <section className="poster-theme">
          <h2>THÈME <span /></h2>
          <p style={{ fontSize: titleSize }}>{titleSeparator >= 0 ? <>{title.slice(0, titleSeparator + 1)}<span style={{ color: '#ff7900' }}>{title.slice(titleSeparator + 1)}</span></> : title}</p>
        </section>
        <section className="poster-portrait-area">
          <div className="poster-photo-frame">
            {data.photo ? <img src={data.photo} alt={data.fullName || "Photo de l'étudiant"} /> : <div className="poster-photo-placeholder"><UserRound size={110} strokeWidth={1} /><span>Votre photo</span></div>}
          </div>
          <div className="poster-nameplate">
            <strong style={{ fontSize: data.fullName.length > 45 ? 23 : 28 }}>{data.fullName || 'NOM ET PRÉNOMS'}</strong>
            <p><span />Ingénieur en {data.field}</p>
          </div>
        </section>
        <section className="poster-jury">
          <h2>Membres du jury <span /></h2>
          {data.jury.map((member, index) => {
            const Icon = juryIcons[index] || FileText;
            return <div className="poster-jury-row" key={member.role}>
              <span className="poster-jury-icon"><Icon size={34} strokeWidth={1.7} /></span>
              <strong>{member.role}</strong>
              <span className="poster-jury-name">{member.name ? `${member.title} ${member.name}` : 'Nom du membre'}</span>
            </div>;
          })}
        </section>
        <section className="poster-logistics">
          <div className="poster-date"><span className="poster-round-icon"><CalendarDays /></span><strong>{data.date ? <><span className="poster-weekday">{format(data.date, 'EEEE', { locale: fr })}</span><br />{format(data.date, 'd MMMM yyyy', { locale: fr })}</> : <>Jour<br />Date de soutenance</>}</strong></div>
          <div className="poster-time"><span className="poster-round-icon"><Clock3 /></span><strong>{data.time ? data.time.replace(':', 'H') : 'Heure'}</strong></div>
          <div className="poster-location"><span className="poster-round-icon"><MapPin /></span><strong>Campus ENSPD Logbessou<br />PK17, {data.location || 'Salle de soutenance'}</strong></div>
        </section>
        <div className="poster-motto">L'Innovation<span>au Service du Développement</span><i /></div>
        </div>
      </div>
    </div>
  );
});
FlyerPreview.displayName = 'FlyerPreview';
