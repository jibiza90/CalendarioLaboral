export type OfferSummary = {
  id: string;
  day: number;
  title: string;
  description: string;
  amount?: string;
  department: string;
  company: string;
  type: "Nueva" | "Alta demanda" | "Aceptación rápida";
};
