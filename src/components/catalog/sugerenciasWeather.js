import { define, html } from "hybrids";

const getWeatherDetails = (code, isDay) => {
  let condition = "Despejado";
  let type = "clear";
  let icon = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  if (code >= 1 && code <= 3) {
    condition = code === 3 ? "Nublado" : "Poco nublado";
    type = "clouds";
    icon = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`;
  } else if (code >= 45 && code <= 48) {
    condition = "Niebla";
    type = "clouds";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    condition = "Lluvioso";
    type = "rain";
    icon = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>`;
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    condition = "Nieve";
    type = "cold";
    icon = html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><path d="m8 16 4 4 4-4"></path><path d="M12 12v8"></path></svg>`;
  } else if (code >= 95) {
    condition = "Tormenta";
    type = "rain";
  }

  return { condition, type, icon };
};

const getGreeting = () => {
  const dateOptions = { timeZone: "America/Guayaquil", hour: "numeric", hour12: false };
  const formatter = new Intl.DateTimeFormat("en-US", dateOptions);
  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 5 && hour < 12) return "Buenos días.";
  if (hour >= 12 && hour < 20) return "Buenas tardes.";
  return "Buenas noches.";
};

define({
  tag: "sugerencias-weather",
  productos: { value: [] },
  clima: {
    value: null,
    connect: (host) => {
      fetch("https://api.open-meteo.com/v1/forecast?latitude=-0.2298&longitude=-78.5249&current=temperature_2m,weather_code,is_day&timezone=America%2FGuayaquil")
        .then(res => res.json())
        .then(data => {
          const { temperature_2m, weather_code, is_day } = data.current;
          host.clima = {
            temp: Math.round(temperature_2m),
            ...getWeatherDetails(weather_code, is_day)
          };
        })
        .catch(err => {
          console.error("Error obteniendo el clima", err);
          host.clima = { temp: 20, condition: "Agradable", type: "clear", icon: html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` }; // default fallback
        });
    }
  },

  render: (host) => {
    const { productos, clima } = host;
    const greeting = getGreeting();

    let subtitle = "Nuestro café está listo para darte energía.";
    let badge = "RECOMENDACIONES";

    if (clima) {
      if (clima.type === "rain") {
        subtitle = "Un café caliente es el mejor refugio para un día gris.";
        badge = "IDEAL PARA ENTRAR EN CALOR";
      } else if (clima.temp < 15) {
        subtitle = "El clima está frío, ideal para acompañar con repostería.";
        badge = "IDEAL PARA EL FRÍO";
      } else if (clima.temp > 25) {
        subtitle = "Un día cálido perfecto para algo refrescante.";
        badge = "REFRESCANTE";
      }
    }

    let sugerencias = [];
    if (productos && productos.length > 0) {
      if (clima && (clima.type === "rain" || clima.temp < 15)) {
        sugerencias = productos.filter(p => p.nombre.toLowerCase().includes("cappuccino") || p.nombre.toLowerCase().includes("croissant") || p.nombre.toLowerCase().includes("flat"));
      } else {
        sugerencias = productos.filter(p => p.nombre.toLowerCase().includes("v60") || p.nombre.toLowerCase().includes("aguacate"));
      }

      if (sugerencias.length < 2) {
        sugerencias = productos.slice(0, 2);
      } else {
        sugerencias = sugerencias.slice(0, 2);
      }
    }

    const handleAñadir = (p) => {
      host.dispatchEvent(new CustomEvent('agregar', { detail: p, bubbles: true, composed: true }));
    };

    return html`
      <style>
        :host {
          display: block;
          margin-bottom: 3rem;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-crema, #e8d5b7);
        }

        .greeting-col {
          max-width: 60%;
        }

        .greeting-title {
          font-family: Georgia, serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--color-espresso, #2c1a0e);
          margin: 0 0 0.5rem;
          letter-spacing: -0.5px;
        }

        .greeting-subtitle {
          font-size: 1.05rem;
          color: #5a5a5a;
          margin: 0;
          line-height: 1.4;
        }

        .weather-widget {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #faf3e8;
          border: 1px solid var(--color-crema, #e8d5b7);
          border-radius: 12px;
          padding: 0.8rem 1.25rem;
        }

        .weather-icon {
          color: var(--color-espresso, #2c1a0e);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .weather-info {
          display: flex;
          flex-direction: column;
        }

        .weather-temp {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-espresso, #2c1a0e);
        }

        .weather-cond {
          font-size: 0.85rem;
          color: var(--color-espresso, #2c1a0e);
          font-weight: 600;
        }

        .sugerencias-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .sugerencias-title {
          font-family: Georgia, serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-espresso, #2c1a0e);
          margin: 0;
        }

        .sugerencias-badge {
          background: #f48a42;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .sug-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(44, 26, 14, 0.08);
          display: flex;
          flex-direction: column;
        }

        .sug-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .sug-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .sug-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .sug-name {
          font-family: Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-espresso, #2c1a0e);
          margin: 0;
        }

        .sug-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-canela, #7b4a2d);
        }

        .sug-desc {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.5;
          margin: 0 0 1.5rem;
          flex: 1;
        }

        .sug-add-btn {
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid var(--color-canela, #7b4a2d);
          color: var(--color-canela, #7b4a2d);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sug-add-btn:hover {
          background: var(--color-canela, #7b4a2d);
          color: white;
        }

        @media (max-width: 768px) {
          .header-section {
            flex-direction: column;
            gap: 1.5rem;
          }
          .greeting-col {
            max-width: 100%;
          }
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="header-section">
        <div class="greeting-col">
          <h1 class="greeting-title">${greeting}</h1>
          <p class="greeting-subtitle">${subtitle}</p>
        </div>
        ${clima ? html`
          <div class="weather-widget">
            <div class="weather-icon">
              ${clima.icon}
            </div>
            <div class="weather-info">
              <span class="weather-temp">${clima.temp}°C</span>
              <span class="weather-cond">${clima.condition}</span>
            </div>
          </div>
        ` : ''}
      </div>

      ${sugerencias.length > 0 ? html`
        <div class="sugerencias-header">
          <h2 class="sugerencias-title">Sugerencias del Día</h2>
          <span class="sugerencias-badge">${badge}</span>
        </div>
        <div class="cards-grid">
          ${sugerencias.map(p => html`
            <div class="sug-card">
              <img class="sug-img" src="${p.imagen_url}" alt="${p.nombre}" />
              <div class="sug-content">
                <div class="sug-header-row">
                  <h3 class="sug-name">${p.nombre}</h3>
                  <span class="sug-price">${parseFloat(p.precio).toFixed(2)}€</span>
                </div>
                <p class="sug-desc">${p.descripcion}</p>
                <button class="sug-add-btn" onclick=${() => handleAñadir(p)}>+ Añadir al pedido</button>
              </div>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }
});
