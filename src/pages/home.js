import { define, html } from 'hybrids';

define({
    tag: 'home-page',

    categorias: {
        value: [],
        connect: (host, key) => {
            fetch('http://localhost:3000/api/productos/categorias')
                .then((res) => res.json())
                .then((data) => {
                    host[key] = [...data];
                    host.loading = false;
                })
                .catch((err) => {
                    console.error('Error:', err);
                    host.loading = false;
                });
        },
    },

    loading: true,

    render: ({ categorias, loading }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .hero {
                position: relative;
                height: 80vh;
                background-image:
                    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                    url('./src/images/fondo.png');
                background-size: cover;
                background-position: bottom;
                display: flex;
                align-items: center;
                padding: 0 48px;
            }

            .hero-content {
                position: relative;
                z-index: 1;
                max-width: 600px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .hero-content h2 {
                font-size: 3rem;
                color: var(--color-leche);
                line-height: 1.2;
            }

            .hero-content p {
                color: var(--color-leche);
                line-height: 1.6;
                font-size: 18px;
            }

            .hero-btns {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                margin-top: 8px;
            }

            .hero-btns a {
                text-decoration: none;
                padding: 12px 28px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .hero-btns a:first-child {
                background-color: var(--color-caramelo);
                color: var(--color-leche);
            }

            .hero-btns a:last-child {
                background-color: transparent;
                color: var(--color-leche);
                border: 2px solid rgba(255, 255, 255, 0.6);
            }

            .hero-btns a:last-child:hover {
                background-color: rgba(255, 255, 255, 0.15);
            }

            .categorias-grid {
                padding: 2rem 4rem;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }

            .categorias-titulo {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 2rem 4rem 0;
            }

            .btn-ver-mas {
                text-decoration: none;
                padding: 10px 24px;
                border-radius: 30px;
                background-color: var(--color-espresso);
                color: var(--color-leche);
                font-weight: 700;
                transition: background-color 0.3s ease;
            }

            .btn-ver-mas:hover {
                background-color: var(--color-canela);
            }

            /**/
            .recomendacion {
                padding: 64px 48px;
                background-color: var(--color-leche);
            }

            .recomendacion-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .recomendacion-header h2 {
                font-size: clamp(1.5rem, 3vw, 2rem);
                color: var(--color-espresso);
                margin-bottom: 8px;
            }

            .recomendacion-header p {
                color: var(--color-canela);
                font-size: 1rem;
            }

            .recomendacion-cards {
                display: flex;
                flex-wrap: wrap;
                gap: 24px;
            }

            .rec-card {
                flex: 1 1 250px;
                background-color: #fff;
                border-radius: 36px 0;
                padding: 32px 24px;
                border: 2px solid var(--color-canela);
                transition:
                    transform 0.3s ease,
                    box-shadow 0.3s ease;
            }

            .rec-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 24px rgba(44, 26, 14, 0.1);
            }

            .rec-card h3 {
                font-size: 1.2rem;
                color: var(--color-espresso);
                margin-bottom: 10px;
            }

            .rec-card p {
                color: var(--color-canela);
                font-size: 1rem;
                line-height: 1.6;
            }
            .rec-card img {
                width: 100%;
                height: 260px;
                object-fit: contain;
            }
        </style>

        <section class="hero">
            <div class="hero-content">
                <h2>Marta's Coffee: Calidez en cada taza</h2>
                <p>Descubre el sabor auténtico del café de especialidad.</p>
                <div class="hero-btns">
                    <a href="#menu">Ver menú</a>
                    <a href="">Nuestra Historia</a>
                </div>
            </div>
        </section>

        <section>
            <div class="categorias-titulo">
                <h2>Explora Nuestras Categorías</h2>
                <a class="btn-ver-mas" href="#menu">Ver menú completo</a>
            </div>
            <div class="categorias-grid">
                ${loading
                    ? html`<p>Cargando categorías...</p>`
                    : categorias.length > 0
                      ? categorias.map(
                            (categoria) => html`
                                <categoria-card
                                    nombre="${categoria.nombre}"
                                    src="${categoria.imagen_url}"
                                />
                            `,
                        )
                      : html`<p>No se encontraron categorías</p>`}
            </div>
        </section>

        <section class="recomendacion">
            <div class="recomendacion-header">
                <h2>Hecho para cada momento</h2>
                <p>Según el clima del día, tenemos algo especial para ti.</p>
            </div>
            <div class="recomendacion-cards">
                <div class="rec-card">
                    <img src="./src/images/dia-caluroso.png" alt="Día caluroso" />
                    <h3>Día caluroso</h3>
                    <p>Refréscate con nuestros batidos fríos y cafés helados.</p>
                </div>
                <div class="rec-card">
                    <img src="./src/images/dia-templado.png" alt="Día templado" />
                    <h3>Día templado</h3>
                    <p>Perfecto para un cappuccino o un té de temporada.</p>
                </div>
                <div class="rec-card">
                    <img src="./src/images/dia-frio.png" alt="Día frío" />
                    <h3>Día frío</h3>
                    <p>Calienta el alma con un espresso o chocolate caliente.</p>
                </div>
            </div>
        </section>
    `,
});
