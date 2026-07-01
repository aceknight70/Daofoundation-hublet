import { RoomDef } from "../types";

interface NavigationProps {
  rooms: RoomDef[];
  activeSlug: string;
}

export const Navigation = ({ rooms, activeSlug }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto">
        <ul className="flex items-center gap-6 whitespace-nowrap py-4">
          <li>
            <a
              href="#cover"
              className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                activeSlug === "#cover" || activeSlug === ""
                  ? "text-[var(--gr)]"
                  : "text-gray-500 hover:text-[var(--gr)]"
              }`}
            >
              <span>🏠</span> Home
            </a>
          </li>
          {rooms.map((room) => (
            <li key={room.id}>
              <a
                href={room.slug}
                className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                  activeSlug === room.slug
                    ? "text-[var(--gr)]"
                    : "text-gray-500 hover:text-[var(--gr)]"
                }`}
              >
                <span>{room.icon}</span> {room.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
