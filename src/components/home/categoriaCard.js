import { define, html } from 'hybrids';

define({
    tag: 'categoria-card',

    nombre: '',
    src: '',

    render: ({ nombre, src }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .categoria-card {
                position: relative;
                overflow: hidden;
                border-radius: 25px;
                cursor: pointer;
                background-color: var(--color-crema);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .categoria-card:hover {
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                transform: translateY(-4px);
                t
            }

            .categoria-card img {
                width: 100%;
                height: 220px;
                object-fit: cover;
                border-radius: 16px 16px 0 0;
                display: block;
                padding: 10px;
                border-radius: 25px;
                box-sizing: border-box;
            }

            .card-info {
                display: flex;
                padding: 0 10px 10px;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
                background-color: transparent;
                color: var(--color-espresso);
                border-radius: 0 0 25px 25px;
            }
        </style>

        <div class="categoria-card">
            <img src="${src}" alt="${nombre}" />
            <div class="card-info">
                <span>${nombre}</span>
            </div>
        </div>
    `,
});
