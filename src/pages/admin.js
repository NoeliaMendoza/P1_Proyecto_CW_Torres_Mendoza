import { define, html } from 'hybrids';

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function getAvatarColor(name) {
    const colors = ['#EAE2D8', '#E6E0D4', '#E8E5DF', '#E1D9CD', '#DCD4C7'];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

define({
    tag: 'admin-page',

    activeTab: 'pedidos',
    pedidosList: {
        value: [],
        connect: (host) => {
            const loadData = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/admin/pedidos');
                    if (!response.ok) throw new Error("Error en red");
                    const data = await response.json();
                    host.pedidosList = data;
                } catch (error) {
                    console.error('Error fetching pedidos:', error);
                }
            };
            loadData();
        }
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
                // Forzar recarga
                fetch('http://localhost:3000/api/admin/pedidos')
                    .then((response) => response.json())
                    .then((data) => {
                        host.pedidosList = data;
                    });
            })
            .catch((error) => console.error('Error updating pedido:', error));
    },

    render: ({ activeTab, pedidosList }) => {
        // Calcular estadisticas
        const totalVentas = pedidosList.reduce((acc, p) => acc + parseFloat(p.total), 0).toFixed(2);
        const totalPedidos = pedidosList.length;

        return html`
        <style>
            :host {
                --color-espresso: #2c1a0e;
                --color-canela: #7b4a2d;
                --color-caramelo: #c4956a;
                --color-crema: #e8d5b7;
                --color-leche: #faf3e8;
                --color-bg: #FCF9F6;
                --color-card-bg: #F4F0EC;
                --color-border: #E8E0D5;
                
                display: block;
                background-color: var(--color-bg);
                min-height: 100vh;
                font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", Arial, sans-serif;
            }

            .dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2.5rem 2rem;
            }

            /* KPI Cards */
            .kpi-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.5rem;
                margin-bottom: 3rem;
            }

            .kpi-card {
                background-color: var(--color-card-bg);
                border: 1px solid var(--color-border);
                border-radius: 12px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1.2rem;
            }

            .kpi-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background-color: #F0DDC5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-canela);
                flex-shrink: 0;
            }

            .kpi-info h4 {
                margin: 0 0 0.3rem 0;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8C7C70;
                font-weight: 700;
            }

            .kpi-info p {
                margin: 0;
                font-size: 1.6rem;
                font-weight: 700;
                color: var(--color-espresso);
            }

            /* Header Section */
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .section-title {
                font-family: "Playfair Display", serif;
                font-size: 2.2rem;
                color: var(--color-espresso);
                margin: 0;
            }

            .actions {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .search-box {
                position: relative;
            }

            .search-box input {
                padding: 0.6rem 1rem 0.6rem 2.5rem;
                border: 1px solid var(--color-border);
                border-radius: 8px;
                background-color: #fff;
                font-size: 0.9rem;
                width: 250px;
                font-family: inherit;
            }

            .search-box svg {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #8C7C70;
            }

            .btn-filter {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                background-color: #fff;
                border: 1px solid var(--color-border);
                border-radius: 8px;
                color: var(--color-espresso);
                font-weight: 600;
                cursor: pointer;
            }

            .btn-new {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1.2rem;
                background-color: #8c5a3b;
                border: none;
                border-radius: 8px;
                color: #fff;
                font-weight: 600;
                cursor: pointer;
            }

            .btn-new:hover {
                background-color: var(--color-canela);
            }

            /* Table */
            .table-container {
                background-color: #fff;
                border: 1px solid var(--color-border);
                border-radius: 12px;
                overflow: hidden;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
            }

            thead {
                background-color: var(--color-card-bg);
            }

            th {
                padding: 1.2rem 1.5rem;
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #8C7C70;
                font-weight: 700;
                border-bottom: 1px solid var(--color-border);
            }

            td {
                padding: 1.2rem 1.5rem;
                border-bottom: 1px solid var(--color-border);
                color: var(--color-espresso);
                vertical-align: middle;
            }

            tr:last-child td {
                border-bottom: none;
            }

            .id-col {
                font-weight: 700;
                color: #A66844;
            }

            .client-col {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.85rem;
                color: var(--color-espresso);
            }

            .client-info strong {
                display: block;
                font-size: 0.95rem;
                color: var(--color-espresso);
                margin-bottom: 0.1rem;
            }

            .client-info span {
                display: block;
                font-size: 0.8rem;
                color: #8C7C70;
            }

            .products-col {
                color: #6B5C52;
                font-size: 0.9rem;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .total-col {
                font-weight: 700;
                font-size: 1.05rem;
            }

            .badge {
                display: inline-flex;
                align-items: center;
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 700;
            }

            .badge.pendiente { background-color: #FDE8D7; color: #E67A29; }
            .badge.en_proceso { background-color: #E3F2FD; color: #1976D2; }
            .badge.listo { background-color: #E8F5E9; color: #2E7D32; }
            .badge.entregado { background-color: #F5F5F5; color: #757575; }

            .actions-col {
                color: #8C7C70;
                cursor: pointer;
            }

            .actions-col:hover {
                color: var(--color-espresso);
            }

            /* Pagination */
            .pagination-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.5rem;
                background-color: var(--color-card-bg);
                border-top: 1px solid var(--color-border);
            }

            .pagination-info {
                font-size: 0.85rem;
                color: #6B5C52;
            }

            .pagination-controls {
                display: flex;
                gap: 0.3rem;
            }

            .page-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                border: none;
                background: transparent;
                color: #6B5C52;
                font-size: 0.9rem;
                cursor: pointer;
            }

            .page-btn.active {
                background-color: #8c5a3b;
                color: #fff;
                font-weight: 700;
            }

            .page-btn:hover:not(.active) {
                background-color: rgba(0,0,0,0.05);
            }
        </style>

        <div class="dashboard">
            <!-- KPIs -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    </div>
                    <div class="kpi-info">
                        <h4>Ventas Hoy</h4>
                        <p>${totalVentas}€</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="background-color: #F7E4D8;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                    </div>
                    <div class="kpi-info">
                        <h4>Pedidos</h4>
                        <p>${totalPedidos}</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="background-color: #F5E5D5;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="kpi-info">
                        <h4>Nuevos Clientes</h4>
                        <p>12</p>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon" style="background-color: #FDE8D7;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <div class="kpi-info">
                        <h4>Valoración</h4>
                        <p>4.9 / 5</p>
                    </div>
                </div>
            </div>

            <!-- Titulo y Controles -->
            <div class="section-header">
                <h2 class="section-title">Pedidos Recientes</h2>
                <div class="actions">
                    <div class="search-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" placeholder="Buscar pedido o cliente..." />
                    </div>
                    <button class="btn-filter">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        Filtros
                    </button>
                    <button class="btn-new">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Nuevo Pedido
                    </button>
                </div>
            </div>

            <!-- Tabla -->
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedidosList.map(pedido => {
                            const name = pedido.nombre_cliente || 'Cliente';
                            const email = pedido.email_cliente || 'cliente@email.com';
                            const itemsText = pedido.items && pedido.items.length 
                                ? pedido.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')
                                : 'Productos variados';

                            return html`
                            <tr>
                                <td class="id-col">#ORD-${9400 + pedido.id}</td>
                                <td>
                                    <div class="client-col">
                                        <div class="avatar" style="background-color: ${getAvatarColor(name)}">
                                            ${getInitials(name)}
                                        </div>
                                        <div class="client-info">
                                            <strong>${name}</strong>
                                            <span>${email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="products-col" title="${itemsText}">
                                    ${itemsText}
                                </td>
                                <td class="total-col">${parseFloat(pedido.total).toFixed(2)}€</td>
                                <td>
                                    <div class="badge ${pedido.estado}" onclick="${host => {
                                        // Rotar estado para la demo admin rápida (opcional, podrías hacer un modal)
                                        const estados = ['pendiente', 'en_proceso', 'listo', 'entregado'];
                                        let next = estados.indexOf(pedido.estado) + 1;
                                        if (next >= estados.length) next = 0;
                                        host.updatePedidoEstado(host, pedido.id, estados[next]);
                                    }}" style="cursor:pointer" title="Click para cambiar estado">
                                        ${pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1).replace('_', ' ')}
                                    </div>
                                </td>
                                <td class="actions-col">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                </td>
                            </tr>
                            `;
                        })}
                    </tbody>
                </table>
                <div class="pagination-bar">
                    <span class="pagination-info">Mostrando ${pedidosList.length} pedidos</span>
                    <div class="pagination-controls">
                        <button class="page-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
});
