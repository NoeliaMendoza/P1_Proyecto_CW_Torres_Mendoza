import { define, html } from 'hybrids';

define({
    tag: 'tracking-page',

    pedidoId: '',
    pedido: null,
    error: '',

    buscarPedido: (host) => {
        if (!host.pedidoId) return;
        fetch(`http://localhost:3000/api/pedidos/${host.pedidoId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    host.pedido = data;
                    host.error = '';
                } else {
                    host.error = 'Pedido no encontrado';
                    host.pedido = null;
                }
            })
            .catch((error) => {
                host.error = 'Error al buscar pedido';
                console.error('Error:', error);
            });
    },

    render: ({ pedidoId, pedido, error }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .tracking-container {
                max-width: 800px;
                margin: 2rem auto;
                padding: 2rem;
            }

            .tracking-title {
                text-align: center;
                color: var(--color-espresso);
                margin-bottom: 2rem;
            }

            .search-section {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                justify-content: center;
            }

            .search-section input {
                padding: 0.5rem;
                border: 1px solid var(--color-crema);
                border-radius: 8px;
                width: 200px;
            }

            .search-section button {
                padding: 0.5rem 1rem;
                background-color: var(--color-espresso);
                color: var(--color-leche);
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }

            .search-section button:hover {
                background-color: var(--color-canela);
            }

            .pedido-info {
                background-color: #fff;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .pedido-header {
                border-bottom: 2px solid var(--color-crema);
                padding-bottom: 1rem;
                margin-bottom: 1rem;
            }

            .pedido-status {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--color-espresso);
            }

            .status-pendiente {
                color: #ff9800;
            }
            .status-en_proceso {
                color: #2196f3;
            }
            .status-listo {
                color: #4caf50;
            }
            .status-entregado {
                color: #9c27b0;
            }
            .status-cancelado {
                color: #f44336;
            }

            .pedido-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .detail-item {
                margin-bottom: 0.5rem;
            }

            .detail-label {
                font-weight: bold;
                color: var(--color-canela);
            }

            .items-list {
                margin-top: 1rem;
            }

            .item {
                border-bottom: 1px solid var(--color-crema);
                padding: 0.5rem 0;
            }

            .error {
                color: red;
                text-align: center;
                margin: 2rem 0;
            }
        </style>

        <div class="tracking-container">
            <h1 class="tracking-title">Seguimiento de Pedido</h1>
            <div class="search-section">
                <input
                    type="text"
                    placeholder="Ingresa ID del pedido"
                    value="${pedidoId}"
                    oninput="${(host, event) => (host.pedidoId = event.target.value)}"
                />
                <button onclick="${(host) => host.buscarPedido(host)}">Buscar</button>
            </div>

            ${error ? html`<p class="error">${error}</p>` : ''}
            ${pedido
                ? html`
                      <div class="pedido-info">
                          <div class="pedido-header">
                              <h2>Pedido #${pedido.id}</h2>
                              <p class="pedido-status status-${pedido.estado}">
                                  ${pedido.estado.replace('_', ' ').toUpperCase()}
                              </p>
                          </div>
                          <div class="pedido-details">
                              <div class="detail-item">
                                  <span class="detail-label">Cliente:</span>
                                  ${pedido.nombre_cliente}
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Email:</span> ${pedido.email_cliente ||
                                  'N/A'}
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Teléfono:</span>
                                  ${pedido.telefono_cliente || 'N/A'}
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Total:</span> $${pedido.total}
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Fecha:</span> ${new Date(
                                      pedido.creado_en,
                                  ).toLocaleString()}
                              </div>
                              <div class="detail-item">
                                  <span class="detail-label">Notas:</span> ${pedido.notas ||
                                  'Sin notas'}
                              </div>
                          </div>
                          <div class="items-list">
                              <h3>Ítems del Pedido:</h3>
                              ${pedido.items.map(
                                  (item) => html`
                                      <div class="item">
                                          <strong>${item.nombre}</strong> - Cantidad:
                                          ${item.cantidad} - Precio: $${item.precio_unit}
                                          ${item.opcion_grupo
                                              ? html`<br /><small
                                                        >${item.opcion_grupo}:
                                                        ${item.opcion_valor}</small
                                                    >`
                                              : ''}
                                      </div>
                                  `,
                              )}
                          </div>
                      </div>
                  `
                : ''}
        </div>
    `,
});
