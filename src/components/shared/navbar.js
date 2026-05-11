import { define, html } from 'hybrids';
import { Router } from '@vaadin/router';

define({
    tag: 'nav-bar',

    render: () => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 48px;
                background-color: var(--color-leche);
                border-bottom: 2px solid var(--color-crema);
                gap: 24px;
                flex-wrap: wrap;
            }

            h1 {
                font-family: 'Playfair Display', serif;
                color: var(--color-espresso);
                letter-spacing: 0.1px;
                margin: 0;
            }

            nav {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }

            nav a {
                text-decoration: none;
                padding: 5px 24px;
                border-radius: 30px;
                border: 2px solid var(--color-espresso);
                background-color: transparent;
                color: var(--color-espresso);
                font-family: 'Lato', sans-serif;
                font-weight: 700;
                letter-spacing: 0.5px;
                white-space: nowrap;
                transition: all 0.3s ease;
            }

            nav a:hover {
                border-color: var(--color-caramelo);
                color: var(--color-canela);
            }

            .init-sesion {
                background-color: var(--color-espresso);
                color: var(--color-leche);
                border-color: var(--color-espresso);
            }

            .init-sesion:hover {
                background-color: var(--color-canela);
                border-color: var(--color-canela);
                color: var(--color-leche);
            }
        </style>

        <header>
            <h1>Marta's Coffee</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/menu">Menú</a>
                <a class="init-sesion" href="/login">Iniciar Sesión</a>
            </nav>
        </header>
    `,
});
