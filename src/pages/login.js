import { define, html } from 'hybrids';
import { Router } from '@vaadin/router';

define({
    tag: 'login-page',

    email: '',
    password: '',
    error: '',

    render: ({ email, password, error }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .login {
                min-height: 80vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: url('./src/images/fondo.png');
                background-size: cover;
                background-position: center;
                border-radius: 25px;
                margin: 25px;
            }

            .login-card {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.385);
                border-radius: 20px;
                padding: 48px 40px;
                width: 100%;
                max-width: 420px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                color: #fff;
            }

            .login-card h2 {
                text-align: center;
                font-size: 1.8rem;
            }

            .login-field {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .login-field label {
                font-size: 0.95rem;
            }

            .login-field input {
                background: transparent;
                border: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                padding: 8px 0;
                color: #fff;
                font-size: 1rem;
                outline: none;
            }

            .login-card button {
                padding: 15px;
                border-radius: 30px;
                border: none;
                background-color: rgb(37, 19, 5);
                color: var(--color-leche);
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: opacity 0.3s ease;
            }

            .login-card button:hover {
                opacity: 0.8;
            }

            .login-card p {
                text-align: center;
                font-size: 1rem;
            }

            .login-card p a {
                font-weight: 700;
                text-decoration: none;
                color: #fff;
            }

            .error {
                color: #ff6b6b;
                text-align: center;
            }
        </style>

        <section class="login">
            <div class="login-card">
                <h2>Iniciar Sesión</h2>

                <div class="login-field">
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="tucorreo@gmail.com"
                        value="${email}"
                        oninput="${(host, e) => (host.email = e.target.value)}"
                    />
                </div>

                <div class="login-field">
                    <label>Contraseña</label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value="${password}"
                        oninput="${(host, e) => (host.password = e.target.value)}"
                    />
                </div>

                ${error ? html`<p class="error">${error}</p>` : ''}

                <button
                    onclick="${async (host) => {
                        try {
                            const response = await fetch('http://localhost:3000/api/admin/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: host.email,
                                    password: host.password,
                                }),
                            });
                            const data = await response.json();
                            if (response.ok) {
                                localStorage.setItem('user', JSON.stringify(data));
                                window.dispatchEvent(new CustomEvent('userChanged'));
                                data.rol === 'admin' ? Router.go('/admin') : Router.go('/');
                            } else {
                                host.error = data.message || 'Credenciales incorrectas';
                            }
                        } catch (e) {
                            host.error = 'Error de conexión';
                        }
                    }}"
                >
                    Iniciar Sesión
                </button>

                <p>
                    ¿No tienes cuenta?
                    <a href="/register">Regístrate</a>
                </p>
            </div>
        </section>
    `,
});
