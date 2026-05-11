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
                host.error = 'Error de conexión';
                console.error('Error:', error);
            });
    },

    render: ({ nombre, email, password, telefono, error, success }) => html`
        <section>
            <h2>Registrarse</h2>
            <form onsubmit="${(host) => host.handleSubmit(host, event)}">
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        placeholder="Tu nombre completo"
                        value="${nombre}"
                        oninput="${(host, event) => (host.nombre = event.target.value)}"
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="tucorreo@gmail.com"
                        value="${email}"
                        oninput="${(host, event) => (host.email = event.target.value)}"
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value="${password}"
                        oninput="${(host, event) => (host.password = event.target.value)}"
                        required
                    />
                </div>
                <div>
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        placeholder="0991234567"
                        value="${telefono}"
                        oninput="${(host, event) => (host.telefono = event.target.value)}"
                    />
                </div>
                ${error ? html`<p>${error}</p>` : ''} ${success ? html`<p>${success}</p>` : ''}
                <button type="submit">Registrarse</button>
            </form>
            <p>¿Ya tienes cuenta? <a href="/login">Iniciar Sesión</a></p>
        </section>
    `,
});
