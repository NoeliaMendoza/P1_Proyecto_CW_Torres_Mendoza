import { define, html } from "hybrids";

define({
  tag: "category-filter",

  categorias: () => [],
  selected: "todos",
  onchange: () => () => {},

  render: ({ categorias, selected, onchange }) => html`
    <style>
      :host {
        display: block;
        font-family:
          "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans",
          Arial, sans-serif;
      }

      .filter-wrapper {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
      }

      .filter-btn {
        padding: 0.45rem 1.2rem;
        border-radius: 999px;
        border: none;
        font-family: inherit;
        font-size: 0.88rem;
        font-weight: 500;
        cursor: pointer;
        transition:
          background 0.2s,
          color 0.2s,
          transform 0.15s;
        background: var(--color-crema, #e8d5b7);
        color: var(--color-canela, #7b4a2d);
      }

      .filter-btn:hover {
        background: #d9c4a0;
        transform: translateY(-1px);
      }

      .filter-btn.active {
        background: var(--color-caramelo, #c4956a);
        color: #fff;
        box-shadow: 0 2px 8px rgba(196, 149, 106, 0.35);
      }
    </style>

    <div class="filter-wrapper">
      <button
        class="${selected === "todos" ? "filter-btn active" : "filter-btn"}"
        onclick="${(host) => {
          host.selected = "todos";
          host.onchange(host, "todos");
        }}"
      >
        Todos
      </button>
      ${categorias.map(
        (cat) => html`
          <button
            class="${selected === cat.slug
              ? "filter-btn active"
              : "filter-btn"}"
            onclick="${(host) => {
              host.selected = cat.slug;
              host.onchange(host, cat.slug);
            }}"
          >
            ${cat.nombre}
          </button>
        `,
      )}
    </div>
  `,
});
