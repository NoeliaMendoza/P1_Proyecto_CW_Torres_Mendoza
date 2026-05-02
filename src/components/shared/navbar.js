import { define, html } from 'hybrids';

function updateCount(host) {
    host.count = getCartCount();
}

define({
    tag: 'nav-bar',
    count: 0,
    render: ({ count }) => html`
        <nav>
            <a href="/index.html">Marta's Coffee</a>
            <ul>
                <li><a href="/index.html">Inicio</a></li>
                <li><a href="/menu.html">Menú</a></li>
            </ul>
            <button onclick="${() => window.dispatchEvent(new CustomEvent('open-cart'))}">
                ${count > 0 ? html`<span>(${count})</span>` : ''}
            </button>
        </nav>
    `,
    connect(host) {
        updateCount(host);
        const handler = () => updateCount(host);
        window.addEventListener('cart-updated', handler);
        return () => window.removeEventListener('cart-updated', handler);
    },
});
