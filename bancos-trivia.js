// Datos para armar preguntas de trivia y sopas de letras (se combinan en games.js).
// Cada tabla es texto: una fila por línea, campos separados por "|".

const TRIVIA_PAISES = `
Argentina|Buenos Aires|América
Brasil|Brasilia|América
Chile|Santiago|América
Uruguay|Montevideo|América
Paraguay|Asunción|América
Perú|Lima|América
Colombia|Bogotá|América
Venezuela|Caracas|América
Ecuador|Quito|América
México|Ciudad de México|América
Cuba|La Habana|América
Canadá|Ottawa|América
Estados Unidos|Washington D. C.|América
Costa Rica|San José|América
Panamá|Ciudad de Panamá|América
Guatemala|Ciudad de Guatemala|América
Honduras|Tegucigalpa|América
El Salvador|San Salvador|América
Nicaragua|Managua|América
República Dominicana|Santo Domingo|América
Haití|Puerto Príncipe|América
Jamaica|Kingston|América
España|Madrid|Europa
Francia|París|Europa
Italia|Roma|Europa
Alemania|Berlín|Europa
Portugal|Lisboa|Europa
Reino Unido|Londres|Europa
Irlanda|Dublín|Europa
Países Bajos|Ámsterdam|Europa
Bélgica|Bruselas|Europa
Suiza|Berna|Europa
Austria|Viena|Europa
Grecia|Atenas|Europa
Suecia|Estocolmo|Europa
Noruega|Oslo|Europa
Dinamarca|Copenhague|Europa
Finlandia|Helsinki|Europa
Polonia|Varsovia|Europa
Rusia|Moscú|Europa
Ucrania|Kiev|Europa
Hungría|Budapest|Europa
Chequia|Praga|Europa
Rumania|Bucarest|Europa
Bulgaria|Sofía|Europa
Croacia|Zagreb|Europa
Serbia|Belgrado|Europa
Islandia|Reikiavik|Europa
Japón|Tokio|Asia
China|Pekín|Asia
India|Nueva Delhi|Asia
Corea del Sur|Seúl|Asia
Tailandia|Bangkok|Asia
Vietnam|Hanói|Asia
Indonesia|Yakarta|Asia
Filipinas|Manila|Asia
Malasia|Kuala Lumpur|Asia
Pakistán|Islamabad|Asia
Irán|Teherán|Asia
Irak|Bagdad|Asia
Arabia Saudita|Riad|Asia
Turquía|Ankara|Asia
Afganistán|Kabul|Asia
Nepal|Katmandú|Asia
Mongolia|Ulán Bator|Asia
Kazajistán|Astaná|Asia
Bangladés|Daca|Asia
Líbano|Beirut|Asia
Jordania|Amán|Asia
Siria|Damasco|Asia
Egipto|El Cairo|África
Marruecos|Rabat|África
Argelia|Argel|África
Túnez|Túnez|África
Libia|Trípoli|África
Nigeria|Abuya|África
Kenia|Nairobi|África
Etiopía|Adís Abeba|África
Ghana|Acra|África
Senegal|Dakar|África
Angola|Luanda|África
Mozambique|Maputo|África
Zimbabue|Harare|África
Uganda|Kampala|África
Camerún|Yaundé|África
Madagascar|Antananarivo|África
Australia|Canberra|Oceanía
Nueva Zelanda|Wellington|Oceanía
Fiyi|Suva|Oceanía
Papúa Nueva Guinea|Port Moresby|Oceanía
`;

const TRIVIA_PROVINCIAS = `
Buenos Aires|La Plata
Catamarca|San Fernando del Valle de Catamarca
Chaco|Resistencia
Chubut|Rawson
Córdoba|Córdoba
Corrientes|Corrientes
Entre Ríos|Paraná
Formosa|Formosa
Jujuy|San Salvador de Jujuy
La Pampa|Santa Rosa
La Rioja|La Rioja
Mendoza|Mendoza
Misiones|Posadas
Neuquén|Neuquén
Río Negro|Viedma
Salta|Salta
San Juan|San Juan
San Luis|San Luis
Santa Cruz|Río Gallegos
Santa Fe|Santa Fe
Santiago del Estero|Santiago del Estero
Tierra del Fuego|Ushuaia
Tucumán|San Miguel de Tucumán
`;

