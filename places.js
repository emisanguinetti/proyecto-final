// Lugares naturales de Argentina que se muestran en el mapa y en la lista.
//
// IMPORTANTE:
// - Las coordenadas son aproximadas: revisalas en Google Maps antes de entregar.
// - Las imágenes son de relleno (picsum.photos, fotos al azar). Reemplazalas por fotos reales:
//   guardalas en assets/places/ y usá  require('../../assets/places/iguazu1.jpg')  en vez de la URL.

function placeholder(seed) {
  return 'https://picsum.photos/seed/' + seed + '/800/500';
}

export const PLACES = [
  {
    id: 1,
    name: 'Cataratas del Iguazú',
    province: 'Misiones',
    type: 'Cascadas',
    description:
      'Conjunto de cataratas en el límite con Brasil, en plena selva misionera. La Garganta del Diablo es el salto más imponente y se recorre por pasarelas.',
    latitude: -25.6953,
    longitude: -54.4367,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY8_NNlKS_836M3Mi4uUYyTYop3WUlPyVtbhzUHKd5GyLfxK9zPipJMIk&s=10.jpg'],
  },
  {
    id: 2,
    name: 'Glaciar Perito Moreno',
    province: 'Santa Cruz',
    type: 'Glaciares',
    description:
      'Glaciar del Parque Nacional Los Glaciares, famoso por los desprendimientos de hielo que caen sobre el Lago Argentino.',
    latitude: -50.4833,
    longitude: -73.05,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ6m1cPw7DUaqzVe0Xn4B2qlzymIxklY2-PO0HwbHLYJbXQ3ZnAAA0pELa&s=10.jpg'],
  },
  {
    id: 3,
    name: 'Cerro Aconcagua',
    province: 'Mendoza',
    type: 'Montañas',
    description:
      'La montaña más alta de América, con casi 7.000 metros. Cada año la visitan andinistas de todo el mundo.',
    latitude: -32.65,
    longitude: -70.0,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdNF71SfKlYwNX-z5uZhdkXepc7-VeLB5mEUeBDjEwFQ&s=10.jpg'],
  },
  {
    id: 4,
    name: 'Cerro de los Siete Colores',
    province: 'Jujuy',
    type: 'Quebradas',
    description:
      'Cerro de colores en Purmamarca, dentro de la Quebrada de Humahuaca, declarada Patrimonio de la Humanidad.',
    latitude: -23.7436,
    longitude: -65.4986,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQobEjTKk77OuJCAk6r_FGIodKsWTcS7GAMFghKeBLK45dARGM1qwPu_wQ&s=10.jpg'],
  },
  {
    id: 5,
    name: 'Parque Nacional Talampaya',
    province: 'La Rioja',
    type: 'Cañones',
    description:
      'Cañones de paredes rojas con petroglifos y formaciones de roca. Junto con Ischigualasto es Patrimonio de la Humanidad.',
    latitude: -29.8,
    longitude: -67.8333,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD2Tfwk-43sui20XsxyU5nW58IzX0wC7Ww2NjSSOxIpg&s=10.jpg'],
  },
  {
    id: 6,
    name: 'Península Valdés',
    province: 'Chubut',
    type: 'Fauna marina',
    description:
      'Reserva natural donde se pueden ver ballenas francas australes, lobos marinos y elefantes marinos.',
    latitude: -42.5,
    longitude: -64.0,
    images: ['https://peninsulavaldes.org.ar/wp-content/uploads/2023/09/puntapiramides-01.jpg.webp'],
  },
  {
    id: 7,
    name: 'Esteros del Iberá',
    province: 'Corrientes',
    type: 'Humedales',
    description:
      'Uno de los humedales más grandes de Sudamérica, con yacarés, carpinchos, ciervos de los pantanos y gran cantidad de aves.',
    latitude: -28.5333,
    longitude: -57.1833,
    images: ['https://www.tangol.com/Blog/Fotos/Notas/cosas-que-hacer-en-esteros-del-ibera_171_202005270644360.Original-resized.jpg'],
  },
  {
    id: 8,
    name: 'Cerro Fitz Roy',
    province: 'Santa Cruz',
    type: 'Montañas',
    description:
      'Aguja de granito en El Chaltén, una de las postales más conocidas de la Patagonia y destino clásico de trekking.',
    latitude: -49.2714,
    longitude: -73.0431,
    images: ['https://cdn.andeshandbook.org/media/route_gallery/1811200414313705.jpg'],
  },
  {
    id: 9,
    name: 'Valle de la Luna (Ischigualasto)',
    province: 'San Juan',
    type: 'Paisajes',
    description:
      'Paisaje de formas erosionadas que parece lunar. Tiene importantes yacimientos de fósiles de dinosaurios.',
    latitude: -30.1667,
    longitude: -67.9,
    images: ['https://espiritu-viajero.com/wp-content/uploads/2019/10/El-hongo-ischigualasto-valle-de-la-luna-san-juan.jpg'],
  },
  {
    id: 10,
    name: 'Quebrada del Condorito',
    province: 'Córdoba',
    type: 'Sierras',
    description:
      'Parque Nacional en las Sierras Grandes con un gran abismo donde se pueden observar cóndores.',
    latitude: -31.6333,
    longitude: -64.7,
    images: ['https://villacarlospaz.tur.ar/wp-content/uploads/2022/10/condor.jpg'],
  },
];
