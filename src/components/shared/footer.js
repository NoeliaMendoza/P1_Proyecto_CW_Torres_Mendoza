import { define, html } from 'hybrids';

define({
    tag: 'app-footer',
    render: () => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }
            footer {
                background-color: var(--color-espresso);
                padding: 24px 68px;
            }

            .footer-top {
                display: flex;
                gap: 48px;
                justify-content: space-between;
                flex-wrap: wrap;
            }

            .footer-col {
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex: 1;
            }

            .footer-col h2 {
                color: var(--color-leche);
                font-size: 1.5rem;
            }

            .footer-col h3 {
                color: var(--color-caramelo);
                font-size: 1rem;
                text-transform: uppercase;
            }

            .footer-col p {
                color: var(--color-crema);
                font-size: 0.9rem;
                margin: 0;
            }

            .footer-col a {
                text-decoration: none;
                color: var(--color-crema);
                font-size: 0.95rem;
            }

            .footer-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
        </style>

        <footer>
            <div class="footer-top">
                <div class="footer-col">
                    <h2>Marta's Coffee</h2>
                    <p>
                        Llevando la calidez del café artesanal a tu mesa, todos los días con el
                        mismo mimo de siempre.
                    </p>
                </div>
                <div class="footer-col">
                    <h3>Horario</h3>
                    <p>Lunes a Viernes: 7:00 - 20:00</p>
                    <p>Sábados: 8:00 - 16:00</p>
                    <p>Domingos: Cerrado</p>
                </div>
                <div class="footer-col">
                    <h3>Síguenos</h3>
                    <a href="">Instagram</a>
                    <a href="">Facebook</a>
                    <a href="">TikTok</a>
                </div>
            </div>
        </footer>
    `,
});
