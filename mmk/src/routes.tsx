import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Sobre } from "./pages/sobre/sobre";
import { Carros } from "./pages/carros/carros";
import { Login } from "./pages/Login/Login";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import { AdicionarCarro } from "./pages/AdicionarCarro/AdicionarCarro";
import { Pagamento } from "./pages/pagamento/pagamento";
import { MeusAlugueis } from "./pages/meus-alugueis/meus-alugueis";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "cadastro",
        element: <Cadastro />
    },
    {
        path: "sobre",
        element: <Sobre />
    },
    {
        path: "carros",
        element: <Carros />
    },
    {
        path: "adicionar-carro",
        element: <AdicionarCarro />
    },
    {
        path: "pagamento",
        element: <Pagamento />
    },
    {
        path: "meus-alugueis",
        element: <MeusAlugueis />
    }
]);

export { router };