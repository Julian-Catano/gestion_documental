import MineFiles from "../components/MineFiles";
import SidebarLayout from "../layouts/SidebarLayouts";

export default function PageListFile() {
  return (
    <SidebarLayout>
      <div className="flex flex-col">
        <div className="flex-1">
          <MineFiles />
        </div>
      </div>
    </SidebarLayout>
  );
}
