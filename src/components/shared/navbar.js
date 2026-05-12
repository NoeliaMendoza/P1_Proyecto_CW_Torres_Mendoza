import { define, html } from "hybrids";
import { Router } from "@vaadin/router";
import { getCurrentUser, logout, isAdmin } from "../../utils.js";

define({
  tag: "nav-bar",

  user: {
    value: null,
    connect: (host) => {
      host.user = getCurrentUser();
      const handleChange = () => {
        host.user = getCurrentUser();
      };
      window.addEventListener("storage", handleChange);
      window.addEventListener("userChanged", handleChange);
      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener("userChanged", handleChange);
      };
    },
  },

  render: ({ user }) => html`
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
        font-family: "Playfair Display", serif;
        color: var(--color-espresso);
        letter-spacing: 0.1px;
        margin: 0;
      }

      nav {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }

      nav a {
        text-decoration: none;
        padding: 5px 24px;
        border-radius: 30px;
        border: 2px solid var(--color-espresso);
        background-color: transparent;
        color: var(--color-espresso);
        font-family: "Lato", sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
        white-space: nowrap;
        transition: all 0.3s ease;
      }

      nav a:hover {
        border-color: var(--color-caramelo);
        color: var(--color-canela);
      }

      .init-sesion,
      .logout-btn {
        background-color: var(--color-espresso);
        color: var(--color-leche);
        border: 2px solid var(--color-espresso);
        padding: 5px 24px;
        border-radius: 30px;
        font-family: "Lato", sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
        white-space: nowrap;
        transition: all 0.3s ease;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .init-sesion:hover,
      .logout-btn:hover {
        background-color: var(--color-canela);
        border-color: var(--color-canela);
        color: var(--color-leche);
      }

      span {
        color: var(--color-espresso);
        font-family: "Lato", sans-serif;
        font-weight: 700;
        padding: 5px 24px;
      }

      .user-section {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    </style>

    <header>
      <h1>Marta's Coffee</h1>
      <nav>
        <a href="/">Inicio</a>
        <a href="/menu">Menú</a>
        <a href="/sugerencias">Sugerencias</a>
        ${user ? html`<a href="/tracking">Pedidos</a>` : ""}
        ${isAdmin() ? html`<a href="/admin">Inventario</a>` : ""}
      </nav>
      <div class="user-section">
        ${user
          ? html`
              <span>Bienvenido, ${user.nombre}</span>
              <button
                class="logout-btn"
                onclick="${() => {
                  logout();
                  Router.go("/");
                }}"
              >
                Cerrar Sesión
              </button>
            `
          : html`<a class="init-sesion" href="/login">Iniciar Sesión</a>`}
      </div>
    </header>
  `,
});
