import { define, html } from 'hybrids';

define({
    tag: 'product-card',

    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',

    render: ({ nombre, descripcion, precio, imagen }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .product-card {
                background-color: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                transition: transform 0.3s ease;
            }

            .product-card:hover {
                transform: translateY(-5px);
            }

            .product-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
            }

            .product-info {
                padding: 16px;
            }

            .product-name {
                font-size: 1.2rem;
                color: var(--color-espresso);
                margin-bottom: 8px;
            }

            .product-description {
                color: var(--color-canela);
                font-size: 0.9rem;
                margin-bottom: 12px;
            }

            .product-price {
                font-size: 1.1rem;
                color: var(--color-espresso);
                font-weight: bold;
            }
        </style>

        <div class="product-card">
            <img class="product-image" src="${imagen}" alt="${nombre}" />
            <div class="product-info">
                <h3 class="product-name">${nombre}</h3>
                <p class="product-description">${descripcion}</p>
                <p class="product-price">$${precio}</p>
            </div>
        </div>
    `,
});