const TRIVIA_OBRAS = `
Miguel de Cervantes|Don Quijote de la Mancha
Gabriel García Márquez|Cien años de soledad
Gabriel García Márquez|Crónica de una muerte anunciada
Jorge Luis Borges|El Aleph
Jorge Luis Borges|Ficciones
Julio Cortázar|Rayuela
Julio Cortázar|Bestiario
Ernesto Sabato|El túnel
Ernesto Sabato|Sobre héroes y tumbas
Adolfo Bioy Casares|La invención de Morel
José Hernández|Martín Fierro
Domingo F. Sarmiento|Facundo
Esteban Echeverría|El matadero
Horacio Quiroga|Cuentos de la selva
Ricardo Güiraldes|Don Segundo Sombra
Rodolfo Walsh|Operación Masacre
María Elena Walsh|Manuelita
Quino|Mafalda
Antoine de Saint-Exupéry|El Principito
William Shakespeare|Romeo y Julieta
William Shakespeare|Hamlet
Dante Alighieri|La divina comedia
Homero|La Odisea
León Tolstói|Guerra y paz
Fiódor Dostoievski|Crimen y castigo
Victor Hugo|Los miserables
Julio Verne|La vuelta al mundo en 80 días
Julio Verne|Veinte mil leguas de viaje submarino
Charles Dickens|Oliver Twist
Charles Dickens|Canción de Navidad
George Orwell|1984
George Orwell|Rebelión en la granja
Ernest Hemingway|El viejo y el mar
Federico García Lorca|Bodas de sangre
Pablo Neruda|Veinte poemas de amor y una canción desesperada
Mario Vargas Llosa|La ciudad y los perros
Isabel Allende|La casa de los espíritus
Mario Benedetti|La tregua
Eduardo Galeano|Las venas abiertas de América Latina
Jane Austen|Orgullo y prejuicio
Charlotte Brontë|Jane Eyre
Emily Brontë|Cumbres borrascosas
Mary Shelley|Frankenstein
Bram Stoker|Drácula
Arthur Conan Doyle|Sherlock Holmes
Agatha Christie|Asesinato en el Orient Express
J. R. R. Tolkien|El Señor de los Anillos
Lewis Carroll|Alicia en el país de las maravillas
Mark Twain|Las aventuras de Tom Sawyer
Jack London|Colmillo Blanco
Daniel Defoe|Robinson Crusoe
Jonathan Swift|Los viajes de Gulliver
Johann W. von Goethe|Fausto
Franz Kafka|La metamorfosis
Albert Camus|El extranjero
Umberto Eco|El nombre de la rosa
Rubén Darío|Azul
Jorge Isaacs|María
Miguel Delibes|El camino
Camilo José Cela|La colmena
Juan Rulfo|Pedro Páramo
Miguel Ángel Asturias|El señor presidente
Oscar Wilde|El retrato de Dorian Gray
Herman Melville|Moby Dick
Alexandre Dumas|Los tres mosqueteros
Alexandre Dumas|El conde de Montecristo
Robert Louis Stevenson|La isla del tesoro
Rudyard Kipling|El libro de la selva
Hans Christian Andersen|El patito feo
Hermanos Grimm|Hansel y Gretel
Charles Perrault|La Cenicienta
Carlo Collodi|Pinocho
`;

