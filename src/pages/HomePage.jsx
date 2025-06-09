import SidebarLayout from "@/layouts/SidebarLayouts";

export default function HomePage() {
  return (
    <SidebarLayout>
      
          {/* Content area */}
          <div className="ml-10 flex items-center justify-center min-h-[calc(100vh-60px)]">
            <div className="text-center opacity-20">
              {/* ULA Logo placeholder - you can replace this with actual logo */}
              <div className="w-64 h-64 mx-auto mb-8 relative">
                <div className="w-full h-full border-4 border-gray-400 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    {/* Leaf/plant icon placeholder */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-300 rounded-full flex items-center justify-center">
                      <div className="w-8 h-12 bg-green-500 rounded-full transform rotate-12"></div>
                    </div>
                    <div className="text-6xl font-bold text-gray-500 mb-2">ULA</div>
                  </div>
                </div>
              </div>
              <p className="text-2xl text-gray-500 font-medium">Trabajo En Campo</p>
            </div>
          </div>
    </SidebarLayout>
  );
}
