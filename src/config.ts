import heroPhoto from './assets/images/qyz_uzatu_hero_1794655383004.jpg';
import detailsPhoto from './assets/images/qyz_uzatu_details_1794655383966.jpg';
import feastPhoto from './assets/images/qyz_uzatu_feast_1794655383686.jpg';
import finalePhoto from './assets/images/qyz_uzatu_finale_1794655384818.jpg';

const USER_BRIDE_PHOTO = '/assets/aistudio/WhatsApp_Image_2026-11-14_at_16.11.05__2__ee8ff3ea.jpeg';

export type SectionKey =
  | 'hero'
  | 'bride'
  | 'photo'
  | 'details'
  | 'program'
  | 'countdown'
  | 'location'
  | 'rsvp'
  | 'finale';

export interface PhotoConfig {
  id: string;
  url: string;
  title: string;
  alt: string;
  sectionKey: SectionKey;
}

export interface ProgramItem {
  step: string;
  time: string;
  title: string;
  description: string;
}

export interface InvitationConfig {
  brideName: string;
  parents: string;
  tagline: string;
  blessing: string;
  wishesText: string;
  dateDisplay: string;
  weekdayDisplay: string;
  timeDisplay: string;
  eventDateISO: string;
  venueName: string;
  city: string;
  address: string;
  mapUrl: string;
  musicUrl: string;
  brideNameImage: string;
  portraitPhoto: {
    url: string;
    alt: string;
    caption: string;
  };
  photos: PhotoConfig[];
  program: ProgramItem[];
}

/**
 * Барлық мәтіндер, күндер, мекенжай және фотолар осы CONFIG объектісінен оңай өзгертіледі.
 * Өз фотоларыңызды қосқанда URL-дарды CONFIG.photos ішінде ауыстырсаңыз жеткілікті.
 */
export const CONFIG: InvitationConfig = {
  brideName: 'Шырайлы',
  parents: 'Ласкер Мадина',
  tagline: 'Қыз ұзату',
  blessing: 'Ақ жол · Бақытты болғай',
  wishesText:
    'Қымбатты ағайын-туған, құда-жекжат, дос-жарандар! Қызымыз Шырайлы ақ жолға аттанғалы тұр. Осы қуанышымызға ортақтасып, ақ тілек білдіруге шақырамыз! Тойымыз 11.12.26 ж., сағат 19:00-де Кентау қаласы, «Хан Төре 3» тойханасында өтеді.',
  dateDisplay: '11.12.26 ж.',
  weekdayDisplay: 'Жұма күні',
  timeDisplay: '19:00',
  eventDateISO: '2026-12-11T19:00:00+05:00',
  venueName: '«Хан Төре 3» тойханасы',
  city: 'Кентау қаласы',
  address: 'Кентау қаласы, «Хан Төре 3» тойханасы',
  mapUrl:
    'https://2gis.kz/turkestan/geo/70000001103309345?inv_by=bbd6e645e7e249c6ab0efaf36be3e74b&inv_ts=1794679102',
  musicUrl: '/assets/aistudio/5588669ada1c6a66638df27bdc4c0666_7be29a14.mp3',
  brideNameImage: '/assets/aistudio/image_9878f487.png',
  portraitPhoto: {
    url: USER_BRIDE_PHOTO,
    alt: 'Қалыңдық Шырайлының қазақы ұлттық киім мен күміс әшекейлердегі бейнесі',
    caption: 'Ата-ананың аялы алақанынан — үлкен өмір жолына',
  },
  photos: [
    {
      id: 'photo-hero',
      url: heroPhoto,
      title: 'Той салтанаты залы',
      alt: 'Қыз ұзату тойы өтетін сәнді зал көрінісі',
      sectionKey: 'hero',
    },
    {
      id: 'photo-bride',
      url: USER_BRIDE_PHOTO,
      title: 'Шырайлы бейнесі',
      alt: 'Қалыңдық Шырайлының ұлттық камзол мен күміс жүзіктердегі бейнесі',
      sectionKey: 'bride',
    },
    {
      id: 'photo-details',
      url: detailsPhoto,
      title: 'Ұлттық әшекейлер',
      alt: 'Қазақы оюлы күміс және алтын әшекей бұйымдар',
      sectionKey: 'details',
    },
    {
      id: 'photo-program',
      url: feastPhoto,
      title: 'Той дастарқаны',
      alt: 'Шампань және қызыл гүлдермен безендірілген той дастарқаны',
      sectionKey: 'countdown',
    },
    {
      id: 'photo-rsvp',
      url: finalePhoto,
      title: 'Ақ жол кеші',
      alt: 'Кешкі шапақ астындағы салтанатты терраса көрінісі',
      sectionKey: 'finale',
    },
  ],
  program: [],
};
