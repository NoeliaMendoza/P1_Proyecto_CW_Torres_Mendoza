import { define, html } from 'hybrids';

define({
    tag: 'admin-page',

    pedidos: () => [],
    productos: () => [],
    activeTab: 'pedidos',

    connected: () => {
        const element = document.querySelector('admin-page');
        if (element) {
            element.loadPedidos();
            element.loadProductos();
        }
    },

    loadPedidos: (host) => {
        fetch('http://localhost:3000/api/admin/pedidos')
            .then((response) => response.json())
            .then((data) => {
                host.pedidos = data;
            })
            .catch((error) => console.error('Error fetching pedidos:', error));
    },

    loadProductos: (host) => {
        fetch('http://localhost:3000/api/admin/productos')
            .then((response) => response.json())
            .then((data) => {
                host.productos = data;
            })
            .catch((error) => console.error('Error fetching productos:', error));
    },

    updatePedidoEstado: (host, pedidoId, estado) => {
        fetch(`http://localhost:3000/api/admin/pedidos/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado }),
        })
            .then(() => {
                host.loadPedidos(host);
            })
            .catch((error) => console.error('Error updating pedido:', error));
    },

    render: ({ pedidos, productos, activeTab }) => html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
            }

            .admin-container {
                padding: 2rem;
            }

            .tabs {
                display: flex;
                margin-bottom: 2rem;
            }

            .tab {
                padding: 0.5rem 1rem;
                background-color: var(--color-crema);
                border: none;
                cursor: pointer;
                margin-right: 0.5rem;
            }

            .tab.active {
                background-color: var(--color-espresso);
                color: var(--color-leche);
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th,
            td {
                padding: 0.5rem;
                border: 1px solid var(--color-crema);
                text-align: left;
            }

            th {
                background-color: var(--color-espresso);
                color: var(--color-leche);
            }

            select {
                padding: 0.25rem;
            }
        </style>

        <div class="admin-container">
            <h1>Panel de Administración</h1>
            <div class="tabs">
                <button
                    class="tab ${activeTab === 'pedidos' ? 'active' : ''}"
                    onclick="${(host) => (host.activeTab = 'pedidos')}"
                >
                    Pedidos
                </button>
                <button
                    class="tab ${activeTab === 'productos' ? 'active' : ''}"
                    onclick="${(host) => (host.activeTab = 'productos')}"
                >
                    Productos
                </button>
            </div>

            ${activeTab === 'pedidos'
                ? html`
                      <h2>Pedidos</h2>
                      <table>
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Cliente</th>
                                  <th>Total</th>
                                  <th>Estado</th>
                                  <th>Fecha</th>
                                  <th>Acciones</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${pedidos.map(
                                  (pedido) => html`
                                      <tr>
                                          <td>${pedido.id}</td>
                                          <td>${pedido.nombre_cliente}</td>
                                          <td>$${pedido.total}</td>
                                          <td>
                                              <select
                                                  onchange="${(host, event) =>
                                                      host.updatePedidoEstado(
                                                          host,
                                                          pedido.id,
                                                          event.target.value,
                                                      )}"
                                              >
                                                  <option
                                                      value="pendiente"
                                                      selected="${pedido.estado === 'pendiente'}"
                                                  >
                                                      Pendiente
                                                  </option>
                                                  <option
                                                      value="en_proceso"
                                                      selected="${pedido.estado === 'en_proceso'}"
                                                  >
                                                      En Proceso
                                                  </option>
                                                  <option
                                                      value="listo"
                                                      selected="${pedido.estado === 'listo'}"
                                                  >
                                                      Listo
                                                  </option>
                                                  <option
                                                      value="entregado"
                                                      selected="${pedido.estado === 'entregado'}"
                                                  >
                                                      Entregado
                                                  </option>
                                                  <option
                                                      value="cancelado"
                                                      selected="${pedido.estado === 'cancelado'}"
                                                  >
                                                      Cancelado
                                                  </option>
                                              </select>
                                          </td>
                                          <td>
                                              ${new Date(pedido.creado_en).toLocaleDateString()}
                                          </td>
                                          <td><button>Ver Detalles</button></td>
                                      </tr>
                                  `,
                              )}
                          </tbody>
                      </table>
                  `
                : ''}
            ${activeTab === 'productos'
                ? html`
                      <h2>Productos</h2>
                      <table>
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Categoría</th>
                                  <th>Precio</th>
                                  <th>Disponible</th>
                                  <th>Acciones</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${productos.map(
                                  (producto) => html`
                                      <tr>
                                          <td>${producto.id}</td>
                                          <td>${producto.nombre}</td>
                                          <td>${producto.categoria_nombre}</td>
                                          <td>$${producto.precio}</td>
                                          <td>${producto.disponible ? 'Sí' : 'No'}</td>
                                          <td><button>Editar</button></td>
                                      </tr>
                                  `,
                              )}
                          </tbody>
                      </table>
                  `
                : ''}
        </div>
    `,
});
