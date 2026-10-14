
import { Users, Search } from "lucide-react";

const LeftSidebar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-600" />
          Suggested Friends
        </h3>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
          0
        </span>
      </div>

      {/* البحث عن أصدقاء */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search friends..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      {/* رسالة عدم وجود اقتراحات */}
      <div className="text-center py-6 text-gray-400 text-xs">
        No friend suggestions right now.
      </div>

      <button className="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer">
        View more
      </button>
    </div>
  );
};

export default LeftSidebar;
