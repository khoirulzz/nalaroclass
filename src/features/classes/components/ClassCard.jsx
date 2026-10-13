import { Link } from 'react-router-dom';
import { ArrowRightIcon, MembersIcon, QuizIcon } from '../../../components/icons';
import ClassWorldScene from '../../../components/classroom/ClassWorldScene';
import '../../../styles/class-world-gallery.css';
import { getClassTheme, classThemeClass } from '../classThemes';
import '../../../styles/class-themes.css';
import Badge from '../../../components/ui/Badge';

export default function ClassCard({ classItem, role = 'teacher' }) {
  const basePath = role === 'teacher' ? '/teacher/classes' : '/student/classes';
  const tones = ['purple', 'mint', 'peach', 'blue'];
  const colorIndex = Array.from(String(classItem.id)).reduce((sum, char) => sum + char.charCodeAt(0), 0) % tones.length;
  return (
    <Link to={`${basePath}/${classItem.id}/overview`} className={`qz-class-card qz-tone-${tones[colorIndex]} ${classThemeClass(classItem.themeId)}`}>
      <div className="qz-class-card__top">
        {getClassTheme(classItem.themeId) ? <span className="qz-class-card__world" aria-hidden="true"><ClassWorldScene themeId={classItem.themeId} /></span> : <span className="qz-class-card__icon" aria-hidden="true">◆</span>}
        <Badge tone="primary">{classItem.status === 'active' ? 'Kelas aktif' : 'Tidak aktif'}</Badge>
      </div>
      <div className="qz-class-card__body">
        {getClassTheme(classItem.themeId) ? <span className="qz-class-card__world-name">{getClassTheme(classItem.themeId).name}</span> : null}
        <h3>{classItem.name}</h3>
        <p>{classItem.description || 'Belum ada deskripsi kelas.'}</p>
        {role === 'student' ? <p>{classItem.teacherName || 'Guru Nalaro'}</p> : <p>Kode kelas · {classItem.code}</p>}
      </div>
      <div className="qz-class-card__footer">
        <span><MembersIcon size={15} /> {classItem.studentsCount || 0} siswa</span>
        <span><QuizIcon size={15} /> {classItem.quizzesCount || 0} kuis</span>
        <ArrowRightIcon className="qz-class-card__arrow" size={17} />
      </div>
    </Link>
  );
}
