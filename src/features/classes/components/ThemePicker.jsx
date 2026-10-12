import { Check, Palette, Rocket, Shield, Smile, Trees } from 'lucide-react';
import { CLASS_THEMES } from '../classThemes';
import '../../../styles/class-themes.css';

const icons = { superhero: Shield, playground: Smile, space: Rocket, fantasy: Trees, studio: Palette };
export default function ThemePicker({ value, onChange, compact = false }) {
  return <fieldset className="qz-theme-picker">
    <legend>Pilih dunia kelas</legend>
    <p className="qz-theme-picker__intro">Bukan hanya warna. Setiap dunia punya karakter, bentuk, dan suasana belajar sendiri.</p>
    <div className={'qz-theme-picker__grid' + (compact ? ' qz-theme-picker__grid--compact' : '')}>
      {CLASS_THEMES.map((theme) => {
        const Icon = icons[theme.id];
        return <label key={theme.id} className={'qz-theme-choice qz-theme-' + theme.id + (value === theme.id ? ' is-selected' : '')}>
          <input type="radio" name="class-theme" value={theme.id} checked={value === theme.id} onChange={() => onChange(theme.id)} />
          <span className="qz-theme-choice__scene" aria-hidden="true"><span className="qz-theme-choice__halo" /><Icon size={36} strokeWidth={1.7} /><span className="qz-theme-choice__symbol">{theme.symbol}</span></span>
          <span className="qz-theme-choice__name">{theme.name}</span>
          <span className="qz-theme-choice__detail">{theme.subtitle}</span>
          <span className="qz-theme-choice__check"><Check size={14} /></span>
        </label>;
      })}
    </div>
  </fieldset>;
}
