import { X, Download } from "lucide-react";
import { FoodItem } from "../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import jsPDF from "jspdf";

interface FoodDetailModalProps {
  item: FoodItem;
  onClose: () => void;
}

function downloadRecipePDF(item: FoodItem & Record<string, any>) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Header band ──────────────────────────────────────────
  doc.setFillColor(170, 82, 137); // #aa5289
  doc.rect(0, 0, pageW, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(item.name, margin, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const typeLabel = item.type === "veg" ? "Vegetarian" : "Non-Vegetarian";
  doc.text(`${item.category}  •  ${typeLabel}  •  ₹${item.price}`, margin, 32);

  y = 50;

  // ── Ingredients ──────────────────────────────────────────
  doc.setTextColor(170, 82, 137);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Ingredients", margin, y);
  y += 7;

  doc.setDrawColor(170, 82, 137);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const ingredients: string[] = item.ingredients || [];
  const colW = contentW / 2;
  const leftCol  = ingredients.filter((_: string, i: number) => i % 2 === 0);
  const rightCol = ingredients.filter((_: string, i: number) => i % 2 === 1);
  const rows = Math.max(leftCol.length, rightCol.length);

  for (let i = 0; i < rows; i++) {
    if (leftCol[i])  doc.text(`• ${leftCol[i]}`,  margin,         y);
    if (rightCol[i]) doc.text(`• ${rightCol[i]}`,  margin + colW, y);
    y += 7;
  }

  y += 4;

  // ── Recipe ───────────────────────────────────────────────
  doc.setTextColor(170, 82, 137);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Recipe & Preparation", margin, y);
  y += 7;

  doc.setDrawColor(170, 82, 137);
  doc.line(margin, y, margin + contentW, y);
  y += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const recipeText: string = item.recipe || "";
  const lines = doc.splitTextToSize(recipeText, contentW);
  const lineH = 6;
  const pageH = doc.internal.pageSize.getHeight();

  for (const line of lines) {
    if (y + lineH > pageH - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += lineH;
  }

  // ── Footer ────────────────────────────────────────────────
  doc.setFillColor(170, 82, 137);
  doc.rect(0, pageH - 12, pageW, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Chicken Chef  •  Crafted with ❤", margin, pageH - 5);
  doc.text(`Downloaded on ${new Date().toLocaleDateString("en-IN")}`, pageW - margin, pageH - 5, { align: "right" });

  doc.save(`${item.name.replace(/\s+/g, "_")}_Recipe.pdf`);
}

export function FoodDetailModal({ item, onClose }: FoodDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl">{item.name}</h2>
          <div className="flex items-center gap-2">
            {/* ── Download PDF button ── */}
            <button
              onClick={() => downloadRecipePDF(item as any)}
              className="flex items-center gap-2 bg-[#aa5289] text-white px-4 py-2 rounded-xl hover:bg-[#923d71] transition-colors text-sm font-medium"
              aria-label="Download recipe as PDF"
            >
              <Download className="w-4 h-4" />
              Download Recipe
            </button>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />

          {/* Price and Category */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl text-[#aa5289] mb-1">₹{item.price}</p>
              <p className="text-gray-600">Category: {item.category}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm ${
                (item as any).type === "veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {(item as any).type === "veg" ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
            </span>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-xl mb-3">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(item as any).ingredients?.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#aa5289] mt-1">•</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recipe */}
          <div className="mb-4">
            <h3 className="text-xl mb-3">Recipe & Preparation</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {(item as any).recipe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
