import { useState } from "react";
import { ContactData, ContactCard } from "../../types";
import { useData } from "../../lib/useData";

import { showToast } from "../Toast";
import { Trash } from "lucide-react";

export const ConnectManager = () => {
  const [data, setData] = useData<ContactData>("contactData", {
    contactCards: [],
    escalation: [],
  });

  const save = (newData: ContactData) => {
    setData(newData);
    
  };

  // Contact Cards
  const addContactCard = () => {
    const newCard: ContactCard = {
      id: Date.now(),
      title: "New Department",
      phone: "",
      whatsapp: false,
      email: "",
    };
    save({ ...data, contactCards: [...data.contactCards, newCard] });
    showToast("Card added", "success");
  };

  const updateContactCard = (id: number, field: keyof ContactCard, value: any) => {
    const newCards = data.contactCards.map((c) =>
      c.id === id ? { ...c, [field]: value } : c,
    );
    save({ ...data, contactCards: newCards });
  };

  const deleteContactCard = (id: number) => {
    save({ ...data, contactCards: data.contactCards.filter((c) => c.id !== id) });
    showToast("Card deleted", "success");
  };

  // Escalation
  const addEscalation = () => {
    const newEsc = {
      id: Date.now(),
      name: "New Contact",
      role: "Staff",
      phone: "",
      whatsapp: false,
    };
    save({ ...data, escalation: [...data.escalation, newEsc] });
    showToast("Contact added", "success");
  };

  const updateEsc = (id: number, field: string, value: any) => {
    const newEsc = data.escalation.map((e) =>
      e.id === id ? { ...e, [field]: value } : e,
    );
    save({ ...data, escalation: newEsc });
  };

  const deleteEsc = (id: number) => {
    save({ ...data, escalation: data.escalation.filter((e) => e.id !== id) });
    showToast("Contact deleted", "success");
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6">
        Front Desk & Escalation Manager
      </h3>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">Contact Cards</h4>
          <button
            onClick={addContactCard}
            className="bg-[var(--gr)] text-white px-4 py-2 rounded text-sm font-bold"
          >
            + Add Card
          </button>
        </div>
        
        <div className="space-y-4">
          {data.contactCards.length === 0 && (
            <p className="text-gray-500 italic">No contact cards.</p>
          )}
          {data.contactCards.map((card) => (
            <div
              key={card.id}
              className="border border-gray-200 p-4 rounded bg-gray-50 flex gap-4"
            >
              <div className="flex-grow space-y-3">
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => updateContactCard(card.id, "title", e.target.value)}
                  placeholder="Card Title (e.g., General Inquiries)"
                  className="w-full p-2 border rounded font-bold text-lg"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={card.phone}
                    onChange={(e) => updateContactCard(card.id, "phone", e.target.value)}
                    placeholder="Phone Number"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                  <input
                    type="email"
                    value={card.email}
                    onChange={(e) => updateContactCard(card.id, "email", e.target.value)}
                    placeholder="Email Address"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={card.whatsapp}
                    onChange={(e) =>
                      updateContactCard(card.id, "whatsapp", e.target.checked)
                    }
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Enable WhatsApp for this number
                  </span>
                </label>
              </div>
              <button
                onClick={() => deleteContactCard(card.id)}
                className="text-red-500 p-2 hover:bg-red-50 rounded self-start"
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">Escalation Contacts</h4>
          <button
            onClick={addEscalation}
            className="bg-[var(--gr)] text-white px-4 py-2 rounded text-sm font-bold"
          >
            + Add Contact
          </button>
        </div>

        <div className="space-y-4">
          {data.escalation.length === 0 && (
            <p className="text-gray-500 italic">No escalation contacts.</p>
          )}
          {data.escalation.map((esc) => (
            <div
              key={esc.id}
              className="border border-gray-200 p-4 rounded bg-white flex gap-4"
            >
              <div className="flex-grow space-y-3">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={esc.name}
                    onChange={(e) => updateEsc(esc.id, "name", e.target.value)}
                    placeholder="Name"
                    className="w-1/2 p-2 border rounded font-bold"
                  />
                  <input
                    type="text"
                    value={esc.role}
                    onChange={(e) => updateEsc(esc.id, "role", e.target.value)}
                    placeholder="Role (e.g., Programme Lead)"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={esc.phone}
                    onChange={(e) => updateEsc(esc.id, "phone", e.target.value)}
                    placeholder="Phone Number"
                    className="w-1/2 p-2 border rounded text-sm"
                  />
                  <label className="flex items-center gap-2 cursor-pointer w-1/2">
                    <input
                      type="checkbox"
                      checked={esc.whatsapp}
                      onChange={(e) =>
                        updateEsc(esc.id, "whatsapp", e.target.checked)
                      }
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Enable WhatsApp
                    </span>
                  </label>
                </div>
              </div>
              <button
                onClick={() => deleteEsc(esc.id)}
                className="text-red-500 p-2 hover:bg-red-50 rounded self-start"
              >
                <Trash size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