const TRIVIA_PINTURAS = `
Leonardo da Vinci|La Gioconda (Mona Lisa)
Leonardo da Vinci|La última cena
Vincent van Gogh|La noche estrellada
Vincent van Gogh|Los girasoles
Pablo Picasso|Guernica
Salvador Dalí|La persistencia de la memoria
Diego Velázquez|Las meninas
Francisco de Goya|Los fusilamientos del 3 de mayo
Francisco de Goya|La maja desnuda
Rembrandt|La ronda de noche
Johannes Vermeer|La joven de la perla
Edvard Munch|El grito
Sandro Botticelli|El nacimiento de Venus
Claude Monet|Impresión, sol naciente
Claude Monet|Los nenúfares
Pierre-Auguste Renoir|El almuerzo de los remeros
Gustav Klimt|El beso
Frida Kahlo|Las dos Fridas
Rafael Sanzio|La escuela de Atenas
Miguel Ángel|el techo de la Capilla Sixtina
Edward Hopper|Nighthawks (Halcones de la noche)
Andy Warhol|las latas de sopa Campbell
Georges Seurat|Un domingo por la tarde en la isla de la Grande Jatte
El Greco|El entierro del conde de Orgaz
Joan Miró|La masía
Paul Cézanne|Los jugadores de cartas
Henri Matisse|La danza
Marc Chagall|El cumpleaños
Benito Quinquela Martín|las escenas del puerto de La Boca
Antonio Berni|Juanito Laguna
`;

const TRIVIA_MUSICA = `
Ludwig van Beethoven|la Novena sinfonía (Oda a la alegría)
Wolfgang Amadeus Mozart|La flauta mágica
Antonio Vivaldi|Las cuatro estaciones
Johann Sebastian Bach|la Tocata y fuga en re menor
Piotr Chaikovski|El lago de los cisnes
Piotr Chaikovski|El cascanueces
Maurice Ravel|el Bolero
Giuseppe Verdi|La traviata
Gioachino Rossini|El barbero de Sevilla
Giacomo Puccini|La bohème
Richard Wagner|La cabalgata de las valquirias
Johann Strauss (hijo)|El Danubio azul
Frédéric Chopin|los Nocturnos
Claude Debussy|Claro de luna
Astor Piazzolla|Libertango
Carlos Gardel|Por una cabeza
Alberto Ginastera|el ballet Estancia
George Gershwin|Rhapsody in Blue
Georg Friedrich Händel|El Mesías
Edvard Grieg|Peer Gynt
Aníbal Troilo|Sur (tango)
Ariel Ramírez|Navidad nuestra
Atahualpa Yupanqui|Los ejes de mi carreta
Violeta Parra|Gracias a la vida
`;

const TRIVIA_MONUMENTOS = `
la Torre Eiffel|Francia
el Coliseo|Italia
el Taj Mahal|India
Machu Picchu|Perú
el Cristo Redentor|Brasil
la Gran Muralla|China
las pirámides de Guiza|Egipto
la Estatua de la Libertad|Estados Unidos
la Acrópolis|Grecia
la Sagrada Familia|España
el Big Ben|Reino Unido
la ciudad de Petra|Jordania
Chichén Itzá|México
Angkor Wat|Camboya
el Kremlin|Rusia
la Puerta de Brandeburgo|Alemania
la Torre de Pisa|Italia
la Alhambra|España
la Ópera de Sídney|Australia
el glaciar Perito Moreno|Argentina
el cerro Aconcagua|Argentina
el monte Fuji|Japón
el Kilimanjaro|Tanzania
el Salar de Uyuni|Bolivia
la Isla de Pascua|Chile
las Torres del Paine|Chile
el Palacio de Versalles|Francia
el Museo del Louvre|Francia
la Mezquita de Córdoba|España
el castillo de Neuschwanstein|Alemania
Stonehenge|Reino Unido
el Tower Bridge|Reino Unido
la Plaza Roja|Rusia
el templo de Borobudur|Indonesia
la Gran Barrera de Coral|Australia
las Líneas de Nazca|Perú
el Valle de la Luna (Ischigualasto)|Argentina
la Cueva de las Manos|Argentina
Península Valdés|Argentina
la ciudad de Ushuaia|Argentina
la Casa Rosada|Argentina
el Parque Güell|España
el Partenón|Grecia
la Fontana de Trevi|Italia
el Moulin Rouge|Francia
el Palacio de Buckingham|Reino Unido
la Torre CN|Canadá
el Empire State|Estados Unidos
`;

