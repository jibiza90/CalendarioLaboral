export type OfferType = "Nueva" | "Alta demanda" | "Aceptación rápida";

export type Company = {
  id: string;
  name: string;
  location: string; // "Madrid, España"
  category: string; // "Restauración", "Retail", "Salud", etc.
  inviteCode: string; // "RES123456" - único código para unirse
  inviteLink: string; // "turnswap.com/join/RES123456"
  isPrivate: boolean; // Si es true, NO aparece en ninguna búsqueda
  createdBy: string; // userId del creador
  createdAt: string;
  memberCount: number;
};

export type Department = {
  id: string;
  name: string;
  companyId: string;
};

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  inApp: boolean;
};

export type SubscriptionTier = "free" | "pro" | "business";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  companies: Company[];
  departments: Department[];
  notifications: NotificationPreferences;
  subscription: SubscriptionTier;
  subscriptionExpires?: string;
  // Available days for exchange
  availableDays?: string[]; // ISO strings de días libres disponibles para intercambio
};

export type OfferSummary = {
  id: string;
  day: number;
  title: string;
  description: string;
  amount?: string;
  department: string;
  company: string;
  type: OfferType;
  isPremium?: boolean;
};

export type OfferExchangeType = "simple" | "exchange" | "hybrid";

export type Offer = {
  id: string;
  date: string;
  description: string;
  amount?: string; // Dinero ofrecido (ej: "20€")
  hideName: boolean;
  departmentId?: string;
  companyId: string;
  status: "Publicado" | "En negociación" | "Aceptado" | "Rechazado";
  ownerId: string;
  isPremium?: boolean;
  // Exchange fields
  exchangeType: OfferExchangeType; // "simple" (solo dinero/favor), "exchange" (intercambio días), "hybrid" (ambos)
  offeredDates?: string[]; // Días libres que ofreces a cambio (ISO strings)
  acceptedByUserId?: string; // Usuario que aceptó la oferta
  acceptedAt?: string; // Fecha de aceptación
};

export type NegotiationMessage = {
  id: string;
  offerId: string;
  author: string;
  authorId: string;
  role: "owner" | "taker";
  text: string;
  createdAt: string;
};

// Private Message System
export type PrivateMessage = {
  id: string;
  offerId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  read: boolean;
  createdAt: string;
  // Edit functionality
  edited?: boolean;
  editedAt?: string;
  // Soft delete - per user deletion
  deletedBySender?: boolean;
  deletedByReceiver?: boolean;
};

export type Conversation = {
  offerId: string;
  offerTitle: string;
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: PrivateMessage;
  unreadCount: number;
};

// Counter offer (contraoferta)
export type CounterOffer = {
  id: string;
  originalOfferId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string; // Owner de la oferta original
  amount?: string; // Nueva cantidad propuesta
  offeredDates?: string[]; // Nuevos días ofrecidos
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};
