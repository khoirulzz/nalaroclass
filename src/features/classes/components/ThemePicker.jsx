import { Check } from 'lucide-react';
import ClassWorldScene from '../../../components/classroom/ClassWorldScene';
import '../../../styles/class-world-gallery.css';
import { CLASS_THEMES } from '../classThemes';
import '../../../styles/class-themes.css';

function ThemeOption({ theme, value, onChange }) {
  return <label className={'qz-theme-choice qz-theme-' + theme.id + (value === theme.id ? ' is-selected' : '')}>
    <input type="radio" name="class-theme" value={theme.id} checked={value === theme.id} onChange={() => onChange(theme.id)} />
    <span className="qz-theme-choice__scene" aria-hidden="true"><ClassWorldScene themeId={theme.id} /></span>
    <span className="qz-theme-choice__name">{theme.name}</span>
    <span className="qz-theme-choice__detail">{theme.subtitle}</span>
    <span className="qz-theme-choice__check"><Check size={14}/></span>
  </label>;
}

export default function ThemePicker({ value, onChange, compact = false, enabledLivingThemes = [] }) {
  const available = CLASS_THEMES.filter((theme) => theme.collection !== 'living-worlds' || enabledLivingThemes.includes(theme.id));
  const original = available.filter((theme) => theme.collection !== 'living-worlds');
  const living = available.filter((theme) => theme.collection === 'living-worlds');
  return <fieldset className="qz-theme-picker">
    <legend>Pilih dunia kelas</legend>
    <p className="qz-theme-picker__intro">Tema dipilih sekali saat kelas dibuat. Semua siswa masuk ke dunia belajar yang sama.</p>
    <div className="qz-theme-picker__collection">
      <h4 className="qz-theme-picker__collection-title">Original Worlds <span>{original.length} dunia</span></h4>
      <div className={'qz-theme-picker__grid' + (compact ? ' qz-theme-picker__grid--compact' : '')}>
        {original.map((theme) => <ThemeOption key={theme.id} theme={theme} value={value} onChange={onChange} />)}
      </div>
    </div>
    {living.length ? <div className="qz-theme-picker__collection">
      <h4 className="qz-theme-picker__collection-title">Living Worlds <span>{living.length} dunia interaktif</span></h4>
      <p className="qz-theme-picker__collection-description">Tekstur, karakter, dan atmosfer yang hidup. Gerakan menyesuaikan kemampuan perangkat.</p>
      <div className={'qz-theme-picker__grid' + (compact ? ' qz-theme-picker__grid--compact' : '')}>
        {living.map((theme) => <ThemeOption key={theme.id} theme={theme} value={value} onChange={onChange}/>)}
      </div>
    </div> : null}
  </fieldset>;
}
