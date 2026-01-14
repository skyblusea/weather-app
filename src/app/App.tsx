import { Providers } from "./providers";
import { AppRoutes } from "./routes";
import "@/index.css";

function App() {
  return (
    <Providers>
      <div className="bg-background min-h-screen font-sans antialiased">
        <AppRoutes />
      </div>
    </Providers>
  );
}
export default App;
