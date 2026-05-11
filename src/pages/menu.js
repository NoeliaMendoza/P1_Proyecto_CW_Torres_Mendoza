import { define, html } from 'hybrids';

define({
    tag: 'menu-page',

    productos: () => [],

    connected: () => {
        fetch('http://localhost:3000/api/productos')
            .then((response) => response.json())
            .then((data) => {
                const element = document.querySelector('menu-page');
                if (element) {
                    element.productos = data;
                }
            })
            .catch((error) => console.error('Error fetching productos:', error));
    },

    render: ({ productos }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .menu-container {
                padding: 2rem;
            }

            .menu-title {
                text-align: center;
                color: var(--color-espresso);
                margin-bottom: 2rem;
            }

            .productos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
        </style>

        <div class="menu-container">
            <h1 class="menu-title">Nuestro Menú</h1>
            <div class="productos-grid">
                ${productos.map(
                    (producto) => html`
                        <product-card
                            nombre="${producto.nombre}"
                            descripcion="${producto.descripcion}"
                            precio="${producto.precio}"
                            imagen="${producto.imagen_url}"
                        />
                    `,
                )}
            </div>
        </div>
    `,
});
