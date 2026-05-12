import { define, html } from 'hybrids';
import { getCurrentUser } from '../utils.js';

define({
    tag: 'checkout-page',

    cargando: true,
    error: '',

    pedidoConfirmado: {
        value: null,
        connect: (host) => {
            const confirmarPedido = async () => {
            try {
                const storedCart = sessionStorage.getItem("pedido_pendiente");
                if (!storedCart) {
                    host.error = "No hay pedido pendiente.";
                    host.cargando = false;
                    return;
                }

                const cartItems = JSON.parse(storedCart);
                if (!cartItems || cartItems.length === 0) {
                    host.error = "El carrito está vacío.";
                    host.cargando = false;
                    return;
                }

                const user = getCurrentUser() || {};
                
                const body = {
                    usuario_id: user.id || null,
                    nombre_cliente: user.nombre || 'Cliente Local',
                    email_cliente: user.email || 'anonimo@example.com',
                    telefono_cliente: '000000000',
                    notas: '',
                    items: cartItems.map(item => ({
                        producto_id: item.id,
                        nombre: item.nombre,
                        opcion_grupo: '',
                        opcion_valor: '',
                        precio_unit: parseFloat(item.precio),
                        cantidad: item.cantidad
                    }))
                };

                const res = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (!res.ok) throw new Error('Error al crear el pedido');
                
                const data = await res.json();
                
                // Limpiar el carrito
                sessionStorage.removeItem("pedido_pendiente");

                // Calcular totales
                const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
                const impuestos = subtotal * 0.10;
                const total = subtotal + impuestos;

                host.pedidoConfirmado = {
                    id: data.id,
                    estado: 'Pendiente',
                    items: cartItems,
                    subtotal: subtotal.toFixed(2),
                    impuestos: impuestos.toFixed(2),
                    total: total.toFixed(2)
                };
                
            } catch (err) {
                host.error = err.message;
            } finally {
                host.cargando = false;
            }
        };

        confirmarPedido();
    }},

    render: ({ pedidoConfirmado, cargando, error }) => {
        if (cargando) {
            return html`<div class="loading">Procesando tu pedido...</div>`;
        }

        if (error) {
            return html`
                <div class="error-container">
                    <h2>Ups...</h2>
                    <p>${error}</p>
                    <a href="/menu" class="btn-inicio">Volver al menú</a>
                </div>
            `;
        }

        return html`
            <style>
                :host {
                    display: block;
                    background-color: var(--color-leche, #faf3e8);
                    min-height: 100vh;
                    padding: 3rem 1.5rem;
                    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", Arial, sans-serif;
                }

                .checkout-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                /* Header */
                .header-section {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .icon-check {
                    width: 72px;
                    height: 72px;
                    background-color: #eebb99;
                    color: var(--color-espresso, #2c1a0e);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }

                .icon-check svg {
                    width: 32px;
                    height: 32px;
                }

                .title {
                    font-size: 2.8rem;
                    font-weight: 800;
                    color: var(--color-espresso, #2c1a0e);
                    margin: 0 0 1rem;
                    letter-spacing: -0.5px;
                }

                .subtitle {
                    color: var(--color-canela, #7b4a2d);
                    font-size: 1.1rem;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Grid Layout */
                .grid-layout {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                }

                @media (max-width: 800px) {
                    .grid-layout {
                        grid-template-columns: 1fr;
                    }
                }

                /* Cards */
                .card {
                    background-color: #f3eae1;
                    border-radius: 12px;
                    padding: 2rem;
                    border: 1px solid rgba(44, 26, 14, 0.05);
                }

                .card-dark {
                    background-color: var(--color-espresso, #2c1a0e);
                    color: #fff;
                }

                /* Order Details (Left) */
                .order-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 2px solid rgba(123, 74, 45, 0.1);
                    padding-bottom: 1rem;
                    margin-bottom: 1.5rem;
                }

                .order-number label {
                    display: block;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-canela, #7b4a2d);
                    font-weight: 700;
                    margin-bottom: 0.3rem;
                }

                .order-number h2 {
                    margin: 0;
                    font-size: 1.6rem;
                    color: var(--color-espresso, #2c1a0e);
                }

                .order-status {
                    text-align: right;
                }

                .order-status label {
                    display: block;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-canela, #7b4a2d);
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .badge {
                    background-color: #fcdfc4;
                    color: var(--color-espresso, #2c1a0e);
                    padding: 0.3rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .badge::before {
                    content: '';
                    display: block;
                    width: 10px;
                    height: 2px;
                    background-color: currentColor;
                    border-radius: 2px;
                }

                /* Items List */
                .item-row {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    margin-bottom: 1.5rem;
                }

                .item-row:last-child {
                    margin-bottom: 0;
                }

                .item-image {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    object-fit: cover;
                    background-color: #fff;
                    flex-shrink: 0;
                    border: 1px solid rgba(44, 26, 14, 0.05);
                }

                .item-info {
                    flex: 1;
                }

                .item-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--color-espresso, #2c1a0e);
                    margin: 0 0 0.2rem;
                }

                .item-desc {
                    font-size: 0.85rem;
                    color: var(--color-canela, #7b4a2d);
                    font-style: italic;
                    margin: 0;
                }

                .item-price {
                    font-weight: 700;
                    color: var(--color-espresso, #2c1a0e);
                    font-size: 1rem;
                }

                /* Pickup Details */
                .pickup-card {
                    margin-top: 1.5rem;
                    padding: 1.5rem;
                }

                .pickup-card h3 {
                    margin: 0 0 1.5rem;
                    font-size: 1.4rem;
                    color: var(--color-espresso, #2c1a0e);
                }

                .pickup-grid {
                    display: flex;
                    gap: 3rem;
                }

                .pickup-item {
                    display: flex;
                    gap: 0.8rem;
                    align-items: flex-start;
                }

                .pickup-icon {
                    color: var(--color-canela, #7b4a2d);
                    margin-top: 2px;
                }

                .pickup-content label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--color-canela, #7b4a2d);
                    margin-bottom: 0.3rem;
                }

                .pickup-content p {
                    margin: 0;
                    font-size: 1rem;
                    color: var(--color-espresso, #2c1a0e);
                }

                /* Summary (Right) */
                .summary-card {
                    background-color: #e8ded4; /* Slightly different cream */
                    padding: 2rem;
                }

                .summary-card h3 {
                    margin: 0 0 1.5rem;
                    font-size: 1.4rem;
                    color: var(--color-espresso, #2c1a0e);
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--color-canela, #7b4a2d);
                    font-size: 1rem;
                }

                .summary-row.total {
                    border-top: 2px solid rgba(123, 74, 45, 0.1);
                    padding-top: 1rem;
                    margin-top: 0.5rem;
                    font-weight: 800;
                    font-size: 1.2rem;
                    color: var(--color-espresso, #2c1a0e);
                }

                /* Buttons */
                .btn-primary {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 1rem;
                    background-color: #8c5a3b;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    transition: background-color 0.2s;
                    text-decoration: none;
                }

                .btn-primary:hover {
                    background-color: var(--color-canela, #7b4a2d);
                }

                .btn-secondary {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                    padding: 1rem;
                    background-color: transparent;
                    color: var(--color-espresso, #2c1a0e);
                    border: 2px solid rgba(44, 26, 14, 0.1);
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    text-decoration: none;
                }

                .btn-secondary:hover {
                    background-color: rgba(44, 26, 14, 0.05);
                }

                /* Loyalty Card */
                .loyalty-card {
                    margin-top: 1.5rem;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .loyalty-card h3 {
                    margin: 0 0 0.5rem;
                    font-size: 1.3rem;
                }

                .loyalty-card p {
                    margin: 0 0 1.5rem;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.4;
                }

                .stamps {
                    display: flex;
                    gap: 0.6rem;
                }

                .stamp {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background-color: #fcdfc4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-espresso, #2c1a0e);
                }

                .stamp svg {
                    width: 18px;
                    height: 18px;
                }

                .stamp.empty {
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                }
                
                .bg-watermark {
                    position: absolute;
                    right: -20px;
                    bottom: -20px;
                    width: 120px;
                    height: 120px;
                    opacity: 0.05;
                    color: #fff;
                }

                .loading, .error-container {
                    text-align: center;
                    padding: 5rem 2rem;
                    font-size: 1.2rem;
                    color: var(--color-canela, #7b4a2d);
                }
                
                .error-container h2 {
                    color: var(--color-espresso, #2c1a0e);
                    margin-bottom: 1rem;
                }
            </style>

            <div class="checkout-container">
                <div class="header-section">
                    <div class="icon-check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h1 class="title">¡Pedido Confirmado!</h1>
                    <p class="subtitle">
                        Tu café artesanal ya está en camino hacia nuestro barista. Prepárate para
                        disfrutar de un aroma inigualable y una calidez que abraza el alma.
                    </p>
                </div>

                <div class="grid-layout">
                    <div class="col-left">
                        <div class="card">
                            <div class="order-header">
                                <div class="order-number">
                                    <label>Número de pedido</label>
                                    <h2>#MC-${pedidoConfirmado.id}</h2>
                                </div>
                                <div class="order-status">
                                    <label>Estado</label>
                                    <div class="badge">
                                        ${pedidoConfirmado.estado}
                                    </div>
                                </div>
                            </div>

                            <div class="items-list">
                                ${pedidoConfirmado.items.map(item => html`
                                    <div class="item-row">
                                        <img src="${item.imagen_url || 'https://placehold.co/100'}" class="item-image" alt="${item.nombre}" />
                                        <div class="item-info">
                                            <h4 class="item-name">${item.nombre}</h4>
                                            <p class="item-desc">${item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'Recién preparado'}</p>
                                        </div>
                                        <div class="item-price">
                                            ${item.cantidad}× ${(parseFloat(item.precio)).toFixed(2)}€
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div class="card pickup-card">
                            <h3>Detalles de Recogida</h3>
                            <div class="pickup-grid">
                                <div class="pickup-item">
                                    <svg class="pickup-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <div class="pickup-content">
                                        <label>Ubicación</label>
                                        <p>Marta's Coffee - Calle Real 12, Centro</p>
                                    </div>
                                </div>
                                <div class="pickup-item">
                                    <svg class="pickup-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <div class="pickup-content">
                                        <label>Tiempo estimado</label>
                                        <p>10 - 15 minutos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-right">
                        <div class="card summary-card">
                            <h3>Resumen</h3>
                            
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>${pedidoConfirmado.subtotal}€</span>
                            </div>
                            <div class="summary-row">
                                <span>Impuestos (10%)</span>
                                <span>${pedidoConfirmado.impuestos}€</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span>${pedidoConfirmado.total}€</span>
                            </div>

                            <a href="/tracking" class="btn-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Ver Historial
                            </a>
                            
                            <a href="/" class="btn-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Volver al Inicio
                            </a>
                        </div>

                        <div class="card card-dark loyalty-card">
                            <svg class="bg-watermark" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                <line x1="6" y1="1" x2="6" y2="4"></line>
                                <line x1="10" y1="1" x2="10" y2="4"></line>
                                <line x1="14" y1="1" x2="14" y2="4"></line>
                            </svg>

                            <h3>¡Casi ahí!</h3>
                            <p>Te faltan solo 2 sellos para tu próximo café gratis.</p>
                            
                            <div class="stamps">
                                <div class="stamp">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                                </div>
                                <div class="stamp">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                                </div>
                                <div class="stamp">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                                </div>
                                <div class="stamp empty"></div>
                                <div class="stamp empty"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});
