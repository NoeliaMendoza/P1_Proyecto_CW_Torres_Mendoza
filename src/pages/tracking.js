import { define, html } from 'hybrids';
import { getCurrentUser } from '../utils.js';

define({
    tag: 'tracking-page',

    pedidoId: '',
    pedido: { value: null },
    pedidos: {
        value: [],
        connect: (host) => {
            const loadData = () => {
                const user = getCurrentUser();
                if (!user) {
                    host.pedidos = [];
                    return;
                }
                fetch(`http://localhost:3000/api/pedidos/usuario/${user.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        host.pedidos = data;
                    })
                    .catch(() => {
                        host.pedidos = [];
                    });
            };

            const handleUserChange = () => {
                host.requestUpdate();
                loadData();
            };
            window.addEventListener('userChanged', handleUserChange);
            loadData();

            return () => {
                window.removeEventListener('userChanged', handleUserChange);
            };
        }
    },

    user: () => getCurrentUser(),
    error: '',

    buscarPedido: (host, id) => {
        console.log("buscarPedido called with id:", id);
        const pedidoId = id || host.pedidoId;
        if (!pedidoId) return;
        host.pedidoId = pedidoId;
        fetch(`http://localhost:3000/api/pedidos/${pedidoId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("pedido data fetched:", data);
                if (data.id) {
                    host.pedido = data;
                    console.log("host.pedido updated:", host.pedido);
                    host.error = '';
                } else {
                    host.error = 'Pedido no encontrado';
                    host.pedido = null;
                }
            })
            .catch(() => {
                host.error = 'Error al buscar pedido';
                host.pedido = null;
            });
    },

    render: ({ pedidoId, pedido, error, pedidos, user }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .page {
                min-height: 100vh;
                background-color: var(--color-leche);
                padding: 2rem;
            }

            .tracking-title {
                text-align: center;
                color: var(--color-espresso);
                font-size: 2rem;
                margin-bottom: 1rem;
            }

            .historial {
                max-width: 1000px;
                margin: 0 auto 2rem;
            }

            .historial h2 {
                font-size: 1.4rem;
                color: var(--color-espresso);
                margin-bottom: 8px;
                text-align: center;
            }

            .historial-note {
                text-align: center;
                color: var(--color-espresso);
                margin-bottom: 16px;
            }

            .historial p {
                text-align: center;
                color: var(--color-espresso);
                margin-bottom: 16px;
            }

            .historial-card {
                background: #fff;
                border: 1px solid var(--color-crema);
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 12px;
                transition:
                    box-shadow 0.2s ease,
                    transform 0.2s ease;
            }

            .historial-card:hover {
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }

            .historial-card.clickable {
                cursor: pointer;
            }

            .historial-row {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .historial-row div {
                min-width: 140px;
            }

            .btn-detalle {
                padding: 10px 18px;
                border-radius: 30px;
                border: none;
                background-color: var(--color-espresso);
                color: var(--color-leche);
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .btn-detalle:hover {
                background-color: var(--color-canela);
            }

            .no-pedidos {
                text-align: center;
                color: var(--color-espresso);
            }

            /* Confirmación */
            .confirmado {
                text-align: center;
                margin-bottom: 2rem;
            }

            .confirmado-icono {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background-color: var(--color-crema);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                font-size: 1.8rem;
            }

            .confirmado h1 {
                font-size: 2rem;
                color: var(--color-espresso);
                margin-bottom: 8px;
            }

            .confirmado p {
                color: var(--color-canela);
                max-width: 480px;
                margin: 0 auto;
                line-height: 1.6;
            }

            /* Layout principal */
            .content {
                display: flex;
                gap: 24px;
                max-width: 1000px;
                margin: 0 auto;
                align-items: flex-start;
            }

            .col-left {
                flex: 2;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .col-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            /* Tarjetas */
            .card {
                background: #fff;
                border-radius: 16px;
                padding: 24px;
                border: 1px solid var(--color-crema);
            }

            /* Header del pedido */
            .pedido-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
            }

            .pedido-numero label {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--color-canela);
            }

            .pedido-numero h2 {
                font-size: 1.4rem;
                color: var(--color-espresso);
                margin-top: 4px;
            }

            .estado-badge {
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .estado-pendiente {
                background: #fff3e0;
                color: #e65100;
            }
            .estado-en_proceso {
                background: #e3f2fd;
                color: #1565c0;
            }
            .estado-listo {
                background: #e8f5e9;
                color: #2e7d32;
            }
            .estado-entregado {
                background: #f3e5f5;
                color: #6a1b9a;
            }
            .estado-cancelado {
                background: #ffebee;
                color: #c62828;
            }

            /* Items */
            .item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px 0;
                border-bottom: 1px solid var(--color-crema);
            }

            .item:last-child {
                border-bottom: none;
            }

            .item-info {
                flex: 1;
            }

            .item-info strong {
                display: block;
                color: var(--color-espresso);
                font-size: 1rem;
            }

            .item-info small {
                color: var(--color-canela);
                font-size: 0.85rem;
            }

            .item-precio {
                color: var(--color-espresso);
                font-weight: 700;
            }

            /* Detalles recogida */
            .recogida-grid {
                display: flex;
                gap: 24px;
                margin-top: 12px;
            }

            .recogida-item label {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--color-canela);
                display: block;
                margin-bottom: 4px;
            }

            .recogida-item p {
                color: var(--color-espresso);
                font-size: 0.95rem;
            }

            /* Resumen */
            .resumen h3 {
                color: var(--color-espresso);
                margin-bottom: 16px;
                font-size: 1.1rem;
            }

            .resumen-fila {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                color: var(--color-canela);
                font-size: 0.95rem;
            }

            .resumen-total {
                display: flex;
                justify-content: space-between;
                font-weight: 700;
                font-size: 1.1rem;
                color: var(--color-espresso);
                border-top: 2px solid var(--color-crema);
                padding-top: 12px;
                margin-top: 8px;
            }

            .btn-historial {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 14px;
                border-radius: 10px;
                background-color: var(--color-canela);
                color: #fff;
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                border: none;
                font-size: 1rem;
                transition: background-color 0.3s ease;
                width: 100%;
            }

            .btn-historial:hover {
                background-color: var(--color-espresso);
            }

            .btn-inicio {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px;
                border-radius: 10px;
                background-color: transparent;
                color: var(--color-espresso);
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                border: 2px solid var(--color-crema);
                font-size: 1rem;
                transition: all 0.3s ease;
                width: 100%;
            }

            .btn-inicio:hover {
                background-color: var(--color-crema);
            }

            /* Sellos */
            .sellos {
                background-color: var(--color-espresso);
                border-radius: 16px;
                padding: 20px;
                color: #fff;
            }

            .sellos h4 {
                font-size: 1rem;
                margin-bottom: 6px;
            }

            .sellos p {
                font-size: 0.85rem;
                color: var(--color-crema);
                margin-bottom: 12px;
            }

            .sellos-dots {
                display: flex;
                gap: 8px;
            }

            .sello {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--color-caramelo);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: #fff;
                font-weight: 700;
            }

            .sello.vacio {
                background-color: rgba(255, 255, 255, 0.15);
            }

            .error {
                text-align: center;
                color: #c62828;
                background: #ffebee;
                padding: 12px 24px;
                border-radius: 10px;
                max-width: 400px;
                margin: 0 auto 1rem;
            }

            /* Modal / Miniatura */
            .modal-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 1rem;
                opacity: 0;
                animation: fadeIn 0.3s forwards;
            }

            @keyframes fadeIn {
                to { opacity: 1; }
            }

            .modal-content {
                background: var(--color-leche);
                border-radius: 20px;
                padding: 2rem;
                width: 100%;
                max-width: 450px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                border: 1px solid var(--color-crema);
                transform: translateY(20px);
                animation: slideUp 0.3s forwards;
            }

            @keyframes slideUp {
                to { transform: translateY(0); }
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                background: transparent;
                border: none;
                font-size: 2rem;
                color: var(--color-espresso);
                cursor: pointer;
                line-height: 1;
                transition: color 0.3s;
                padding: 0;
            }

            .modal-close:hover {
                color: var(--color-canela);
            }

            .miniatura-header {
                text-align: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px dashed var(--color-crema);
            }

            .miniatura-header h2 {
                color: var(--color-espresso);
                font-size: 1.5rem;
                margin: 0 0 0.5rem;
            }

            .miniatura-items {
                margin-bottom: 1.5rem;
            }
            
            .miniatura-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }

            .miniatura-item:last-child {
                border-bottom: none;
            }

            .miniatura-resumen {
                background: #fff;
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid var(--color-crema);
            }
            
            .miniatura-resumen-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                color: var(--color-canela);
                font-size: 0.9rem;
            }
            
            .miniatura-resumen-total {
                display: flex;
                justify-content: space-between;
                font-weight: 700;
                color: var(--color-espresso);
                font-size: 1.1rem;
                margin-top: 0.5rem;
                padding-top: 0.5rem;
                border-top: 1px solid var(--color-crema);
            }
        </style>

        <div class="page">
            <h1 class="tracking-title">Historial de pedidos</h1>
            ${error ? html`<p class="error">${error}</p>` : ''}
            ${user
            ? html`
                      <section class="historial">
                          <h2>Pedidos realizados</h2>
                          <p class="historial-note">Selecciona un pedido para ver sus detalles.</p>
                          ${pedidos.length
                    ? pedidos.map(
                        (order) => html`
                                        <div
                                            class="historial-card clickable"
                                            onclick="${(host) => {
                                fetch(`http://localhost:3000/api/pedidos/${order.id}`)
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.id) {
                                            host.pedido = data;
                                            host.error = '';
                                        }
                                    });
                            }}"
                                        >
                                            <div class="historial-row">
                                                <div>
                                                    <strong>#MC-${order.id}</strong>
                                                    <div>
                                                        ${(order.items || []).length} artículo(s)
                                                    </div>
                                                </div>
                                                <div>
                                                    ${new Date(
                                order.creado_en,
                            ).toLocaleDateString()}
                                                </div>
                                                <div class="estado-badge estado-${order.estado}">
                                                    ${order.estado.replace('_', ' ')}
                                                </div>
                                                <div><strong>$${order.total}</strong></div>
                                                <button
                                                    class="btn-detalle"
                                                    onclick="${(host) => {
                                fetch(`http://localhost:3000/api/pedidos/${order.id}`)
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.id) {
                                            host.pedido = data;
                                            host.error = '';
                                        }
                                    });
                            }}"
                                                >
                                                    Ver detalle
                                                </button>
                                            </div>
                                        </div>
                                    `,
                    )
                    : html`<p class="no-pedidos">Aún no tienes pedidos realizados.</p>`}
                      </section>
                  `
            : html`<p class="no-pedidos">Debes iniciar sesión para ver tus pedidos.</p>`}
            ${pedido
            ? html`
                      <div class="modal-overlay" onclick="${(host) => { host.pedido = null; host.pedidoId = ''; }}">
                          <div class="modal-content" onclick="${(host, e) => e.stopPropagation()}">
                              <button class="modal-close" onclick="${(host) => { host.pedido = null; host.pedidoId = ''; }}">×</button>
                              
                              <div class="miniatura-header">
                                  <div class="confirmado-icono" style="margin: 0 auto 0.5rem; width: 48px; height: 48px; font-size: 1.4rem;">🧾</div>
                                  <h2>Pedido #MC-${pedido.id}</h2>
                                  <span class="estado-badge estado-${pedido.estado}" style="display: inline-flex; margin: 0 auto;">
                                      ${pedido.estado.replace('_', ' ')}
                                  </span>
                              </div>

                              <div class="miniatura-items">
                                  ${pedido.items.map(
                (item) => html`
                                          <div class="miniatura-item">
                                              <div class="item-info">
                                                  <strong style="font-size: 0.95rem; color: var(--color-espresso);">${item.cantidad}x ${item.nombre}</strong>
                                                  ${item.opcion_grupo ? html`<small style="display:block; margin-top:2px; color: var(--color-canela); font-size: 0.8rem;">${item.opcion_grupo}: ${item.opcion_valor}</small>` : ''}
                                              </div>
                                              <span class="item-precio" style="font-size: 0.95rem; font-weight: 700;">$${(parseFloat(item.precio_unit) * item.cantidad).toFixed(2)}</span>
                                          </div>
                                      `
            )}
                              </div>

                              <div class="miniatura-resumen">
                                  <div class="miniatura-resumen-row">
                                      <span>Subtotal</span>
                                      <span>$${(pedido.total / 1.15).toFixed(2)}</span>
                                  </div>
                                  <div class="miniatura-resumen-row">
                                      <span>Impuestos (15%)</span>
                                      <span>$${(pedido.total - (pedido.total / 1.15)).toFixed(2)}</span>
                                  </div>
                                  <div class="miniatura-resumen-total">
                                      <span>Total</span>
                                      <span>$${parseFloat(pedido.total).toFixed(2)}</span>
                                  </div>
                              </div>
                              
                              <div style="margin-top: 1.5rem; text-align: center;">
                                  <p style="font-size: 0.85rem; color: var(--color-canela); margin-bottom: 0.8rem;">Recogida en Marta's Coffee (10-15 min)</p>
                                  <button class="btn-detalle" style="width: 100%;" onclick="${(host) => { host.pedido = null; host.pedidoId = ''; }}">Cerrar detalle</button>
                              </div>
                          </div>
                      </div>
                  `
            : ''}
        </div>
    `,
});
