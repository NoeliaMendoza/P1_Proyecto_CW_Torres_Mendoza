import { define, html } from 'hybrids';

define({
    tag: 'product-card',
    productId: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
    disponible: true,
    destacado: false,

    render: ({ productId, nombre, descripcion, precio, imagenUrl, disponible }) => html`
        <div>
            <img src="${imagenUrl || '/assets/images/placeholder.jpg'}" alt="${nombre}" />
            <div>
                <h3>${nombre}</h3>
                <p>${descripcion}</p>
                <strong>$${Number(precio).toFixed(2)}</strong>
            </div>
            <div>
                <a href="/detalle.html?id=${productId}">Ver detalle</a>
                <button
                    disabled="${!disponible}"
                    onclick="${(host) => {
                        addToCart({
                            id: host.productId,
                            nombre: host.nombre,
                            precio: host.precio,
                            imagen_url: host.imagenUrl,
                        });
                        showToast(`${host.nombre} agregado al carrito`);
                    }}"
                >
                    ${disponible ? 'Agregar' : 'Agotado'}
                </button>
            </div>
        </div>
    `,
});
