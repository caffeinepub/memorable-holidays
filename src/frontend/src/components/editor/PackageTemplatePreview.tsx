import { companyStore } from "../../lib/companyStore";
import { masterDataStore } from "../../lib/masterDataStore";
import type { PackageEditorState } from "../../lib/packageStore";

interface Props {
  state: PackageEditorState;
  scale?: number;
}

const TEMPLATE_THEMES: Record<
  string,
  { bg: string; header: string; accent: string; text: string; subtext: string }
> = {
  "gold-teal": {
    bg: "#f8f4ec",
    header: "#1a3a3a",
    accent: "#c9a227",
    text: "#1a3a3a",
    subtext: "#5a6a6a",
  },
  "teal-white": {
    bg: "#ffffff",
    header: "#008080",
    accent: "#008080",
    text: "#1a3a3a",
    subtext: "#5a6a6a",
  },
  "dark-gold": {
    bg: "#1a1a2e",
    header: "#1a1a2e",
    accent: "#d4af37",
    text: "#f5f0e8",
    subtext: "#b0a090",
  },
  "white-teal": {
    bg: "#ffffff",
    header: "#20b2aa",
    accent: "#20b2aa",
    text: "#2d3748",
    subtext: "#718096",
  },
  "coral-teal": {
    bg: "#fff5f0",
    header: "#008080",
    accent: "#e07060",
    text: "#2d3748",
    subtext: "#718096",
  },
  "navy-gold": {
    bg: "#f0f4ff",
    header: "#1a2744",
    accent: "#d4af37",
    text: "#1a2744",
    subtext: "#4a5568",
  },
  "forest-gold": {
    bg: "#f0f4f0",
    header: "#1a2e1a",
    accent: "#c9a227",
    text: "#1a2e1a",
    subtext: "#4a6a4a",
  },
  "ocean-sand": {
    bg: "#f0f8ff",
    header: "#0077b6",
    accent: "#0077b6",
    text: "#2d3748",
    subtext: "#718096",
  },
  "terracotta-gold": {
    bg: "#fdf5f0",
    header: "#3d1c02",
    accent: "#d4af37",
    text: "#3d1c02",
    subtext: "#7a4a2a",
  },
  "black-gold": {
    bg: "#f8f8f8",
    header: "#0a0a0a",
    accent: "#d4af37",
    text: "#0a0a0a",
    subtext: "#4a4a4a",
  },
};

