import { Tabs } from "@heroui/react";
import Signup from "./Signup";
import Login from "./Login";

const MainAuth = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
              Route Posts
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              Connect with friends and the world around you on Route Posts.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                About Route Academy
              </h3>
              <h4 className="text-xl font-bold text-slate-900">
                Egypt's Leading IT Training Center Since 2012
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Route Academy is the premier IT training center in Egypt,
                established in 2012. We specialize in delivering high-quality
                training courses in programming, web development, and
                application development.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-lg font-bold text-slate-900 block">
                    2012
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    Founded
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-lg font-bold text-slate-900 block">
                    40K+
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    Graduates
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-lg font-bold text-slate-900 block">
                    50+
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    Partner Companies
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-lg font-bold text-slate-900 block">
                    5
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    Branches
                  </span>
                </div>
                <div className="bg-slate-50 col-span-2 p-3 rounded-xl border border-slate-100">
                  <span className="text-lg font-bold text-slate-900 block">
                    20
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">
                    Diplomas Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* auth Tabs */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 w-full max-w-md">
              <Tabs className="w-full max-w-md" defaultSelectedKey="login">
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Authentication">
                    <Tabs.Tab id="login">
                      Login
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="signup">
                      Sign up
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel id="login">
                  <Login />
                </Tabs.Panel>
                <Tabs.Panel id="signup">
                  <Signup />
                </Tabs.Panel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainAuth;
