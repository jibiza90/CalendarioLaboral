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

export type Offer = {
  id: string;
  date: string;
  description: string;
  amount?: string;
  hideName: boolean;
  departmentId?: string;
  companyId: string;
  status: "Publicado" | "En negociación" | "Aceptado";
  ownerId: string;
  isPremium?: boolean;
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
