import { Check } from 'lucide-react';
import ClassWorldScene from '../../../components/classroom/ClassWorldScene';
import '../../../styles/class-world-gallery.css';
import { CLASS_THEMES } from '../classThemes';
import '../../../styles/class-themes.css';

export default function ThemePicker({ value, onChange, compact = false, enabledLivingThemes = [] }) {
  return <fieldset className="qz-theme-picker">
    <legend>Pilih dunia kelas</legend>
    <p className="qz-theme-picker__intro">Pilih satu dunia untuk kelas ini. Desain dan atmosfer belajar akan mengikuti pilihan ini sejak kelas dibuat.</p>
    <div className={'qz-theme-picker__grid' + (compact ? ' qz-theme-picker__grid--compact' : '')}>
      {CLASS_THEMES.filter((theme) => theme.collection !== 'living-worlds' || enabledLivingThemes.includes(theme.id)).map((theme) => {
        return <label key={theme.id} className={'qz-theme-choice qz-theme-' + theme.id + (value === theme.id ? ' is-selected' : '')}>
          <input type="radio" name="class-theme" value={theme.id} checked={value === theme.id} onChange={() => onChange(theme.id)} />
          <span className="qz-theme-choice__scene" aria-hidden="true"><ClassWorldScene themeId={theme.id} /></span>
          <span className="qz-theme-choice__name">{theme.name}</span>
          <span className="qz-theme-choice__detail">{theme.subtitle}</span>
          <span className="qz-theme-choice__check"><Check size={14} /></span>
        </label>;
      })}
    </div>
  </fieldset>;
}
