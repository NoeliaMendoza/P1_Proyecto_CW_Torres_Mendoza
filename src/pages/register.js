import { define, html } from 'hybrids';
import { Router } from '@vaadin/router';

define({
    tag: 'register-page',

    nombre: '',
    email: '',
    password: '',
    telefono: '',
    error: '',
    success: '',

    handleSubmit: (host, event) => {
        event.preventDefault();
        fetch('http://localhost:3000/api/admin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: host.nombre,
                email: host.email,
                password: host.password,
                telefono: host.telefono,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    host.success = 'Usuario registrado exitosamente. Redirigiendo al login...';
                    setTimeout(() => Router.go('/login'), 2000);
                } else {
                    host.error = data.message || 'Error en registro';
                }
            })
            .catch((error) => {
                host.error =
                    'Hay problemas con la conexión a la base de datos. Por favor, vuelve más tarde.';
                console.error('Error:', error);
            });
    },

    render: ({ nombre, email, password, telefono, error, success }) => html`
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
                padding: 8px 0;
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

            .error,
            .success {
                color: #ff6b6b;
                text-align: center;
            }

            .success {
                color: #b5f5c0;
            }
        </style>

        <section class="login">
            <div class="login-card">
                <h2>Registrarse</h2>
                <form onsubmit="${(host, event) => host.handleSubmit(host, event)}">
                    <div class="login-field">
                        <label>Nombre</label>
                        <input
                            type="text"
                            placeholder="Tu nombre completo"
                            value="${nombre}"
                            oninput="${(host, event) => (host.nombre = event.target.value)}"
                            required
                        />
                    </div>
                    <div class="login-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="tucorreo@gmail.com"
                            value="${email}"
                            oninput="${(host, event) => (host.email = event.target.value)}"
                            required
                        />
                    </div>
                    <div class="login-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value="${password}"
                            oninput="${(host, event) => (host.password = event.target.value)}"
                            required
                        />
                    </div>
                    <div class="login-field">
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            placeholder="0991234567"
                            value="${telefono}"
                            oninput="${(host, event) => (host.telefono = event.target.value)}"
                        />
                    </div>

                    ${error ? html`<p class="error">${error}</p>` : ''}
                    ${success ? html`<p class="success">${success}</p>` : ''}

                    <button type="submit">Crear cuenta</button>
                </form>

                <p>
                    ¿Ya tienes cuenta?
                    <a href="/login">Iniciar Sesión</a>
                </p>
            </div>
        </section>
    `,
});
