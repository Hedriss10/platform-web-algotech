import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import AppRoutes from "./routes/routes";

function App() {
    return (
        <ErrorBoundary>
            <AppRoutes />
            <ToastContainer
                position="top-right"
                theme="dark"
                autoClose={4000}
                hideProgressBar={false}
            />
        </ErrorBoundary>
    );
}

export default App;