export default function PackageTemplatePreview({ state, scale = 1 }: Props) {
  const company = companyStore.get();
  const theme =
    TEMPLATE_THEMES[state.templateColorScheme] || TEMPLATE_THEMES["gold-teal"];

  // Resolve food menu items for display
  const allFoodItems = masterDataStore.get().foodMenuItems;
  const selectedFoodItems = (state.selectedFoodItems ?? [])
    .map((id) => allFoodItems.find((f) => f.id === id))
    .filter(Boolean) as typeof allFoodItems;

  // Resolve selected destination specialty notes
  const allDestinations = masterDataStore.get().destinations;
  // Use the first destination that matches any part of notes or travelDates
  const destWithNotes = allDestinations.find(
    (d) =>
      d.specialtyNotes &&
      (state.notes?.toLowerCase().includes(d.name.toLowerCase()) ||
        state.travelDates?.toLowerCase().includes(d.name.toLowerCase())),
  );

  // Guest breakdown
  const maleAdults = state.maleAdults ?? 0;
  const femaleAdults = state.femaleAdults ?? 0;
  const tgOthers = state.tgOthers ?? 0;
  const kids = state.kids ?? 0;
  const hasDetailedGuests =
    maleAdults > 0 || femaleAdults > 0 || tgOthers > 0 || kids > 0;

  const photos = state.photos ?? [];

  return (
    <div
      id="package-preview-content"
      style={{
        backgroundColor: theme.bg,
        fontFamily: "Inter, sans-serif",
        minWidth: "600px",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: scale !== 1 ? "top left" : undefined,
        width: scale !== 1 ? `${100 / scale}%` : "100%",
      }}
    >
      {/* Photo Grid — displayed above header if photos exist */}
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              photos.length === 1
                ? "1fr"
                : photos.length === 2
                  ? "1fr 1fr"
                  : "1fr 1fr 1fr",
            gap: "3px",
            maxHeight: "200px",
            overflow: "hidden",
          }}
        >
          {photos.slice(0, Math.min(6, photos.length)).map((photo, idx) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: photos are positional, no stable ID
              key={`preview-photo-${idx}`}
              style={{
                overflow: "hidden",
                height: "200px",
              }}
            >
              <img
                src={photo}
                alt={`Destination view ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div style={{ backgroundColor: theme.header, padding: "24px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {company.logoUrl && (
              <img
                src={company.logoUrl}
                alt="logo"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${theme.accent}`,
                }}
              />
            )}
            <div>
              <h1
                style={{
                  color: theme.accent,
                  fontSize: "22px",
                  fontWeight: "700",
                  fontFamily: "Playfair Display, serif",
                  margin: 0,
                }}
              >
                Memorable Holidays
              </h1>
              {company.name && company.name !== "Memorable Holidays" && (
                <p
                  style={{
                    color: "#ffffff99",
                    fontSize: "11px",
                    margin: "2px 0 0",
                  }}
                >
                  {company.name}
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: theme.accent,
                fontSize: "18px",
                fontWeight: "700",
                fontFamily: "Playfair Display, serif",
                margin: 0,
              }}
            >
              {state.category || "Tour"} Package
            </p>
            <p
              style={{
                color: "#ffffff80",
                fontSize: "11px",
                margin: "2px 0 0",
              }}
            >
              Template: {state.templateDesign}
            </p>
          </div>
        </div>
      </div>

      {/* Guest Info Banner */}
      <div
        style={{
          backgroundColor: `${theme.accent}22`,
          borderBottom: `3px solid ${theme.accent}`,
          padding: "16px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <p
              style={{
                color: theme.subtext,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              Guest Name
            </p>
            <p
              style={{
                color: theme.text,
                fontSize: "18px",
                fontWeight: "700",
                fontFamily: "Playfair Display, serif",
                margin: "2px 0 0",
              }}
            >
              {state.guestName || "Guest Name"}
            </p>
          </div>
          <div>
            <p
              style={{
                color: theme.subtext,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              Travel Dates
            </p>
            <p
              style={{
                color: theme.text,
                fontSize: "14px",
                fontWeight: "600",
                margin: "2px 0 0",
              }}
            >
              {state.travelDates || "TBD"}
            </p>
          </div>
          <div>
            <p
              style={{
                color: theme.subtext,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              Guests
            </p>
            {hasDetailedGuests ? (
              <div style={{ margin: "2px 0 0" }}>
                {maleAdults > 0 && (
                  <p
                    style={{
                      color: theme.text,
                      fontSize: "12px",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    {maleAdults} Male · {femaleAdults} Female
                    {tgOthers > 0 ? ` · ${tgOthers} TG/Other` : ""}
                    {kids > 0 ? ` · ${kids} Kids` : ""}
                  </p>
                )}
              </div>
            ) : (
              <p
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "2px 0 0",
                }}
              >
                {state.adults} Adults · {state.children} Children
              </p>
            )}
          </div>
          <div>
            <p
              style={{
                color: theme.subtext,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: 0,
              }}
            >
              Total Cost
            </p>
            <p
              style={{
                color: theme.accent,
                fontSize: "20px",
                fontWeight: "800",
                margin: "2px 0 0",
              }}
            >
              ₹{state.totalCost.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div style={{ padding: "24px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {state.hotel && (
            <div
              style={{
                border: `1px solid ${theme.accent}33`,
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: theme.accent,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 6px",
                  fontWeight: "600",
                }}
              >
                🏨 Hotel
              </p>
              <p
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {state.hotel}
              </p>
              {state.roomType && (
                <p
                  style={{
                    color: theme.subtext,
                    fontSize: "12px",
                    margin: "2px 0 0",
                  }}
                >
                  {state.roomType}
                </p>
              )}
            </div>
          )}

          {state.travelOption && (
            <div
              style={{
                border: `1px solid ${theme.accent}33`,
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: theme.accent,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 6px",
                  fontWeight: "600",
                }}
              >
                🚌 Travel
              </p>
              <p
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {state.travelOption}
              </p>
            </div>
          )}

          {state.foodPackage && (
            <div
              style={{
                border: `1px solid ${theme.accent}33`,
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: theme.accent,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 6px",
                  fontWeight: "600",
                }}
              >
                🍽️ Food
              </p>
              <p
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {state.foodPackage}
              </p>
            </div>
          )}

          {state.boating && state.boating !== "none" && (
            <div
              style={{
                border: `1px solid ${theme.accent}33`,
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: theme.accent,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 6px",
                  fontWeight: "600",
                }}
              >
                ⛵ Boating
              </p>
              <p
                style={{
                  color: theme.text,
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                {state.boating}
              </p>
            </div>
          )}
        </div>

        {/* Activities */}
        {state.activities.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                color: theme.accent,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                margin: "0 0 8px",
              }}
            >
              ✨ Activities Included
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {state.activities.map((act) => (
                <span
                  key={act}
                  style={{
                    backgroundColor: `${theme.accent}22`,
                    color: theme.text,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    border: `1px solid ${theme.accent}44`,
                  }}
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {state.addOns.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                color: theme.accent,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                margin: "0 0 8px",
              }}
            >
              🎁 Add-ons
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {state.addOns.map((addon) => (
                <span
                  key={addon}
                  style={{
                    backgroundColor: `${theme.accent}22`,
                    color: theme.text,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    border: `1px solid ${theme.accent}44`,
                  }}
                >
                  {addon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Food Menu Items */}
        {selectedFoodItems.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                color: theme.accent,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                margin: "0 0 8px",
              }}
            >
              🍽️ Meals Included
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {selectedFoodItems.map((item) => (
                <span
                  key={item.id}
                  style={{
                    backgroundColor: item.isComplimentary
                      ? "rgba(34,197,94,0.12)"
                      : `${theme.accent}22`,
                    color: item.isComplimentary ? "#16a34a" : theme.text,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    border: `1px solid ${item.isComplimentary ? "rgba(34,197,94,0.3)" : `${theme.accent}44`}`,
                  }}
                >
                  {item.name}
                  {item.isComplimentary && " ✓"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specialty Notes from Destination */}
        {destWithNotes?.specialtyNotes && (
          <div
            style={{
              marginBottom: "16px",
              border: `1px solid ${theme.accent}33`,
              borderRadius: "8px",
              padding: "14px",
              backgroundColor: `${theme.accent}08`,
            }}
          >
            <p
              style={{
                color: theme.accent,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0 0 6px",
                fontWeight: "600",
              }}
            >
              📍 Special Notes — {destWithNotes.name}
            </p>
            <p
              style={{
                color: theme.text,
                fontSize: "12px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              {destWithNotes.specialtyNotes}
            </p>
          </div>
        )}

        {/* Content Blocks */}
        {state.contentBlocks.map((block) => (
          <div
            key={block.id}
            style={{
              marginBottom: "16px",
              border: `1px solid ${theme.accent}22`,
              borderRadius: "8px",
              padding: "14px",
            }}
          >
            <p
              style={{
                color: theme.accent,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                margin: "0 0 6px",
              }}
            >
              {block.title}
            </p>
            {block.type === "image" && block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.title}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
            ) : (
              <p
                style={{
                  color: theme.text,
                  fontSize: "13px",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {block.content}
              </p>
            )}
          </div>
        ))}

        {/* Cost Summary */}
        {state.totalCost > 0 && (
          <div
            style={{
              backgroundColor: `${theme.accent}11`,
              border: `2px solid ${theme.accent}`,
              borderRadius: "10px",
              padding: "16px",
              marginTop: "20px",
            }}
          >
            <p
              style={{
                color: theme.accent,
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "700",
                margin: "0 0 10px",
              }}
            >
              💰 Package Cost Summary
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: theme.subtext, fontSize: "13px" }}>
                {state.adults} Adults
              </span>
              <span
                style={{
                  color: theme.text,
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Included
              </span>
            </div>
            {state.children > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span style={{ color: theme.subtext, fontSize: "13px" }}>
                  {state.children} Children (50% off)
                </span>
                <span
                  style={{
                    color: theme.text,
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Included
                </span>
              </div>
            )}
            <div
              style={{
                borderTop: `1px solid ${theme.accent}44`,
                marginTop: "8px",
                paddingTop: "8px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: theme.text,
                  fontSize: "16px",
                  fontWeight: "700",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Grand Total
              </span>
              <span
                style={{
                  color: theme.accent,
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                ₹{state.totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        {state.notes && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: `${theme.accent}11`,
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                color: theme.accent,
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "600",
                margin: "0 0 4px",
              }}
            >
              📝 Special Notes
            </p>
            <p
              style={{
                color: theme.subtext,
                fontSize: "12px",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              {state.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: theme.header,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <p
            style={{
              color: theme.accent,
              fontSize: "14px",
              fontWeight: "700",
              fontFamily: "Playfair Display, serif",
              margin: 0,
            }}
          >
            Memorable Holidays
          </p>
          {company.phone && (
            <p
              style={{
                color: "#ffffff80",
                fontSize: "11px",
                margin: "2px 0 0",
              }}
            >
              📞 {company.phone}
            </p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {company.email && (
            <p style={{ color: "#ffffff80", fontSize: "11px", margin: 0 }}>
              ✉️ {company.email}
            </p>
          )}
          {company.whatsapp && (
            <p
              style={{
                color: "#ffffff80",
                fontSize: "11px",
                margin: "2px 0 0",
              }}
            >
              💬 {company.whatsapp}
            </p>
          )}
          {company.website && (
            <p
              style={{
                color: theme.accent,
                fontSize: "11px",
                margin: "2px 0 0",
              }}
            >
              🌐 {company.website}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
