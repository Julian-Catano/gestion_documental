import SidebarLayout from "@/layouts/SidebarLayouts";

export default function HomePage() {
  return (
    <SidebarLayout>
      <div className="ml-4 md:ml-10 flex items-center justify-center min-h-[calc(100vh-60px)] px-4">
        <div className="text-center opacity-50">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 mx-auto mb-6 relative">
            <div className="w-full h-full border-4 border-gray-400 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 bg-green-300 rounded-full flex items-center justify-center">
                  <div className="w-6 h-8 sm:w-7 sm:h-10 md:w-8 md:h-12 bg-green-500 rounded-full transform rotate-12"></div>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-500 mb-2">
                  ULA
                </div>
              </div>
            </div>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium">
            Trabajo En Campo
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}
