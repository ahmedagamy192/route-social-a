import { RouterProvider } from "react-router";
import Router from "./routes/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";



const queryClient = new QueryClient();
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={Router} />
      </QueryClientProvider>
    </>
  );
};

export default App;
