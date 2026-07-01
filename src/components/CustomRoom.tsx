import { RoomDef } from "../types";

interface CustomRoomProps {
  room: RoomDef;
}

export const CustomRoom = ({ room }: CustomRoomProps) => {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2 flex items-center gap-3">
          <span>{room.icon}</span> {room.name}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-8 prose prose-slate max-w-none">
        {room.content ? (
          <div dangerouslySetInnerHTML={{ __html: room.content }} />
        ) : (
          <p className="text-gray-500 italic">
            This room is empty. Content can be added in the Staff Room.
          </p>
        )}
      </div>
    </div>
  );
};
