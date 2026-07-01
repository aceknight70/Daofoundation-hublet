import { useState } from "react";
import { RoomDef } from "../../types";
import { useData } from "../../lib/useData";

import { showToast } from "../Toast";
import { Trash, ArrowUp, ArrowDown } from "lucide-react";

interface RoomManagerProps {
  rooms: RoomDef[];
  setRooms: (rooms: RoomDef[]) => void;
  roomOrder: string[];
  setRoomOrder: (order: string[]) => void;
}

export const RoomManager = ({
  rooms,
  setRooms,
  roomOrder,
  setRoomOrder,
}: RoomManagerProps) => {
  const [editingRoom, setEditingRoom] = useState<RoomDef | null>(null);

  const saveRooms = (newRooms: RoomDef[], newOrder: string[]) => {
    setRooms(newRooms);
    setRoomOrder(newOrder);
    
    
  };

  const addRoom = () => {
    const newRoom: RoomDef = {
      id: `custom-${Date.now()}`,
      name: "New Room",
      icon: "📄",
      slug: `#room-${Date.now()}`,
      type: "custom",
      content: "<h2>New Room Content</h2><p>Edit this in the Staff Room.</p>",
    };
    const newRooms = [...rooms, newRoom];
    const newOrder = [...roomOrder, newRoom.slug];
    saveRooms(newRooms, newOrder);
    showToast("Room added", "success");
    setEditingRoom(newRoom);
  };

  const updateRoom = (id: string, field: keyof RoomDef, value: string) => {
    const newRooms = rooms.map((r) =>
      r.id === id ? { ...r, [field]: value } : r,
    );
    setRooms(newRooms);
    
    if (editingRoom && editingRoom.id === id) {
      setEditingRoom({ ...editingRoom, [field]: value } as RoomDef);
    }
  };

  const deleteRoom = (room: RoomDef) => {
    if (room.type === "system") {
      showToast("Cannot delete system rooms", "error");
      return;
    }
    if (confirm(`Delete room "${room.name}"?`)) {
      const newRooms = rooms.filter((r) => r.id !== room.id);
      const newOrder = roomOrder.filter((slug) => slug !== room.slug);
      saveRooms(newRooms, newOrder);
      if (editingRoom?.id === room.id) setEditingRoom(null);
      showToast("Room deleted", "success");
    }
  };

  const moveRoom = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= roomOrder.length) return;
    const newOrder = [...roomOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + direction];
    newOrder[index + direction] = temp;

    setRoomOrder(newOrder);
    
  };

  // Get rooms sorted by order
  const sortedRooms = roomOrder
    .map((slug) => rooms.find((r) => r.slug === slug))
    .filter((r): r is RoomDef => Boolean(r));

  // Add any rooms that somehow lost their order
  rooms.forEach((r) => {
    if (!sortedRooms.find((sr) => sr.id === r.id)) {
      sortedRooms.push(r);
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Room Manager</h3>
        <button
          onClick={addRoom}
          className="bg-[var(--gr)] text-white px-4 py-2 rounded font-bold text-sm"
        >
          + Create New Room
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2 space-y-2">
          {sortedRooms.map((room, index) => (
            <div
              key={room.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                editingRoom?.id === room.id
                  ? "border-[var(--gr)] bg-[var(--gr)]/5"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              onClick={() => setEditingRoom(room)}
            >
              <div className="flex flex-col gap-1 mr-2 text-gray-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveRoom(index, -1);
                  }}
                  disabled={index === 0}
                  className="hover:text-gray-800 disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveRoom(index, 1);
                  }}
                  disabled={index === sortedRooms.length - 1}
                  className="hover:text-gray-800 disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              <span className="text-2xl">{room.icon}</span>
              <div className="flex-grow">
                <p className="font-bold">{room.name}</p>
                <p className="text-xs text-gray-500">
                  {room.slug} {room.type === "system" && "(System)"}
                </p>
              </div>
              {room.type === "custom" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoom(room);
                  }}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="w-1/2">
          {editingRoom ? (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
              <h4 className="font-bold text-lg mb-4">
                Edit Room: {editingRoom.name}
              </h4>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={editingRoom.icon}
                      onChange={(e) =>
                        updateRoom(editingRoom.id, "icon", e.target.value)
                      }
                      className="w-full p-2 border rounded text-xl text-center"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingRoom.name}
                      onChange={(e) =>
                        updateRoom(editingRoom.id, "name", e.target.value)
                      }
                      className="w-full p-2 border rounded font-bold"
                    />
                  </div>
                </div>

                {editingRoom.type === "custom" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      HTML Content
                    </label>
                    <textarea
                      value={editingRoom.content || ""}
                      onChange={(e) =>
                        updateRoom(editingRoom.id, "content", e.target.value)
                      }
                      className="w-full p-3 border rounded h-64 font-mono text-sm"
                      placeholder="<h2>Heading</h2><p>Content...</p>"
                    />
                  </div>
                )}

                {editingRoom.type === "system" && (
                  <p className="text-sm text-gray-500 italic mt-4">
                    This is a system room. Its internal content is managed in
                    its specific manager tab. You can only change its name and
                    icon here.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Select a room to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
