import ListFiles from "../components/FileList";
import SidebarLayout from "../layouts/SidebarLayouts";

export default function PageListFile() {
  return (
    <SidebarLayout>
      <div className="px-6 pt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Lista de Archivos
        </h1>
        <ListFiles />
      </div>
    </SidebarLayout>
  );
}