const TRIVIA_ANIMALES = `
el delfín|mamífero
la ballena|mamífero
el murciélago|mamífero
el ornitorrinco|mamífero
el canguro|mamífero
el elefante|mamífero
el pingüino|ave
el avestruz|ave
el cóndor|ave
el colibrí|ave
el flamenco|ave
el búho|ave
la tortuga|reptil
el cocodrilo|reptil
el yacaré|reptil
la iguana|reptil
la serpiente|reptil
el lagarto|reptil
la rana|anfibio
el sapo|anfibio
la salamandra|anfibio
el tiburón|pez
el caballito de mar|pez
la trucha|pez
el atún|pez
la anguila|pez
la raya|pez
la mariposa|insecto
la abeja|insecto
la hormiga|insecto
la mosca|insecto
el escarabajo|insecto
el mosquito|insecto
la araña|arácnido
el escorpión|arácnido
la garrapata|arácnido
el pulpo|molusco
el caracol|molusco
el calamar|molusco
la almeja|molusco
el cangrejo|crustáceo
el langostino|crustáceo
el camarón|crustáceo
`;

const TRIVIA_ELEMENTOS = `
Hidrógeno|H
Helio|He
Litio|Li
Carbono|C
Nitrógeno|N
Oxígeno|O
Flúor|F
Neón|Ne
Sodio|Na
Magnesio|Mg
Aluminio|Al
Silicio|Si
Fósforo|P
Azufre|S
Cloro|Cl
Argón|Ar
Potasio|K
Calcio|Ca
Titanio|Ti
Cromo|Cr
Hierro|Fe
Níquel|Ni
Cobre|Cu
Zinc|Zn
Bromo|Br
Plata|Ag
Estaño|Sn
Yodo|I
Tungsteno|W
Platino|Pt
Oro|Au
Mercurio|Hg
Plomo|Pb
Uranio|U
`;

// año|campeón|sede
const TRIVIA_MUNDIALES = `
1930|Uruguay|Uruguay
1934|Italia|Italia
1938|Italia|Francia
1950|Uruguay|Brasil
1954|Alemania Occidental|Suiza
1958|Brasil|Suecia
1962|Brasil|Chile
1966|Inglaterra|Inglaterra
1970|Brasil|México
1974|Alemania Occidental|Alemania Occidental
1978|Argentina|Argentina
1982|Italia|España
1986|Argentina|México
1990|Alemania Occidental|Italia
1994|Brasil|Estados Unidos
1998|Francia|Francia
2002|Brasil|Corea del Sur y Japón
2006|Italia|Alemania
2010|España|Sudáfrica
2014|Alemania|Brasil
2018|Francia|Rusia
2022|Argentina|Qatar
`;

