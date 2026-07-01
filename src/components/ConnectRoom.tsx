import { useEffect, useState } from "react";
import { ContactData } from "../types";
import { getStorage } from "../lib/storage";
import { ChevronDown, ChevronUp } from "lucide-react";

export const ConnectRoom = () => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);

  useEffect(() => {
    setContact(
      getStorage("contactData", {
        contactCards: [
          { id: 1, title: "General Inquiries", phone: "", whatsapp: false, email: "" },
          { id: 2, title: "Programme Inquiries", phone: "", whatsapp: false, email: "" },
          { id: 3, title: "Escalation / Emergency", phone: "", whatsapp: false, email: "" },
        ],
        escalation: [],
      }),
    );
  }, []);

  if (!contact) return null;

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif text-[var(--gr)] font-bold mb-2">
          📞 CONNECT
        </h2>
        <p className="text-gray-600">Get in touch</p>
      </div>

      <div className="space-y-6 mb-8">
        {contact.contactCards && contact.contactCards.map((card) => (
          <div key={card.id} className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-8 border border-gray-100">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span>📋</span> {card.title}
            </h3>

            <div className="space-y-4 text-gray-700">
              {card.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <a
                    href={`tel:${card.phone}`}
                    className="text-lg hover:text-[var(--gr)]"
                  >
                    {card.phone}
                  </a>
                </div>
              )}

              {card.whatsapp && card.phone && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <a
                    href={`https://wa.me/${card.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-green-600 hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              )}

              {card.email && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <a
                    href={`mailto:${card.email}`}
                    className="text-lg hover:text-[var(--gr)]"
                  >
                    {card.email}
                  </a>
                </div>
              )}

              {(card.phone || card.email || card.whatsapp) && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={card.whatsapp && card.phone ? `https://wa.me/${card.phone.replace(/[^0-9]/g, "")}` : (card.phone ? `tel:${card.phone}` : `mailto:${card.email}`)}
                    className="inline-block bg-[var(--gr)] text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all text-sm"
                  >
                    Contact Now &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {contact.escalation && contact.escalation.length > 0 && (
        <div>
          <button
            onClick={() => setShowEscalation(!showEscalation)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors font-bold text-gray-600"
          >
            <span>Need more help?</span>
            {showEscalation ? (
               <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {showEscalation && (
            <div className="mt-4 bg-white rounded-xl shadow-inner border border-gray-200 p-6 space-y-6 animate-fade-in">
              <h4 className="font-bold text-gray-500 uppercase tracking-wider text-sm flex items-center gap-2 border-b border-gray-100 pb-2">
                <span>📋</span> Escalation Contacts
              </h4>

              {contact.escalation.map((esc) => (
                <div key={esc.id} className="pt-2">
                  <p className="font-bold text-lg">👤 {esc.name}</p>
                  <p className="text-sm text-gray-500 mb-2 ml-7">
                    — {esc.role}
                  </p>

                  <div className="ml-7 space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <a
                        href={`tel:${esc.phone}`}
                        className="hover:text-[var(--gr)]"
                      >
                        {esc.phone}
                      </a>
                    </div>
                    {esc.whatsapp && (
                      <div className="flex items-center gap-2">
                        <span>💬</span>
                        <a
                          href={`https://wa.me/${esc.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}

                    <div className="mt-4">
                      <a
                        href={esc.whatsapp && esc.phone ? `https://wa.me/${esc.phone.replace(/[^0-9]/g, "")}` : `tel:${esc.phone}`}
                        className="inline-block bg-[var(--gr)] text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all text-xs"
                      >
                        Contact Now &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
