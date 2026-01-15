import "@/index.css";
import { Layout } from "@/widget/Layout";
import { Providers } from "./providers";
import { AppRoutes } from "./routes";

function App() {
  return (
    <Providers>
      <div className="bg-background min-h-screen font-sans antialiased">
        <Layout>
          <AppRoutes />
        </Layout>
      </div>
    </Providers>
  );
}
export default App;