// año|hecho (se completa "¿En qué año ...?")
const TRIVIA_HECHOS = `
1492|llegó Cristóbal Colón a América
1789|comenzó la Revolución Francesa
1810|se produjo la Revolución de Mayo
1816|se declaró la Independencia argentina
1817|San Martín cruzó la cordillera de los Andes con su ejército
1853|se sancionó la Constitución Nacional argentina
1880|Buenos Aires fue declarada capital federal de la Argentina
1882|se fundó la ciudad de La Plata
1896|se realizaron los primeros Juegos Olímpicos modernos
1903|los hermanos Wright hicieron el primer vuelo con motor
1912|se hundió el Titanic
1913|se inauguró la primera línea de subte de Buenos Aires
1914|comenzó la Primera Guerra Mundial
1918|comenzó la Reforma Universitaria en Córdoba
1928|Alexander Fleming descubrió la penicilina
1930|se jugó el primer Mundial de fútbol
1936|se inauguró el Obelisco de Buenos Aires
1936|Carlos Saavedra Lamas recibió el Premio Nobel de la Paz
1939|comenzó la Segunda Guerra Mundial
1945|terminó la Segunda Guerra Mundial
1947|Bernardo Houssay recibió el Premio Nobel de Medicina
1947|se sancionó el voto femenino en la Argentina
1957|se lanzó el Sputnik, el primer satélite artificial
1969|el hombre llegó a la Luna
1970|Luis Federico Leloir recibió el Premio Nobel de Química
1978|Argentina ganó su primer Mundial de fútbol
1980|Adolfo Pérez Esquivel recibió el Premio Nobel de la Paz
1983|volvió la democracia a la Argentina
1984|César Milstein recibió el Premio Nobel de Medicina
1986|Argentina ganó su segundo Mundial de fútbol
1989|cayó el Muro de Berlín
1991|se disolvió la Unión Soviética
1996|nació la oveja Dolly, el primer mamífero clonado
2002|el euro empezó a circular como moneda
2022|Argentina ganó su tercer Mundial de fútbol
`;

