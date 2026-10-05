import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";



const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
     <Navbar/>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Outlet />
        
      </main>
    </div>
  );
};

export default Home;
