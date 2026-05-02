import { define, html } from 'hybrids';

function syncCart(host) {
    host.items = getCart();
    host.total = getCartTotal();
}

define({
    tag: 'cart-drawer',
    open: false,
    items: [],
    total: 0,

    render: ({ open, items, total }) => html`
        <div>
            <!-- Overlay -->
            <div
                hidden="${!open}"
                onclick="${(host) => {
                    host.open = false;
                }}"
            >
                [ fondo oscuro ]
            </div>

            <!-- Panel -->
            <div hidden="${!open}">
                <div>
                    <h2>Tu pedido</h2>
                    <button
                        onclick="${(host) => {
                            host.open = false;
                        }}"
                    >
                        ✕ Cerrar
                    </button>
                </div>

                <div>
                    ${items.length === 0
                        ? html`<p>Tu pedido está vacío. Agrega algo del menú.</p>`
                        : items.map(
                              (item) => html`
                                  <div>
                                      <img
                                          src="${item.imagen_url ||
                                          '/assets/images/placeholder.jpg'}"
                                          alt="${item.nombre}"
                                          width="60"
                                      />
                                      <div>
                                          <p><strong>${item.nombre}</strong></p>
                                          ${item.opcion ? html`<small>${item.opcion}</small>` : ''}
                                          <div>
                                              <button
                                                  onclick="${() =>
                                                      updateQuantity(item.key, item.quantity - 1)}"
                                              >
                                                  −
                                              </button>
                                              <span>${item.quantity}</span>
                                              <button
                                                  onclick="${() =>
                                                      updateQuantity(item.key, item.quantity + 1)}"
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>
                                      <span>$${(item.precio * item.quantity).toFixed(2)}</span>
                                      <button onclick="${() => removeFromCart(item.key)}">
                                          Eliminar
                                      </button>
                                  </div>
                              `,
                          )}
                </div>

                ${items.length > 0
                    ? html`
                          <div>
                              <div>
                                  <span>Total:</span>
                                  <strong>$${total.toFixed(2)}</strong>
                              </div>
                              <a href="/checkout.html">Confirmar pedido →</a>
                          </div>
                      `
                    : ''}
            </div>
        </div>
    `,

    connect(host) {
        syncCart(host);
        const onCartUpdate = () => syncCart(host);
        const onOpen = () => {
            host.open = true;
        };
        window.addEventListener('cart-updated', onCartUpdate);
        window.addEventListener('open-cart', onOpen);
        return () => {
            window.removeEventListener('cart-updated', onCartUpdate);
            window.removeEventListener('open-cart', onOpen);
        };
    },
});
