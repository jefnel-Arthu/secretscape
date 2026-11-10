export type AgendaEvent = {
  id: string;
  title: string;
  image: string;
  dayRange?: string;
  monthYear: string;
  description?: string;
  variant: 'featured' | 'small';
  url?: string;
  /** Date de début au format ISO (YYYY-MM-DD). Absente si les dates ne sont pas connues. */
  startDate?: string;
  /** Date de fin au format ISO (YYYY-MM-DD). */
  endDate?: string;
};

export const AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: 'vodun-days',
    title: 'Vodun Days',
    dayRange: '02-09',
    monthYear: 'JANVIER 2027',
    description:
      "Les Vodun Days, le premier rendez-vous international autour des arts, de la culture et de la spiritualité Vodun.",
    image: '/images/vodun-days-2026.jpg',
    variant: 'featured',
    url: 'https://vodundays.bj/',
    startDate: '2027-01-02',
    endDate: '2027-01-09',
  },
  {
    id: 'weloveya',
    title: 'Weloveya',
    dayRange: '26-27',
    monthYear: 'DÉCEMBRE 2026',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmTGqttfLiLn3ILfp_u63VgN55Vi_1C8gQttd8wQjb2ajlnRAzAvrbMGE&s=10',
    variant: 'small',
    url: 'https://weloveyafestival.com/',
    startDate: '2026-12-26',
    endDate: '2026-12-27',
  },
  {
    id: 'festival-masques',
    title: 'Festival des Masques',
    dayRange: '07-08',
    monthYear: 'AOÛT 2027',
    image:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj07wejFDqCzgagbVMAvwh0W36WJN1xZ7UQ_DomiR98aAn9rslNQ2ec8rEgYJEptzRj26wcSAa1W7cbP3CdelLh3Qpb3qBtAFbrjbkCJj7AwFMdb2AkWqzn79cBSF0raVB1Awa_d1n_ZwKdZ4HO1Lu4_ZnsJRwl6SmDVBvub2CK8qunK_Zn5PONui2UJB4/s750/Africa%20Exclusive%20-%20FESTIVAL%20DES%20MASQUES%20-%20Pari%20r%C3%A9ussi%20pour%20Porto-Novo.png',
    variant: 'small',
    url: 'https://festivaldesmasques.bj/',
    startDate: '2027-08-07',
    endDate: '2027-08-08',
  },
  {
    id: 'jistna',
    title: 'JISTNA',
    dayRange: '22-23',
    monthYear: 'AOÛT 2027',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrbT-tXge-bhlj-b97HHNtzdhtZj6rtlAjbqTBX-w-fw&s=10',
    variant: 'small',
    url: 'https://jistna.bj/',
    startDate: '2027-08-22',
    endDate: '2027-08-23',
  },
  {
    id: 'gaani',
    title: 'La Gaani',
    monthYear: 'AOÛT 2027',
    image:
      'https://french.news.cn/20230929/2f4614bc3b404beb859b5f53b9e93fc5/202309292f4614bc3b404beb859b5f53b9e93fc5_XxjifrF007025_20230929_CBMFN0A002.jpg',
    variant: 'small',
    url: 'https://gaani.bj/',
  },
  {
    id: 'finab',
    title: 'Festival International des Arts du Bénin (FinAB)',
    monthYear: 'DATES À VENIR',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX9e4mufe-EAr4fq4UjKLuRkz6z5mjMlw3H3yRMqMYD1k7aZxaY6mH60H7&s=10',
    variant: 'small',
  },
  {
    id: 'festichill',
    title: 'Festichill',
    monthYear: 'DATES À VENIR',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnO0ZtJ9PGbHsSmrfqHVd2Tf560RILAT2vMciRqIzNFQ&s=10',
    variant: 'small',
  },
  {
    id: 'chill-and-groove',
    title: 'Chill & Groove',
    monthYear: 'DATES À VENIR',
    image: 'https://chillandgroovefestival.com/wp-content/uploads/2026/06/CG_About_Left_2.png',
    variant: 'small',
  },
];
