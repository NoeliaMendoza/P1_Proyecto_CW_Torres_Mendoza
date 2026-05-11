// Componentes compartidos
import './components/shared/navbar.js';
import './components/shared/footer.js';

// Páginas
import './pages/home.js';
import './pages/menu.js';
import './pages/login.js';
import './pages/register.js';
import './pages/tracking.js';
import './pages/admin.js';
import './components/home/categoriaCard.js';

//  Componentes catálogo

// Componentes carrito

// Componentes admin

// Router
import { router } from './router/router.js';

router.setOutlet(document.getElementById('app'));