// Temas de sopa de letras: se eligen 10 palabras al azar de cada uno.
// Solo letras A-Z (sin tildes ni Ñ), hasta 11 letras.
const SOPA_TEMAS = [
  { nombre: "Animales", palabras: "GATO PERRO LEON TIGRE JIRAFA ELEFANTE CONEJO OSO CABALLO DELFIN VACA OVEJA CERDO GALLINA PATO ZORRO LOBO MONO CEBRA HIPOPOTAMO RINOCERONTE CANGURO PANDA LEOPARDO TORTUGA ARDILLA FOCA".split(" ") },
  { nombre: "Frutas", palabras: "MANZANA BANANA NARANJA UVA PERA LIMON ANANA DURAZNO FRUTILLA SANDIA MELON CEREZA CIRUELA KIWI MANGO PAPAYA COCO GRANADA POMELO MANDARINA HIGO FRAMBUESA ARANDANO MEMBRILLO".split(" ") },
  { nombre: "Colores", palabras: "ROJO AZUL VERDE AMARILLO VIOLETA NARANJA NEGRO BLANCO CELESTE MARRON GRIS ROSA DORADO PLATEADO BORDO TURQUESA LILA BEIGE FUCSIA ESMERALDA CARMESI INDIGO OCRE".split(" ") },
  { nombre: "Países de América", palabras: "CHILE BOLIVIA PARAGUAY BRASIL URUGUAY PERU ECUADOR COLOMBIA VENEZUELA GUYANA SURINAM ARGENTINA MEXICO CUBA PANAMA HAITI HONDURAS GUATEMALA NICARAGUA JAMAICA CANADA BELICE BAHAMAS BARBADOS".split(" ") },
  { nombre: "Capitales de América", palabras: "LIMA QUITO BOGOTA ASUNCION CARACAS BRASILIA SANTIAGO PANAMA MONTEVIDEO OTTAWA MANAGUA TEGUCIGALPA KINGSTON WASHINGTON GUATEMALA SUCRE".split(" ") },
  { nombre: "Deportes", palabras: "FUTBOL TENIS RUGBY BASQUET VOLEY NATACION BOXEO CICLISMO ATLETISMO HOCKEY GOLF PADDLE ESGRIMA JUDO KARATE REMO SURF ESQUI GIMNASIA POLO PELOTA EQUITACION MARATON TRIATLON BEISBOL HANDBOL SOFTBOL ALPINISMO PATINAJE LUCHA ARQUERIA".split(" ") },
  { nombre: "Flores y plantas", palabras: "ROSA TULIPAN CLAVEL JAZMIN ORQUIDEA GIRASOL VIOLETA AZUCENA MARGARITA HORTENSIA LIRIO DALIA AMAPOLA GERANIO PENSAMIENTO BEGONIA CAMELIA GARDENIA LAVANDA NARCISO CACTUS HELECHO ALBAHACA".split(" ") },
  { nombre: "Profesiones", palabras: "MEDICO MAESTRO ABOGADO PINTOR MUSICO COCINERO BOMBERO PILOTO INGENIERO PERIODISTA CARPINTERO PANADERO CARTERO ARQUITECTO ENFERMERO PLOMERO MECANICO DENTISTA ACTOR CANTANTE ESCULTOR POLICIA JARDINERO ZAPATERO SASTRE CARNICERO PESCADOR HERRERO ALBANIL CAJERO CHOFER VETERINARIO".split(" ") },
  { nombre: "Verduras", palabras: "PAPA TOMATE CEBOLLA ZANAHORIA LECHUGA ZAPALLO CALABAZA BERENJENA ESPINACA ACELGA BROCOLI COLIFLOR REPOLLO PEPINO MORRON CHOCLO BATATA REMOLACHA APIO PUERRO RABANO ARVEJA LENTEJA AJO HONGO".split(" ") },
  { nombre: "Instrumentos musicales", palabras: "GUITARRA PIANO VIOLIN TAMBOR FLAUTA ARPA TROMPETA SAXOFON CLARINETE BATERIA ACORDEON BANDONEON CELLO VIOLA OBOE TROMBON UKELELE BOMBO CHARANGO QUENA ORGANO TRIANGULO PANDERETA XILOFON BAJO MARIMBA".split(" ") },
  { nombre: "El cuerpo humano", palabras: "CABEZA BRAZO PIERNA MANO DEDO CODO RODILLA HOMBRO CUELLO ESPALDA PECHO CINTURA TOBILLO CEREBRO CORAZON PULMON HIGADO RINON ESTOMAGO NARIZ BOCA OREJA DIENTE LENGUA CEJA FRENTE MENTON MEJILLA HUESO PIEL VENA ARTERIA".split(" ") },
  { nombre: "La casa", palabras: "COCINA DORMITORIO LIVING COMEDOR ESCALERA VENTANA PUERTA TECHO PARED PISO JARDIN GARAJE TERRAZA BALCON PATIO CUARTO SILLA MESA SOFA CAMA ESCRITORIO ESTUFA HELADERA ALFOMBRA CORTINA ESPEJO LAMPARA SILLON ALMOHADA COLCHON".split(" ") },
  { nombre: "Ropa", palabras: "CAMISA PANTALON ZAPATO MEDIA FALDA VESTIDO CAMPERA SOMBRERO BUFANDA GUANTE CINTURON CORBATA SACO REMERA BUZO ZAPATILLA PIJAMA BOTA SANDALIA ABRIGO POLLERA CHALECO TRAJE BLUSA GORRA CAMISETA TAPADO PULOVER".split(" ") },
  { nombre: "Comidas argentinas", palabras: "ASADO EMPANADA MILANESA LOCRO CHORIPAN PROVOLETA MORCILLA CHORIZO ALFAJOR MEDIALUNA FACTURA PASTAFROLA PUCHERO MATAMBRE HUMITA GUISO FUGAZZETA FAINA POLENTA TORTILLA CHIMICHURRI CARBONADA TAMAL TOSTADO".split(" ") },
  { nombre: "El espacio", palabras: "MERCURIO VENUS TIERRA MARTE JUPITER SATURNO URANO NEPTUNO PLUTON SOL LUNA COMETA GALAXIA ESTRELLA ASTEROIDE ECLIPSE COSMOS ORBITA TELESCOPIO COHETE ASTRONAUTA METEORITO NEBULOSA SATELITE UNIVERSO CRATER".split(" ") },
  { nombre: "Transportes", palabras: "AUTO COLECTIVO TREN SUBTE AVION BARCO BICICLETA MOTO CAMION TAXI TRANVIA HELICOPTERO LANCHA VELERO SUBMARINO CAMIONETA TRACTOR PATINETA CARRETA GLOBO CANOA FERRY REMOLQUE BALSA CRUCERO MONOPATIN".split(" ") },
  { nombre: "Países de Europa", palabras: "ITALIA FRANCIA ALEMANIA PORTUGAL GRECIA SUECIA NORUEGA DINAMARCA FINLANDIA POLONIA RUSIA UCRANIA HUNGRIA AUSTRIA SUIZA BELGICA IRLANDA ISLANDIA CROACIA SERBIA RUMANIA BULGARIA TURQUIA ESCOCIA INGLATERRA HOLANDA ESLOVAQUIA ESTONIA LETONIA LITUANIA ALBANIA".split(" ") },
  { nombre: "Ciudades argentinas", palabras: "ROSARIO CORDOBA MENDOZA SALTA JUJUY TUCUMAN USHUAIA BARILOCHE POSADAS RESISTENCIA FORMOSA NEUQUEN PARANA CORRIENTES RAWSON TRELEW CALAFATE TANDIL OLAVARRIA JUNIN CONCORDIA LUJAN ZARATE CAMPANA TIGRE QUILMES MORON AVELLANEDA".split(" ") },
  { nombre: "Provincias argentinas", palabras: "CORDOBA MENDOZA SALTA JUJUY TUCUMAN CHACO FORMOSA MISIONES NEUQUEN CHUBUT CATAMARCA CORRIENTES".split(" ") },
  { nombre: "La naturaleza", palabras: "CERRO VALLE RIO LAGO MAR OCEANO ISLA BOSQUE SELVA DESIERTO VOLCAN GLACIAR CASCADA PRADERA PAMPA LLANURA ARROYO LAGUNA CUEVA PLAYA BAHIA PENINSULA COSTA ACANTILADO CORDILLERA CATARATA ESTEPA OASIS CANON".split(" ") },
  { nombre: "La escuela", palabras: "CUADERNO LAPIZ LIBRO MOCHILA PIZARRA MAESTRO ALUMNO REGLA GOMA TIZA BORRADOR ESCRITORIO BANCO RECREO EXAMEN TAREA CLASE MATERIA BOLIGRAFO CARPETA TIJERA PEGAMENTO COMPAS DICCIONARIO CALCULADORA UNIFORME".split(" ") },
  { nombre: "Aves", palabras: "CONDOR HORNERO TERO CARANCHO ZORZAL PINGUINO COLIBRI PALOMA GAVIOTA AGUILA HALCON BUHO LECHUZA CANARIO LORO TUCAN FLAMENCO CISNE PATO GANSO PAVO PERDIZ CALANDRIA JILGUERO CHAJA GOLONDRINA AVESTRUZ".split(" ") },
  { nombre: "Insectos y bichitos", palabras: "ABEJA HORMIGA MARIPOSA MOSCA MOSQUITO ESCARABAJO LIBELULA GRILLO CUCARACHA LUCIERNAGA AVISPA POLILLA ORUGA CHINCHE PULGA GARRAPATA ESCORPION MANTIS SALTAMONTES LOMBRIZ CARACOL BABOSA CHICHARRA".split(" ") },
  { nombre: "Mar y playa", palabras: "PLAYA ARENA OLA MAR SOMBRILLA CARPA BALDE PALA MALLA SNORKEL ANCLA BARCO PUERTO FARO MUELLE CONCHA CARACOL ALGA MAREA CORAL DELFIN BALLENA TIBURON PULPO MEDUSA CANGREJO ESTRELLA SALVAVIDAS BOYA OLEAJE BRISA GAVIOTA".split(" ") },
  { nombre: "Herramientas", palabras: "MARTILLO SERRUCHO TALADRO PINZA ALICATE LLAVE CLAVO TORNILLO TUERCA SIERRA PALA PICO RASTRILLO AZADA CEPILLO LIJA METRO NIVEL PINCEL BROCHA ESCALERA SOLDADOR CINCEL".split(" ") },
];
