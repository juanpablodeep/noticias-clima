// Bancos de palabras para el crucigrama y para Palabra oculta (los usa juegos-ln.js).
// Crucigrama: una fila por línea, "RESPUESTA|pista" (solo A-Z, de 4 a 10 letras).

const CRUCI_BANCO_TEXTO = `
ASADO|Comida típica argentina que se prepara a la parrilla
TANGO|Baile rioplatense nacido en Buenos Aires
GAUCHO|Jinete de la pampa argentina
PAMPA|Llanura extensa del centro de la Argentina
OBELISCO|Monumento emblemático de Buenos Aires
ANDES|Cordillera que bordea la Argentina por el oeste
IGUAZU|Cataratas en el límite con Brasil
MENDOZA|Provincia argentina famosa por sus vinos
PARANA|Río que baña Brasil, Paraguay y Argentina
BALLENA|Mamífero marino gigante que visita Península Valdés
GLACIAR|Gran masa de hielo, como el Perito Moreno
COLIBRI|Ave diminuta que vuela quieta en el aire
CONDOR|Gran ave de los Andes
PUMA|Felino de montaña americano
JAGUAR|Gran felino manchado de América
YACARE|Reptil del litoral, parecido al cocodrilo
HORNERO|Ave que construye su nido de barro
CARPINCHO|Roedor más grande del mundo
OCEANO|Gran extensión de agua salada
VOLCAN|Montaña que expulsa lava
DESIERTO|Región árida con muy poca lluvia
ISLA|Tierra rodeada de agua por todos lados
LAGO|Masa de agua dulce rodeada de tierra
BOSQUE|Terreno poblado de árboles
SELVA|Bosque tropical espeso
PLANETA|Cuerpo que gira alrededor de una estrella
GALAXIA|Conjunto de millones de estrellas
COMETA|Cuerpo celeste con cola luminosa
ECLIPSE|Oscurecimiento del Sol por la Luna
SATELITE|La Luna lo es de la Tierra
TELESCOPIO|Instrumento para mirar los astros
MUSEO|Lugar donde se exhiben objetos históricos
TEATRO|Sala donde se representan obras
CINE|Sala donde se proyectan películas
OPERA|Obra teatral cantada con orquesta
PINTOR|Artista de los pinceles y el óleo
ESCULTOR|Artista que talla estatuas
POETA|Autor de versos
NOVELA|Obra literaria extensa de ficción
CUENTO|Narración breve
BIBLIOTECA|Lugar donde se guardan y prestan libros
LIBRO|Conjunto de hojas encuadernadas con texto
FUTBOL|Deporte más popular del país
TENIS|Deporte de raqueta y red
RUGBY|Deporte donde juegan Los Pumas
BASQUET|Se juega con aro y pelota naranja
VOLEY|Deporte de red con pelota en el aire
NATACION|Deporte que se practica en la pileta
CICLISMO|Deporte sobre dos ruedas
ATLETISMO|Carreras y saltos en la pista
MARADONA|Diego, ídolo del fútbol argentino
MESSI|Capitán campeón del mundo en Qatar 2022
CANCHA|Terreno de juego
ARBITRO|Juez de un partido
PELOTA|Se patea o se lanza en muchos deportes
MEDICO|Profesional que atiende enfermos
MAESTRO|Enseña en la escuela
ABOGADO|Defiende en los juicios
CARPINTERO|Trabaja la madera
PANADERO|Hace el pan
COCINERO|Prepara la comida en un restaurante
BOMBERO|Apaga incendios
PILOTO|Conduce un avión
ARQUITECTO|Diseña edificios
CARTERO|Reparte las cartas
COLECTIVO|Medio de transporte urbano, también llamado bondi
SUBTE|Tren subterráneo porteño
AVION|Vuela con alas y motores
BARCO|Navega por el agua
TREN|Va sobre rieles
BICICLETA|Se pedalea
PUENTE|Une dos orillas
ESTACION|Lugar donde para el tren
CAFE|Bebida oscura y estimulante
MEDIALUNA|Factura con forma de luna creciente
EMPANADA|Masa rellena, plato típico
MILANESA|Carne rebozada y frita
ALFAJOR|Golosina de dos tapas rellena
CHOCOLATE|Dulce hecho con cacao
QUESO|Derivado de la leche
ACEITE|Líquido graso que se saca de la oliva
MANZANA|Fruta que cayó sobre Newton, según la leyenda
NARANJA|Fruta cítrica de la que se hace jugo
FRUTILLA|Fruta roja pequeña
DURAZNO|Fruta aterciopelada con carozo
BANANA|Fruta amarilla y curva
SANDIA|Fruta grande, verde por fuera y roja por dentro
LIMON|Cítrico ácido
TOMATE|Fruto rojo de la ensalada
ZANAHORIA|Raíz anaranjada
PAPA|Tubérculo que se come frito, hervido o en puré
CEBOLLA|Hortaliza que hace llorar
ZAPALLO|Hortaliza grande y anaranjada
LECHUGA|Hoja verde de la ensalada
ROSA|Flor con espinas
JAZMIN|Flor blanca muy perfumada
GIRASOL|Flor que sigue al Sol
ORQUIDEA|Flor exótica y delicada
TULIPAN|Flor holandesa en forma de copa
INVIERNO|Estación más fría
VERANO|Estación más calurosa
PRIMAVERA|Estación de las flores
LLUVIA|Cae de las nubes
TORMENTA|Lluvia con truenos y relámpagos
NIEBLA|Nube baja que reduce la visibilidad
RELAMPAGO|Destello de luz en una tormenta
ARCOIRIS|Aparece tras la lluvia cuando sale el sol
VIENTO|Aire en movimiento
HELADO|Postre frío de crema
AZUL|Color del cielo despejado
ROJO|Color de la sangre
VERDE|Color del pasto
AMARILLO|Color del limón
VIOLETA|Color entre el azul y el rojo
MUSICA|Arte de combinar sonidos
GUITARRA|Instrumento de seis cuerdas
PIANO|Instrumento de teclas blancas y negras
VIOLIN|Instrumento de cuerda y arco
TAMBOR|Instrumento que se golpea
FLAUTA|Instrumento de viento
ORQUESTA|Conjunto de músicos que tocan juntos
CANCION|Composición para cantar
RELOJ|Marca la hora
TELEFONO|Sirve para hablar a distancia
RADIO|Medio que se escucha
TELEVISOR|Aparato para ver programas
LLAVE|Abre una cerradura
VENTANA|Abertura de la pared con vidrio
PUERTA|Se abre para entrar
ESCALERA|Permite subir de un piso a otro
COCINA|Habitación donde se prepara la comida
DORMITORIO|Habitación del descanso
JARDIN|Terreno con plantas junto a la casa
ESPEJO|Refleja la imagen
ALMOHADA|Se apoya la cabeza para dormir
PARAGUAS|Protege de la lluvia
SOMBRERO|Prenda para la cabeza
ZAPATO|Calzado
BUFANDA|Abriga el cuello
GUANTE|Cubre la mano
CAMISA|Prenda con cuello y botones
PANTALON|Prenda con dos piernas
CORAZON|Órgano que bombea sangre
PULMON|Órgano de la respiración
CEREBRO|Órgano del pensamiento
ESTOMAGO|Órgano que digiere
HUESO|Parte dura del esqueleto
VITAMINA|Sustancia que el cuerpo necesita en pequeñas dosis
FARMACIA|Lugar donde se venden remedios
HOSPITAL|Lugar donde se atiende a los enfermos
ESCUELA|Donde estudian los chicos
HISTORIA|Ciencia que estudia el pasado
GEOGRAFIA|Estudia la Tierra y sus paisajes
MATEMATICA|Ciencia de los números
PALABRA|Conjunto de letras con significado
LETRA|Signo del alfabeto
CRUCIGRAMA|Pasatiempo de palabras cruzadas
SUDOKU|Pasatiempo de números en una grilla de nueve por nueve
AJEDREZ|Juego de reyes, torres y alfiles
DAMAS|Juego de fichas en un tablero
DADO|Cubo con puntos del uno al seis
NAIPE|Carta de la baraja
TRUCO|Juego de cartas muy popular en Argentina
ESCOBA|Sirve para barrer
CARNAVAL|Fiesta con disfraces y murgas
NAVIDAD|Fiesta del 25 de diciembre
BANDERA|Símbolo patrio de colores
HIMNO|Canción patria
CABILDO|Edificio histórico de la Plaza de Mayo
CONGRESO|Edificio donde se sancionan las leyes
MONEDA|Pieza de metal para pagar
BILLETE|Papel moneda
BANCO|Guarda el dinero
MERCADO|Lugar de compra y venta
PLAZA|Espacio público con bancos y árboles
CALLE|Vía urbana entre edificios
AVENIDA|Calle ancha y principal
MAPA|Representa un territorio dibujado
BRUJULA|Señala el norte
FARO|Torre con luz que guía a los barcos
PIRATA|Ladrón de los mares
TESORO|Riquezas escondidas
DRAGON|Animal fantástico que escupe fuego
BRUJA|Personaje de los cuentos que vuela en escoba
PRINCIPE|Hijo del rey
CASTILLO|Fortaleza de los reyes
LEON|Rey de la selva
TIGRE|Felino rayado
ELEFANTE|Mamífero con trompa
JIRAFA|Animal de cuello larguísimo
CABALLO|Animal que se monta
VACA|Da leche
OVEJA|Da lana
GALLINA|Pone huevos
DELFIN|Mamífero marino muy inteligente
TIBURON|Pez depredador de aletas filosas
PINGUINO|Ave que no vuela y vive en el frío
MARIPOSA|Insecto de alas coloridas
ABEJA|Insecto que hace miel
HORMIGA|Insecto trabajador que camina en fila
TORTUGA|Reptil con caparazón
CORDOBA|Provincia argentina cuya capital lleva el mismo nombre
SALTA|Provincia del noroeste conocida como "la linda"
JUJUY|Provincia argentina de la Quebrada de Humahuaca
TUCUMAN|Provincia donde se declaró la Independencia
CHACO|Provincia argentina cuya capital es Resistencia
FORMOSA|Provincia del norte limítrofe con Paraguay
MISIONES|Provincia de las Cataratas y de la yerba mate
NEUQUEN|Provincia patagónica de Vaca Muerta
USHUAIA|Ciudad más austral del mundo, en Tierra del Fuego
ROSARIO|Ciudad santafesina del Monumento a la Bandera
BARILOCHE|Ciudad turística junto al lago Nahuel Huapi
PATAGONIA|Región del sur argentino de estepas y glaciares
CHUBUT|Provincia patagónica donde queda Puerto Madryn
CATAMARCA|Provincia argentina cuya capital es San Fernando del Valle
BELGRANO|Creador de la bandera argentina
SARMIENTO|Presidente que impulsó la educación pública
CORTAZAR|Autor de "Rayuela"
BORGES|Escritor autor de "El Aleph"
QUINO|Humorista creador de Mafalda
MAFALDA|Nena de historieta que detesta la sopa
GARDEL|Zorzal criollo del tango
PIAZZOLLA|Músico que renovó el tango con su bandoneón
BANDONEON|Instrumento típico del tango
CHACARERA|Danza folclórica del norte argentino
ZAMBA|Danza folclórica argentina que se baila con pañuelo
MILONGA|Baile y música emparentados con el tango
LOCRO|Guiso patrio que se come el 25 de Mayo
PROVOLETA|Queso que se asa en la parrilla
CHORIPAN|Sándwich de chorizo
MORCILLA|Embutido de sangre de la parrilla
FERNET|Bebida amarga que se toma con cola
YERBA|Hierba con la que se prepara el mate
BOMBILLA|Cañita con filtro para tomar mate
TERERE|Mate frío típico del litoral
OMBU|Árbol de la pampa de sombra ancha
TERO|Ave de la pampa que grita para alejar intrusos
CARANCHO|Ave rapaz de la pampa
ZORZAL|Ave de canto melodioso
VIZCACHA|Roedor de la pampa que vive en cuevas
GUANACO|Camélido de la Patagonia
LLAMA|Camélido de los Andes que carga bultos
ALPACA|Camélido andino de lana muy fina
CALAFATE|Pueblo patagónico cercano al glaciar Perito Moreno
TANDIL|Ciudad bonaerense famosa por sus sierras
LUJAN|Ciudad bonaerense con una célebre basílica
RIACHUELO|Río de La Boca que separa la ciudad de Buenos Aires del Gran Buenos Aires
PALERMO|Barrio porteño de bosques y jardines
CAMINITO|Calle museo colorida de La Boca
RECOLETA|Barrio porteño famoso por su cementerio
PAMPERO|Viento frío y fuerte del sudoeste
ZONDA|Viento seco y cálido de la cordillera
BOLEADORAS|Arma de tres bolas que usaba el gaucho
FACON|Cuchillo gaucho
POTRO|Caballo joven sin domar
RASTRA|Cinto ancho del gaucho adornado con monedas
BOMBACHA|Pantalón ancho típico del gaucho
CHIRIPA|Prenda gaucha que envuelve las piernas
MALAMBO|Zapateo folclórico de los gauchos
PAYADOR|Cantor gaucho que improvisa versos
FOGON|Fuego encendido para cocinar al aire libre
ATOMO|Partícula mínima de un elemento
MOLECULA|Grupo de átomos unidos
OXIGENO|Gas que respiramos
HIDROGENO|El elemento más liviano
CARBONO|Elemento del que está hecho el diamante
GRAVEDAD|Fuerza que nos mantiene pegados al suelo
ENERGIA|Capacidad de realizar un trabajo
IMAN|Piedra que atrae al hierro
ELECTRON|Partícula del átomo con carga negativa
PROTON|Partícula del átomo con carga positiva
NEUTRON|Partícula del núcleo sin carga eléctrica
CELULA|Unidad básica de los seres vivos
GENETICA|Ciencia que estudia la herencia
BACTERIA|Microorganismo de una sola célula
VIRUS|Agente infeccioso diminuto
VACUNA|Protege contra una enfermedad
PENICILINA|Antibiótico descubierto por Fleming
CLOROFILA|Pigmento verde de las plantas
RAIZ|Parte de la planta que crece bajo tierra
TALLO|Sostiene las hojas de una planta
SEMILLA|De ella nace una planta
HOJA|Parte plana y verde de las plantas
POLEN|Polvillo amarillo de las flores
FOSIL|Resto de un ser vivo antiguo convertido en piedra
DINOSAURIO|Reptil gigante que se extinguió hace millones de años
MAMUT|Elefante prehistórico peludo
EVOLUCION|Teoría de Darwin sobre el cambio de las especies
DARWIN|Autor de "El origen de las especies"
EINSTEIN|Físico de la teoría de la relatividad
NEWTON|Físico de la ley de gravedad
GALILEO|Astrónomo que apuntó el telescopio al cielo
PASTEUR|Científico francés que dio nombre a la pasteurización
CURIE|Científica polaca con dos premios Nobel
TESLA|Inventor serbio de la corriente alterna
LAMPARA|Artefacto que da luz
TERREMOTO|Temblor fuerte de la tierra
TSUNAMI|Ola gigante provocada por un sismo
HURACAN|Tormenta tropical de vientos fuertes
TORNADO|Torbellino de viento en forma de embudo
SEQUIA|Falta prolongada de lluvias
AVALANCHA|Alud de nieve que cae por la ladera
GEISER|Chorro de agua caliente que brota de la tierra
CRATER|Boca de un volcán
LAVA|Roca fundida que sale del volcán
MAGMA|Roca fundida dentro de la Tierra
CORAL|Animal marino que forma arrecifes
ARRECIFE|Banco de rocas o corales cerca de la superficie del mar
MEDUSA|Animal marino transparente que pica
PULPO|Molusco marino de ocho brazos
CALAMAR|Molusco marino de cuerpo alargado
CANGREJO|Crustáceo que camina de costado
LANGOSTA|Crustáceo marino de carne muy apreciada
ESTRELLA|Cuerpo celeste que brilla con luz propia
UNIVERSO|Todo lo que existe, desde los átomos hasta las galaxias
ASTRONAUTA|Viaja al espacio en una nave
COHETE|Vehículo que se lanza al espacio
ORBITA|Camino que sigue un planeta alrededor del Sol
MERCURIO|Planeta más cercano al Sol
JUPITER|Planeta más grande del sistema solar
SATURNO|Planeta de los anillos
NEPTUNO|Planeta más lejano del Sol
MARTE|Planeta rojo
VENUS|Planeta más brillante del cielo nocturno
TIERRA|Planeta donde vivimos
HORIZONTE|Línea donde parecen juntarse el cielo y la tierra
COLON|Navegante que llegó a América en 1492
CESAR|Dictador romano asesinado en los idus de marzo
NAPOLEON|Emperador francés derrotado en Waterloo
CLEOPATRA|Última reina del antiguo Egipto
PIRAMIDE|Tumba monumental de los faraones
FARAON|Rey del antiguo Egipto
GLADIADOR|Luchador del Coliseo romano
IMPERIO|Estado gobernado por un emperador
CABALLERO|Noble guerrero medieval
ARMADURA|Traje de metal de los caballeros
ESPADA|Arma de hoja larga y filosa
ESCUDO|Defensa que se lleva en el brazo
CORONA|Adorno que lucen los reyes en la cabeza
TRONO|Asiento de un rey
REINA|Esposa del rey o soberana
MONARQUIA|Sistema de gobierno encabezado por un rey
REPUBLICA|Sistema de gobierno con presidente
PRESIDENTE|Jefe del Estado en una república
SENADO|Cámara alta del Congreso
DIPUTADO|Legislador de la Cámara baja
ELECCION|Votación para elegir autoridades
VOTO|Papeleta con la que se elige
ESCARAPELA|Distintivo celeste y blanco
SOLDADO|Integrante de un ejército
BATALLA|Combate entre ejércitos
TRATADO|Acuerdo firmado entre países
ESTATUA|Escultura que representa una figura
MONUMENTO|Obra que recuerda a una persona o a un hecho
VIKINGO|Navegante guerrero del norte de Europa
AZTECA|Antiguo pueblo de México
INCA|Antiguo pueblo andino que construyó Machu Picchu
MAYA|Antigua civilización de Centroamérica y el sur de México
ROMANO|Habitante de la antigua Roma
GRIEGO|Habitante de la antigua Atenas
CARTAGO|Antigua ciudad rival de Roma
QUIJOTE|Caballero de la triste figura que luchó contra molinos
SANCHO|Escudero de Don Quijote
CERVANTES|Autor de "Don Quijote de la Mancha"
HAMLET|Príncipe de Dinamarca de Shakespeare
ODISEA|Viaje de Ulises de regreso a Ítaca
ULISES|Héroe griego de la Odisea
HOMERO|Poeta griego de la Ilíada
FABULA|Relato breve con animales y moraleja
LEYENDA|Relato tradicional con elementos fantásticos
POEMA|Obra en verso
SONETO|Poema de catorce versos
VERSO|Cada línea de un poema
RIMA|Coincidencia de sonidos al final de los versos
PROSA|Forma de escribir que no es verso
ESCRITOR|Persona que escribe libros
LECTOR|Persona que lee
EDITORIAL|Empresa que publica libros
DIARIO|Periódico que se publica todos los días
REVISTA|Publicación periódica con fotos y notas
TITULAR|Encabezado de una noticia
PERIODISTA|Profesional que escribe noticias
CRONICA|Relato de hechos en orden cronológico
ENTREVISTA|Conversación para obtener información
PELICULA|Obra que se ve en el cine
ACTRIZ|Mujer que actúa
DIRECTOR|Quien dirige una película
GUION|Texto con los diálogos de una película
OSCAR|Premio dorado del cine estadounidense
ESCENA|Parte de una obra o película
TELON|Cortina grande del escenario
COMEDIA|Obra de teatro que busca hacer reír
DRAMA|Obra de tono serio y emotivo
MUSICAL|Obra con canciones y baile
BALLET|Danza clásica con puntas y tutú
VALS|Baile en compás de tres tiempos
CUMBIA|Ritmo tropical muy popular
ROCK|Género musical de guitarras eléctricas
FOLCLORE|Música y tradiciones populares de un pueblo
COPLA|Canción popular de cuatro versos
MURGA|Grupo que baila y canta en el carnaval
CORO|Conjunto de cantantes
TENOR|Cantante de voz masculina aguda
SOPRANO|Cantante de voz femenina aguda
MELODIA|Sucesión de notas que forma una tonada
RITMO|Orden de los sonidos en el tiempo
PARTITURA|Papel con las notas de una obra musical
BATUTA|Varita del director de orquesta
ESCULTURA|Obra de arte tallada o modelada
RETRATO|Pintura que representa a una persona
PAISAJE|Pintura que representa la naturaleza
ACUARELA|Pintura hecha con colores diluidos en agua
PINCEL|Herramienta del pintor
LIENZO|Tela sobre la que se pinta
CABALLETE|Soporte donde se apoya el lienzo
MURAL|Pintura sobre una pared grande
FOTO|Imagen captada por una cámara
CAMARA|Aparato para sacar fotos
GOLF|Deporte donde se embocan pelotitas en hoyos
PADDLE|Deporte de paleta y pared, muy popular entre los argentinos
BOXEO|Deporte de guantes y ring
JUDO|Arte marcial japonés
KARATE|Arte marcial de golpes y patadas
ESGRIMA|Deporte de espadas
SURF|Deporte sobre las olas con tabla
ESQUI|Deporte de deslizamiento sobre nieve
MARATON|Carrera de 42 kilómetros
TRIATLON|Prueba de natación, ciclismo y carrera
PODIO|Estrado donde suben los ganadores
MEDALLA|Premio que se cuelga al cuello
TROFEO|Premio en forma de copa
CAMPEON|Ganador de una competencia
EQUIPO|Grupo de jugadores
DELANTERO|Jugador que ataca y hace goles
ARQUERO|Jugador que ataja los tiros al arco
DEFENSOR|Jugador que protege el arco propio
PENAL|Tiro desde los doce pasos
TRIBUNA|Lugar donde se sienta el público de la cancha
ESTADIO|Gran recinto para espectáculos deportivos
RAQUETA|Se usa para golpear la pelota en el tenis
POLO|Deporte a caballo con taco y bocha
PUMAS|Seleccionado argentino de rugby
LEONES|Seleccionado argentino masculino de hockey sobre césped
FANGIO|Gran campeón argentino de automovilismo
VILAS|Tenista argentino campeón de Roland Garros en 1977
SABATINI|Tenista argentina campeona del US Open 1990
GINOBILI|Basquetbolista argentino, ídolo de los San Antonio Spurs
CUCHARA|Cubierto para tomar sopa
TENEDOR|Cubierto de varias puntas
CUCHILLO|Cubierto filoso para cortar
SARTEN|Utensilio plano con mango para freír
OLLA|Recipiente para hervir alimentos
CAZUELA|Recipiente de barro para guisos
PLATO|Recipiente plano donde se sirve la comida
VASO|Recipiente para tomar agua
TAZA|Recipiente con asa para el café
JARRA|Recipiente con pico para servir líquidos
BANDEJA|Tabla para llevar platos y vasos
SERVILLETA|Paño de papel para limpiarse la boca
MANTEL|Tela que cubre la mesa
HORNO|Aparato que cocina con calor cerrado
HELADERA|Electrodoméstico que conserva fríos los alimentos
LICUADORA|Electrodoméstico que tritura frutas
TOSTADORA|Calienta y dora las rebanadas de pan
ASPIRADORA|Electrodoméstico que absorbe el polvo
PLANCHA|Artefacto caliente para alisar la ropa
LAVARROPAS|Electrodoméstico que lava la ropa
ALFOMBRA|Tejido grueso que cubre el piso
CORTINA|Tela que cubre una ventana
COLCHON|Almohadón grande de la cama
SABANA|Tela que cubre el colchón
FRAZADA|Manta gruesa para abrigarse
SILLON|Asiento grande y cómodo
LIVING|Sala de estar de una casa
BALCON|Saliente de un edificio con baranda
TERRAZA|Azotea o techo plano transitable
PATIO|Espacio abierto dentro de una casa
GARAJE|Lugar para guardar el auto
ASCENSOR|Cabina que sube y baja por un edificio
PORTERO|Persona que cuida la entrada de un edificio
LADRILLO|Pieza de barro cocido para construir paredes
CEMENTO|Polvo gris que mezclado con agua endurece
MARTILLO|Herramienta que golpea clavos
CLAVO|Pieza metálica puntiaguda que se golpea
TORNILLO|Pieza que se enrosca con destornillador
SERRUCHO|Herramienta dentada para cortar madera
TALADRO|Herramienta que hace agujeros
PINZA|Herramienta para agarrar o sujetar
LINTERNA|Aparato portátil que da luz
PILA|Fuente de energía de un control remoto
ENCHUFE|Pieza que se conecta a la corriente
CABLE|Hilo conductor de electricidad
BILLETERA|Objeto donde se guarda el dinero
LAPICERA|Instrumento para escribir con tinta
CUADERNO|Conjunto de hojas para escribir
CARPETA|Cubierta para guardar papeles
TIJERA|Herramienta de dos hojas para cortar
PEGAMENTO|Sustancia que une dos cosas
GOMA|Sirve para borrar
BORRADOR|Se usa para limpiar el pizarrón
PIZARRON|Superficie donde escribe el maestro con tiza
MOCHILA|Bolso que se lleva en la espalda
VALIJA|Equipaje con el que se viaja
PASAPORTE|Documento para viajar al exterior
BOLETO|Comprobante para viajar en transporte
EQUIPAJE|Conjunto de valijas de un viajero
HOTEL|Establecimiento que alquila habitaciones
CABEZA|Parte del cuerpo donde está el cerebro
BRAZO|Miembro que une el hombro con la mano
PIERNA|Miembro que sostiene el cuerpo al caminar
DEDO|Cada una de las cinco partes de la mano
RODILLA|Articulación que dobla la pierna
HOMBRO|Une el brazo con el tronco
ESPALDA|Parte trasera del tronco
GARGANTA|Zona interior del cuello
LENGUA|Órgano del gusto
DIENTE|Pieza dura de la boca para masticar
NARIZ|Órgano del olfato
OREJA|Parte externa del oído
CODO|Articulación del brazo
TOBILLO|Articulación del pie
COLUMNA|Eje óseo de la espalda
ARTERIA|Vaso que lleva sangre desde el corazón
SANGRE|Líquido rojo que circula por el cuerpo
PIEL|Cubre y protege el cuerpo
MUSCULO|Tejido que permite el movimiento
HIGADO|Órgano que filtra la sangre y produce bilis
RINON|Órgano que filtra la sangre y produce orina
RETINA|Parte del ojo sensible a la luz
OIDO|Órgano de la audición
TERMOMETRO|Instrumento que mide la fiebre
FIEBRE|Aumento de la temperatura corporal
GRIPE|Enfermedad con fiebre, tos y malestar general
ENFERMERO|Ayuda a los médicos a cuidar pacientes
JERINGA|Instrumento para inyectar
PASTILLA|Remedio sólido y pequeño
JARABE|Medicamento líquido y dulce
YESO|Material que inmoviliza un hueso roto
VENDA|Tira de tela para cubrir heridas
DIETA|Régimen de alimentación
SIESTA|Descanso que se toma después del almuerzo
BOSTEZO|Abrir la boca por cansancio o aburrimiento
SONRISA|Gesto de alegría con la boca
LAGRIMA|Gota que cae de los ojos al llorar
RISA|Muestra sonora de alegría
ABRAZO|Gesto de cariño con los brazos
BESO|Gesto de cariño con los labios
CERRO|Elevación de tierra menor que una montaña
VALLE|Terreno llano entre montañas
CASCADA|Caída de agua desde cierta altura
CATARATA|Gran caída de agua de un río
LAGUNA|Lago pequeño
ARROYO|Corriente de agua menor que un río
PRADERA|Terreno extenso cubierto de hierba
LLANURA|Terreno extenso y sin elevaciones
PENINSULA|Tierra rodeada de agua salvo por un lado
BAHIA|Entrada del mar en la costa
GOLFO|Gran entrada del mar en la tierra
CABO|Punta de tierra que se adentra en el mar
ESTEPA|Llanura seca con poca vegetación
OASIS|Lugar con agua y vegetación en un desierto
CANON|Valle profundo y estrecho entre paredes de roca
CORDILLERA|Cadena de montañas
PICO|Cumbre puntiaguda de una montaña
CUMBRE|Parte más alta de una montaña
LADERA|Pendiente de una montaña
SENDERO|Camino angosto de montaña
FOGATA|Fuego que se enciende al aire libre
CAMPING|Acampar en plena naturaleza
AMANECER|Momento en que sale el sol
ATARDECER|Momento en que cae el sol
MEDIODIA|Hora en que el sol está más alto
MEDIANOCHE|Las doce de la noche
CREPUSCULO|Luz tenue al caer el sol
ROCIO|Gotitas de agua que cubren las plantas por la mañana
ESCARCHA|Hielo fino que cubre el pasto en las mañanas frías
GRANIZO|Lluvia de bolitas de hielo
NEVADA|Caída de nieve
TRUENO|Ruido fuerte que sigue al relámpago
RAYO|Descarga eléctrica de una tormenta
BRISA|Viento suave
NUBE|Masa de vapor en el cielo
CLIMA|Condiciones del tiempo en una región
LUNA|Satélite natural de la Tierra
HELADA|Descenso de temperatura bajo cero
ARENA|Granitos que forman la playa
CONCHA|Caparazón de los moluscos marinos
MAREA|Subida y bajada del nivel del mar
OLEAJE|Movimiento de las olas
ACANTILADO|Costa de roca cortada casi en vertical
PUERTO|Lugar de la costa donde atracan los barcos
MUELLE|Estructura junto al mar donde amarran barcos
ANCLA|Pieza pesada que fija el barco al fondo
VELERO|Barco que navega con velas
CANOA|Embarcación angosta que se mueve con remos
REMO|Pala larga para mover una embarcación
TIMON|Pieza que dirige un barco
CAPITAN|Jefe de un barco
MARINERO|Persona que trabaja en un barco
NAUFRAGO|Persona que sobrevive al hundimiento de un barco
LOBO|Animal que aúlla a la luna
ZORRO|Animal astuto de las fábulas
CEBRA|Animal africano de rayas blancas y negras
CANGURO|Marsupial australiano que da saltos
KOALA|Marsupial australiano que come eucalipto
PANDA|Oso blanco y negro que come bambú
GORILA|Primate más grande del mundo
MONO|Primate que trepa a los árboles
CAMELLO|Animal del desierto con una o dos jorobas
HIPOPOTAMO|Gran mamífero africano que vive en ríos
LEOPARDO|Felino manchado de África y Asia
LINCE|Felino de orejas con pinceles
HIENA|Animal carroñero que parece reírse
BUFALO|Gran bovino salvaje de cuernos curvos
CIERVO|Animal de cuernas ramificadas
JABALI|Cerdo salvaje de colmillos grandes
ARDILLA|Roedor de cola tupida que trepa árboles
CASTOR|Roedor que construye diques
NUTRIA|Mamífero acuático de pelo suave
FOCA|Mamífero marino de aletas, amigo del circo
MORSA|Mamífero marino de grandes colmillos
LORO|Ave que repite palabras
TUCAN|Ave de enorme pico colorido
PAVO|Ave de cola abierta en abanico
CISNE|Ave blanca de cuello largo y elegante
PALOMA|Ave símbolo de la paz
AGUILA|Ave rapaz de vista agudísima
HALCON|Ave rapaz usada en cetrería
LECHUZA|Ave nocturna de grandes ojos
GAVIOTA|Ave marina que vuela sobre las playas
FLAMENCO|Ave rosada que descansa sobre una pata
AVESTRUZ|Ave más grande del mundo, que no vuela
CULEBRA|Reptil sin patas, no venenoso
VIBORA|Serpiente venenosa
SAPO|Anfibio de piel rugosa
RANA|Anfibio saltador que croa
CARACOL|Molusco con casa en la espalda
LIBELULA|Insecto de cuatro alas transparentes
GRILLO|Insecto que canta de noche
LUCIERNAGA|Insecto que brilla en la oscuridad
MOSQUITO|Insecto que pica y zumba
AVISPA|Insecto rayado de aguijón
ESCORPION|Arácnido con aguijón en la cola
HARINA|Polvo de trigo para hacer pan
LECHE|Líquido blanco que da la vaca
MANTECA|Grasa que se unta en el pan
HUEVO|Lo pone la gallina
ARROZ|Cereal blanco de la paella
FIDEO|Pasta larga que se hierve
PIZZA|Masa redonda con queso y salsa
TORTILLA|Plato de huevos y papas
SOPA|Plato líquido que se come con cuchara
ENSALADA|Mezcla de verduras crudas
GUISO|Comida de cuchara con carne y verduras
SANDWICH|Comida entre dos rebanadas de pan
TOSTADA|Rebanada de pan dorada
BIZCOCHO|Masa de harina, huevo y azúcar horneada
GALLETITA|Masita dulce y crocante
CARAMELO|Golosina dura y dulce
CHICLE|Golosina que se mastica
MERMELADA|Dulce de fruta para untar
MIEL|Dulce que hacen las abejas
AZUCAR|Endulzante blanco
PIMIENTA|Especia picante molida
VINAGRE|Condimento ácido hecho de vino
MOSTAZA|Salsa amarilla para el pancho
KETCHUP|Salsa de tomate para papas fritas
JUGO|Bebida de frutas exprimidas
LICUADO|Bebida de fruta y leche batida
GASEOSA|Bebida con burbujas
CERVEZA|Bebida de cebada y lúpulo
VINO|Bebida que se hace con uvas
CHAMPAGNE|Vino espumante para brindar
BRINDIS|Gesto de levantar las copas antes de beber
INFUSION|Bebida que se hace con agua caliente y hierbas
MANZANILLA|Té de florcitas para el estómago
POSTRE|Dulce que se come al final
FLAN|Postre de huevo con caramelo
BUDIN|Postre que se hornea en molde largo
TORTA|Pastel grande con crema
PANQUEQUE|Crepé fino con dulce de leche
SALCHICHA|Embutido para el pancho
JAMON|Fiambre de cerdo
CHORIZO|Embutido para el choripán
SALAME|Fiambre seco con condimentos
PESCADO|Alimento que se saca del mar
POLLO|Ave de corral muy común en el almuerzo
CERDO|Animal del que se saca el lechón
TERNERA|Carne de vaca joven
CORDERO|Carne de oveja joven
PARIS|Capital de Francia
LONDRES|Capital del Reino Unido
ROMA|Capital de Italia
MADRID|Capital de España
BERLIN|Capital de Alemania
LISBOA|Capital de Portugal
MOSCU|Capital de Rusia
TOKIO|Capital de Japón
PEKIN|Capital de China
EGIPTO|País de las pirámides
FRANCIA|País de la Torre Eiffel
ITALIA|País con forma de bota
BRASIL|País más grande de Sudamérica
CHILE|País largo y angosto junto a los Andes
PERU|País de Machu Picchu
URUGUAY|País vecino del otro lado del Río de la Plata
PARAGUAY|País sin mar entre Argentina y Brasil
BOLIVIA|País andino sin salida al mar
MEXICO|País de los aztecas y los mayas
CUBA|Isla del Caribe famosa por el son y el tabaco
CANADA|País de la hoja de arce
AMAZONAS|Río más caudaloso del mundo
NILO|Río de Egipto que atraviesa el desierto
SAHARA|Desierto cálido más grande de África
HIMALAYA|Cordillera donde está el Everest
EVEREST|Montaña más alta del mundo
ATLANTICO|Océano que baña la costa argentina
PACIFICO|Océano más grande de la Tierra
ARTICO|Océano helado del polo norte
ANTARTIDA|Continente helado del polo sur
AFRICA|Continente de la sabana y el Sahara
ASIA|Continente más grande y poblado
EUROPA|Continente de España, Francia e Italia
OCEANIA|Continente que incluye a Australia
AMERICA|Continente donde queda la Argentina
ECUADOR|Línea imaginaria que divide la Tierra en dos hemisferios
MERIDIANO|Línea imaginaria que va de polo a polo
LATITUD|Distancia al ecuador medida en grados
INTERNET|Red mundial de computadoras
CORREO|Sistema para enviar cartas o mensajes
CELULAR|Teléfono que se lleva en el bolsillo
PANTALLA|Parte de un aparato donde se ven las imágenes
TECLADO|Conjunto de teclas para escribir
IMPRESORA|Aparato que pasa a papel lo que hay en la pantalla
PROGRAMA|Conjunto de instrucciones de una computadora
ROBOT|Máquina que realiza tareas automáticamente
ANTENA|Capta o emite ondas de radio y televisión
AURICULAR|Parte del teléfono que se apoya en la oreja
PARLANTE|Aparato que emite el sonido
CONTROL|Aparato para manejar la tele a distancia
BATERIA|Fuente de energía recargable de un celular
CARGADOR|Cable que alimenta la batería
SASTRE|Confecciona trajes a medida
HERRERO|Trabaja el hierro
ZAPATERO|Arregla o fabrica calzado
JARDINERO|Cuida plantas y canteros
PESCADOR|Persona que vive de sacar peces
CARNICERO|Vende carne
ALBANIL|Construye paredes con ladrillos
PLOMERO|Arregla cañerías
MECANICO|Repara motores
CHOFER|Persona que maneja un vehículo
DENTISTA|Cuida los dientes
CAJERO|Cobra en un negocio
VENDEDOR|Persona que vende
CLIENTE|Persona que compra
SOCIO|Miembro de un club
JEFE|Persona que manda en un trabajo
EMPLEADO|Persona que trabaja para otra
SUELDO|Dinero que se cobra por trabajar
JUBILADO|Persona que dejó de trabajar por su edad
ABUELO|Padre del padre o de la madre
NIETO|Hijo del hijo
PRIMO|Hijo del tío
SUEGRA|Madre del esposo o de la esposa
VECINO|Persona que vive cerca
AMIGO|Persona querida con la que se tiene confianza
PADRINO|Quien acompaña en el bautismo o la boda
MELLIZOS|Hermanos nacidos en el mismo parto, no idénticos
GEMELOS|Hermanos nacidos en el mismo parto, idénticos
FAMILIA|Grupo de personas unidas por parentesco
HERMANO|Hijo de los mismos padres
BEBE|Criatura recién nacida
ANCIANO|Persona de edad avanzada
`;

