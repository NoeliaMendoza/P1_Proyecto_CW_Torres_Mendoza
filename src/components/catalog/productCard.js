import { define, html } from 'hybrids';

define({
    tag: 'product-card',

    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    tags: () => [],

    render: ({ nombre, descripcion, precio, imagen, tags }) => html`
        <style>
            :host {
                display: block;
                font-family:
                    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
                    sans-serif;
            }

            .card {
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 2px 12px rgba(44, 26, 14, 0.08);
                overflow: hidden;
                transition:
                    transform 0.25s ease,
                    box-shadow 0.25s ease;
                display: flex;
                flex-direction: column;
            }

            .card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(44, 26, 14, 0.13);
            }

            .card-image {
                width: 100%;
                height: 180px;
                object-fit: cover;
                display: block;
            }

            .card-body {
                padding: 1rem 1rem 0.85rem;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.4rem;
                gap: 0.5rem;
            }

            .card-name {
                font-size: 1rem;
                font-weight: 700;
                color: var(--color-espresso, #2c1a0e);
                margin: 0;
                line-height: 1.3;
            }

            .card-price {
                font-size: 1rem;
                font-weight: 700;
                color: var(--color-espresso, #2c1a0e);
                white-space: nowrap;
            }

            .card-desc {
                font-size: 0.82rem;
                color: var(--color-canela, #7b4a2d);
                margin: 0 0 0.75rem;
                line-height: 1.5;
                flex: 1;
            }

            .card-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.35rem;
                margin-bottom: 0.75rem;
            }

            .tag {
                font-size: 0.68rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                background: var(--color-leche, #faf3e8);
                color: var(--color-canela, #7b4a2d);
                padding: 0.2rem 0.55rem;
                border-radius: 999px;
                border: 1px solid var(--color-crema, #e8d5b7);
            }

            .btn-agregar {
                width: 100%;
                padding: 0.6rem;
                background: var(--color-canela, #7b4a2d);
                color: #fff;
                border: none;
                border-radius: 10px;
                font-family: inherit;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition:
                    background 0.2s,
                    transform 0.15s;
                margin-top: auto;
            }

            .btn-agregar:hover {
                background: var(--color-caramelo, #c4956a);
                transform: translateY(-1px);
            }

            .btn-agregar:active {
                transform: scale(0.98);
            }
        </style>

        <div class="card">
            <img
                class="card-image"
                src="${imagen || 'https://placehold.co/400x300/e8d5b7/7b4a2d?text=Sin+imagen'}"
                alt="${nombre}"
                onerror=${(host, e) => {
                    e.target.src = 'https://placehold.co/400x300/e8d5b7/7b4a2d?text=Sin+imagen';
                }}
            />
            <div class="card-body">
                <div class="card-header">
                    <h3 class="card-name">${nombre}</h3>
                    <span class="card-price">$${parseFloat(precio).toFixed(2)}</span>
                </div>
                <p class="card-desc">${descripcion}</p>
                ${tags && tags.length > 0
                    ? html`<div class="card-tags">
                          ${tags.map((tag) => html`<span class="tag">${tag}</span>`)}
                      </div>`
                    : html``}
                <button
                    class="btn-agregar"
                    onclick=${(host) =>
                        host.dispatchEvent(
                            new CustomEvent('agregar', { bubbles: true, composed: true }),
                        )}
                >
                    Agregar
                </button>
            </div>
        </div>
    `,
});
