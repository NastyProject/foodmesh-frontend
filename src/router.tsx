import { createBrowserRouter } from "react-router";
import { AuthGate } from "./auth/AuthGate";
import { AppLayout } from "./components/AppLayout";
import { WelcomePage } from "./features/bienvenida/WelcomePage";
import { DespensaPage } from "./features/despensa/DespensaPage";
import { FacturasPage } from "./features/facturas/FacturasPage";
import { RevisarFacturaPage } from "./features/facturas/RevisarFacturaPage";
import { HogarPage } from "./features/hogar/HogarPage";
import { NotFoundPage } from "./features/NotFoundPage";
import { RecetasPage } from "./features/recetas/RecetasPage";

export const router = createBrowserRouter([
  { path: "/", element: <WelcomePage /> },
  {
    element: <AuthGate />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "despensa", element: <DespensaPage /> },
          { path: "facturas", element: <FacturasPage /> },
          { path: "facturas/:id", element: <RevisarFacturaPage /> },
          { path: "recetas", element: <RecetasPage /> },
          { path: "hogar", element: <HogarPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