// Palabra oculta: palabras de 5 letras, sin tildes ni Ñ.
const PALABRAS_OCULTAS = "PLAYA LIBRO SILLA FELIZ TIGRE NUBES RELOJ CAMPO FUEGO PLATO VERDE BLUSA CARTA MUNDO NOCHE TARDE ARBOL FRUTA PERRO PAPEL LLAVE CALLE JUEGO VIAJE DULCE AMIGO CINTA BANCO PLAZA RADIO TRIGO LIMON MANGO PIANO NIEVE BRISA CIELO SELVA TENIS RUGBY GLOBO MUSEO CLIMA TRUCO NAIPE TANGO ASADO AVION BARCO COCHE MOTOR RUEDA PUNTO LINEA NORTE OESTE COSTA ARENA ROBLE CEDRO PALMA ROSAL FLORA FAUNA POTRO GANSO AGUJA SABOR AROMA GUSTO DIETA SALUD ANDEN VAGON METRO TECHO PARED HORNO JARRA PASTA PIZZA HUEVO LECHE QUESO TORTA CREMA SALSA BRAZO CARNE PECHO MENTE SABIO TEMOR HONOR AVENA ARROZ MIEDO RISAS CANTO BAILE COLOR TINTA FERIA CLASE MONTE VALLE CERRO HIELO PLUMA LLAMA ABETO ABONO ABRIL ABRIR ACERO ACTOR ADIOS ADOBE AGRIO AHORA AIRES ALBUM ALDEA ALETA ALGAS ALMAS ALTAR AMBAR AMIGA ANCHO ANDAR ANGEL ANTES ANUAL APODO APOYO ARCOS ARDER AREAS ARMAR ASEAR ASILO ASTRO ATAJO ATLAS AUDIO AUTOR AVISO AYUDA BAJAR BALAS BALDE BALSA BANDA BANDO BARBA BARRA BARRO BASAR BASES BASTA BATIR BEBER BELLA BESAR BESOS BICHO BISON BODAS BOLSA BOLSO BOMBA BOTAS BOTES BOTON BREVE BROMA BRUJA BRUMA BUENA BUENO BULTO BUSCA CABAL CABLE CABRA CACAO CAIDA CAJAS CALMA CANAL CANAS CAOBA CAPAZ CAPAS CARGA CARRO CASAR CASAS CASCO CAUSA CAZAR CEBRA CEIBO CELDA CELOS CENAR CENAS CERCA CERDO CESTA CHICO CHIVO CHOZA CICLO CIFRA CINCO CIRCO CISNE CITAR CLARA CLARO CLAVE CLAVO COBRA COBRE COCER COCOS CODOS COLAS COMER CONGA CONOS COPAS COPIA CORAL CORTE CORTO COSAS COSER CREAR CRIAR CRUDO CRUEL CUBOS CUERO CUEVA CULPA CUOTA CURSO CURVA DADOS DAMAS DANZA DATOS DEBER DEBIL DECIR DEDAL DEDOS DEJAR DELTA DENSO DEUDA DIANA DIGNO DISCO DIVAN DOGMA DOLAR DOLOR DONAR DONDE DORAR DORSO DRAMA DUCHA DUDAR DUQUE DUROS EBRIO ENERO ENTRA ENTRE EPOCA EQUIS ERROR ESTAR ETAPA ETICA EXITO EXTRA FALDA FALSO FALTA FANGO FAROL FAROS FAVOR FECHA FIBRA FICHA FIERA FIJAR FILAS FINAL FINCA FIRMA FLAMA FLOTA FLUIR FOCAS FONDO FORMA FRASE FRENO FRESA FRITO FUERA FUGAZ FUMAR FUNDA FUROR GAFAS GAITA GALAS GALGO GALLO GANAR GANAS GARRA GARZA GASAS GASES GASTO GATOS GEMAS GENIO GENTE GESTO GIRAR GIRAS GLOSA GOLES GOLPE GOMAS GORRA GOZAR GRADO GRAMO GRANO GRASA GRAVE GRIPE GRITO GRUPO GRUTA GUAPO GUIAR GUION HABAS HABER HABLA HACER HACHA HACIA HADAS HARTO HASTA HELAR HELIO HERIR HILOS HOGAR HOJAS HONDA HONDO HONGO HORAS HORDA HOTEL HUESO HUIDA HUMOR HUMOS IDEAL IDEAS IDOLO ISLAS JAMAS JARRO JAULA JEFES JERGA JOVEN JUGAR JUGOS JUNIO JUNTO JURAR JUSTO KILOS LABIO LABOR LADOS LAGOS LAMER LANAS LANZA LAPIZ LARGO LARVA LASER LATAS LAZOS LEGAL LEGUA LEJOS LENTE LENTO LETRA LIANA LIBRE LIDER LIGAR LIMBO LINCE LINDA LINDO LIRIO LISTA LISTO LLAGA LLENO LLEVA LLORA LOBOS LOCAL LOGRO LOMOS LOTES LUCES LUCHA LUEGO LUGAR LUNAR LUNAS LUNES LUPAS MADRE MAGIA MAGOS MALAS MALLA MANGA MANOS MANSO MANTA MAPAS MARCA MARCO MAREA MAREO MARTE MARZO MASAS MATES MAYOR MEDIA MEDIO MEJOR MELON MENOR MENTA MESAS MESON METAL MIGAS MILLA MINAS MIRAR MISMO MITAD MITOS MODAS MOLDE MONJA MONJE MONOS MORAL MORAS MOSCA MOSTO MOVER MUCHA MUCHO MUDAR MUELA MUJER MULTA MURAL MUROS MUSGO NABOS NACER NADAR NADIE NARIZ NATAL NAVAL NAVES NIDOS NIETO NIVEL NOBLE NOGAL NORMA NOTAR NOTAS NOVIA NOVIO NUDOS NUEVE NUEVO NUNCA OASIS OBRAR OBRAS OCASO OJERA OLIVA OLLAS ONDAS OPERA ORDEN ORUGA OSADO OSITO OTROS OVALO OVEJA OXIDO PADRE PAGAR PAGOS PALAS PALCO PANAL PANDA PANES PANZA PAPAS PARAR PARES PARTE PASAR PASEO PASOS PASTO PATAS PATIO PATOS PAUSA PAVOR PAVOS PECES PEDAL PEDIR PEGAR PEINE PELEA PELOS PENAS PERAS PERLA PESAR PESCA PESOS PESTE PICAR PICOS PIEZA PILAR PILAS PINOS PINTA PINZA PIOJO PISAR PISOS PISTA PIZCA PLACA PLAGA PLANO PLATA PLAZO PLENO PLOMO POBRE PODER POEMA POETA POLAR POLEN POLLO POLVO PONER POSTE POTES POZOS PRADO PRIMO PRISA PUDOR PUEDE PULPO PULSO PUMAS PUNTA PUROS QUEDA QUEJA QUIEN RABIA RACHA RADAR RAMAL RAMAS RAMOS RANAS RANGO RAPAZ RASGO RASPA RATAS RATON RAYAS RAYOS RAZON RECTA REDES REGAR REGLA REINA REINO REMAR REMOS RENTA RESTO RETOS RICOS RIEGO RIFAS RIMAS RIMEL RITMO RIVAL ROBAR ROBOT ROCAS RODAR ROJOS ROPAS ROSAS ROSCA RUBIA RUIDO RUMBO SABER SABIA SACAR SAGAZ SALAS SALDO SALIR SALON SALTO SANAR SANTO SAPOS SARNA SAUCE SECAR SECTA SELLO SENDA SEPIA SERIE SERIO SETAS SIGLO SIGNO SILBO SIMIO SITIO SOBRA SOBRE SOCIO SOLAR SOLES SOLOS SOPAS SOPLO SUAVE SUBIR SUCIO SUDOR SUELO SUELA SUERO SUMAR SUPER SURCO SUSTO TABLA TACOS TALLA TALLO TAMAL TANTO TAPAR TAPAS TAPIZ TAREA TARTA TAXIS TAZAS TECLA TELAR TELAS TEMAS TENER TERCO TERMO TERNO TESIS TEXTO TIBIA TILDE TINTO TIRAR TIRAS TIZAS TOCAR TODOS TOLDO TOMAR TONOS TOPES TOPOS TORRE TOSER TRAGO TRAJE TRAMO TRAPO TRATO TRAZO TRINO TRIPA TROPA TUNEL TUBOS TURBA TURNO TUTOR ULTRA UNION UNIDO URGIR URNAS USADO UTERO VACAS VACIO VAGAR VAGOS VALER VALLA VALOR VAPOR VARAS VASOS VELAR VELAS VELOZ VENAS VENDA VENIR VENTA VERBO VERSO VIDAS VIENE VIGOR VINOS VIRUS VISOR VISTA VIVAZ VIVIR VIVOS VOCES VOLAR VOTAR VUELO YEGUA YERBA ZANJA ZARPA ZONAS ZORRA ZORRO ZURDO".split(" ");
