// Componentes compartidos
import "./components/shared/navbar.js";
import "./components/shared/footer.js";

// Páginas
import "./pages/home.js";
import "./pages/menu.js";
import "./pages/sugerencias.js";
import "./pages/login.js";
import "./pages/register.js";
import "./pages/tracking.js";
import "./pages/admin.js";
import "./pages/checkout.js";

// Componentes home
import "./components/home/categoriaCard.js";

// Componentes catálogo
import "./components/catalog/categoryFilter.js";
import "./components/catalog/productCard.js";
import "./components/catalog/cartDrawer.js";
import "./components/catalog/sugerenciasWeather.js";

// Router
import { router } from "./router/router.js";

router.setOutlet(document.getElementById("app"));
