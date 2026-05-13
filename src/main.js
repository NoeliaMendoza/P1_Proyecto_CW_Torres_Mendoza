// Componentes compartidos
import "./components/shared/navbar.js?v=2";
import "./components/shared/footer.js?v=2";

// Páginas
import "./pages/home.js?v=2";
import "./pages/menu.js?v=2";
import "./pages/sugerencias.js?v=2";
import "./pages/login.js?v=2";
import "./pages/register.js?v=2";
import "./pages/tracking.js?v=2";
import "./pages/admin.js?v=2";
import "./pages/checkout.js?v=2";

// Componentes home
import "./components/home/categoriaCard.js?v=2";

// Componentes catálogo
import "./components/catalog/categoryFilter.js?v=2";
import "./components/catalog/productCard.js?v=2";
import "./components/catalog/cartDrawer.js?v=2";
import "./components/catalog/sugerenciasWeather.js?v=2";

// Router
import { router } from "./router/router.js?v=2";

router.setOutlet(document.getElementById("app"));
