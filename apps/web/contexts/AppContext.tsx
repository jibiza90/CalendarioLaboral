"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type {
  Company,
  Department,
  Offer,
  OfferSummary,
  UserProfile,
  NotificationPreferences,
  NegotiationMessage,
  PrivateMessage,
  Conversation,
} from "../types";

// Extended types for the app
export interface AppOffer extends Offer {
  day: number;
  title: string;
  department: string;
  departmentName: string;
  companyName: string;
  type: "Nueva" | "Alta demanda" | "Aceptación rápida";
  createdAt: string;
}

export interface AppNegotiationMessage extends NegotiationMessage {
  offerTitle?: string;
}

// Conversation deletion tracking per user
interface DeletedConversation {
  offerId: string;
  otherUserId: string;
  deletedAt: string;
}

interface AppState {
  // User
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // Companies
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company | null) => void;
  addCompany: (name: string, province: string) => Company;
  joinCompanyByCode: (code: string) => boolean;
  searchCompanies: (query: string) => Company[];
  
  // Departments
  departments: Department[];
  addDepartment: (department: Department) => void;
  
  // Offers
  offers: AppOffer[];
  addOffer: (offer: Omit<AppOffer, "id" | "createdAt"> & { day: number }) => void;
  updateOffer: (id: string, updates: Partial<AppOffer>) => void;
  deleteOffer: (id: string) => void;
  getOfferById: (id: string) => AppOffer | undefined;
  getOffersByDay: (day: number, month: number, year: number) => AppOffer[];
  
  // Private Messages
  privateMessages: PrivateMessage[];
  sendPrivateMessage: (offerId: string, receiverId: string, receiverName: string, text: string) => void;
  editPrivateMessage: (messageId: string, newText: string) => boolean;
  canEditMessage: (messageId: string) => boolean;
  getPrivateConversation: (offerId: string, otherUserId: string) => PrivateMessage[];
  getUserConversations: () => Conversation[];
  markMessagesAsRead: (offerId: string, senderId: string) => void;
  getUnreadMessageCount: () => number;
  deleteConversation: (offerId: string, otherUserId: string) => void;
  restoreConversation: (offerId: string, otherUserId: string) => void;
  getDeletedConversations: () => DeletedConversation[];
  
  // Legacy Negotiations (keep for compatibility)
  messages: AppNegotiationMessage[];
  addMessage: (message: Omit<AppNegotiationMessage, "id" | "createdAt">) => void;
  getMessagesByOfferId: (offerId: string) => AppNegotiationMessage[];
  
  // Notifications
  notificationPrefs: NotificationPreferences;
  updateNotificationPrefs: (prefs: NotificationPreferences) => void;
  
  // UI
  isLoading: boolean;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

const AppContext = createContext<AppState | null>(null);

// Generate unique company code (e.g., "IBE-7843")
function generateCompanyCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

// Default data
const DEFAULT_COMPANIES: Company[] = [
  { id: "comp-1", name: "Iberia Servicios", province: "Barcelona", code: "IBE-7843" },
  { id: "comp-2", name: "Tecno Norte", province: "Madrid", code: "TEC-9214" },
  { id: "comp-3", name: "LogiCat", province: "Barcelona", code: "LOG-5532" },
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "dep-ops", name: "Operaciones", companyId: "comp-1" },
  { id: "dep-soporte", name: "Soporte", companyId: "comp-1" },
  { id: "dep-log", name: "Logística", companyId: "comp-1" },
  { id: "dep-rec", name: "Recepción", companyId: "comp-1" },
  { id: "dep-seg", name: "Seguridad", companyId: "comp-1" },
];

const DEFAULT_OFFERS: AppOffer[] = [
  {
    id: "1",
    day: 3,
    date: new Date().toISOString().slice(0, 10),
    title: "Turno de mañana - atención clientes",
    description: "Revisión de incidencias, apertura del local y coordinación de stock.",
    amount: "40 €",
    department: "dep-ops",
    departmentName: "Operaciones",
    companyId: "comp-1",
    companyName: "Iberia Servicios",
    type: "Alta demanda",
    hideName: false,
    status: "Publicado",
    ownerId: "user-2",
    createdAt: new Date().toISOString(),
    isPremium: true,
  },
  {
    id: "2",
    day: 3,
    date: new Date().toISOString().slice(0, 10),
    title: "Turno tarde - soporte interno",
    description: "Cobertura de mostrador y seguimiento de pedidos internos.",
    amount: "20 €",
    department: "dep-soporte",
    departmentName: "Soporte",
    companyId: "comp-1",
    companyName: "Iberia Servicios",
    type: "Nueva",
    hideName: true,
    status: "Publicado",
    ownerId: "user-1",
    createdAt: new Date().toISOString(),
    isPremium: false,
  },
  {
    id: "3",
    day: 7,
    date: new Date(new Date().setDate(7)).toISOString().slice(0, 10),
    title: "Turno noche - logística",
    description: "Control de accesos y coordinación de entregas urgentes.",
    amount: "60 €",
    department: "dep-log",
    departmentName: "Logística",
    companyId: "comp-1",
    companyName: "Iberia Servicios",
    type: "Aceptación rápida",
    hideName: false,
    status: "Publicado",
    ownerId: "user-2",
    createdAt: new Date().toISOString(),
    isPremium: true,
  },
];

const DEFAULT_MESSAGES: AppNegotiationMessage[] = [
  {
    id: "m1",
    offerId: "1",
    author: "Carlos",
    authorId: "user-3",
    role: "taker",
    text: "Hola, estoy interesado en este turno. ¿Sigues necesitando cobertura?",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    offerTitle: "Turno de mañana - atención clientes",
  },
  {
    id: "m2",
    offerId: "1",
    author: "María",
    authorId: "user-2",
    role: "owner",
    text: "Sí, aún está disponible. ¿Puedes cubrir todo el día?",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    offerTitle: "Turno de mañana - atención clientes",
  },
];

// Demo private messages
const DEFAULT_PRIVATE_MESSAGES: PrivateMessage[] = [
  {
    id: "pm-1",
    offerId: "1",
    senderId: "user-3",
    senderName: "Carlos",
    receiverId: "user-2",
    receiverName: "María",
    text: "Hola María, vi tu oferta del turno de mañana. ¿Todavía está disponible?",
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "pm-2",
    offerId: "1",
    senderId: "user-2",
    senderName: "María",
    receiverId: "user-3",
    receiverName: "Carlos",
    text: "¡Hola Carlos! Sí, aún está disponible. ¿Tienes experiencia en atención al cliente?",
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: "pm-3",
    offerId: "1",
    senderId: "user-3",
    senderName: "Carlos",
    receiverId: "user-2",
    receiverName: "María",
    text: "Sí, llevo 3 años trabajando en recepción. Me interesa mucho la oferta.",
    read: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const EDIT_TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

export function AppProvider({ children }: { children: ReactNode }) {
  // User state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Data state
  const [companies, setCompanies] = useState<Company[]>(DEFAULT_COMPANIES);
  const [activeCompany, setActiveCompany] = useState<Company | null>(DEFAULT_COMPANIES[0]);
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [offers, setOffers] = useState<AppOffer[]>(DEFAULT_OFFERS);
  const [messages, setMessages] = useState<AppNegotiationMessage[]>(DEFAULT_MESSAGES);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>(DEFAULT_PRIVATE_MESSAGES);
  const [deletedConversations, setDeletedConversations] = useState<DeletedConversation[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email: true,
    push: false,
    inApp: true,
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem("cl_user");
        const savedCompanies = localStorage.getItem("cl_companies");
        const savedDepartments = localStorage.getItem("cl_departments");
        const savedOffers = localStorage.getItem("cl_offers");
        const savedMessages = localStorage.getItem("cl_messages");
        const savedPrivateMessages = localStorage.getItem("cl_private_messages");
        const savedDeletedConversations = localStorage.getItem("cl_deleted_conversations");
        const savedNotifs = localStorage.getItem("cl_notifications");
        const savedActiveCompany = localStorage.getItem("cl_active_company");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
        if (savedCompanies) setCompanies(JSON.parse(savedCompanies));
        if (savedDepartments) setDepartments(JSON.parse(savedDepartments));
        if (savedOffers) setOffers(JSON.parse(savedOffers));
        if (savedMessages) setMessages(JSON.parse(savedMessages));
        if (savedPrivateMessages) setPrivateMessages(JSON.parse(savedPrivateMessages));
        if (savedDeletedConversations) setDeletedConversations(JSON.parse(savedDeletedConversations));
        if (savedNotifs) setNotificationPrefs(JSON.parse(savedNotifs));
        if (savedActiveCompany) setActiveCompany(JSON.parse(savedActiveCompany));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_user", JSON.stringify(user));
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_companies", JSON.stringify(companies));
    }
  }, [companies, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_departments", JSON.stringify(departments));
    }
  }, [departments, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_offers", JSON.stringify(offers));
    }
  }, [offers, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_messages", JSON.stringify(messages));
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_private_messages", JSON.stringify(privateMessages));
    }
  }, [privateMessages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_deleted_conversations", JSON.stringify(deletedConversations));
    }
  }, [deletedConversations, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_notifications", JSON.stringify(notificationPrefs));
    }
  }, [notificationPrefs, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cl_active_company", JSON.stringify(activeCompany));
    }
  }, [activeCompany, isLoading]);

  // Actions
  const login = (newUser: UserProfile) => {
    const userWithSubscription = {
      ...newUser,
      subscription: newUser.subscription || "free",
    };
    setUser(userWithSubscription);
    setIsAuthenticated(true);
    addToast({ type: "success", message: `Bienvenido, ${newUser.name}!` });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    addToast({ type: "info", message: "Sesión cerrada correctamente" });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const addCompany = (name: string, province: string): Company => {
    const code = generateCompanyCode(name);
    const company: Company = {
      id: `comp-${Date.now()}`,
      name,
      province,
      code,
    };
    setCompanies((prev) => [...prev, company]);
    addToast({ type: "success", message: `Empresa "${name}" creada. Código: ${code}` });
    return company;
  };

  const joinCompanyByCode = (code: string): boolean => {
    const company = companies.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );
    if (company) {
      setActiveCompany(company);
      addToast({ type: "success", message: `Te uniste a ${company.name}` });
      return true;
    }
    addToast({ type: "error", message: "Código no válido" });
    return false;
  };

  const searchCompanies = (query: string): Company[] => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.code.toLowerCase().includes(lowerQuery)
    );
  };

  const addDepartment = (department: Department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const addOffer = (offer: Omit<AppOffer, "id" | "createdAt">) => {
    const newOffer: AppOffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => [...prev, newOffer]);
    addToast({ type: "success", message: "Oferta publicada correctamente" });
    return newOffer;
  };

  const updateOffer = (id: string, updates: Partial<AppOffer>) => {
    setOffers((prev) =>
      prev.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer))
    );
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id));
    setMessages((prev) => prev.filter((msg) => msg.offerId !== id));
    setPrivateMessages((prev) => prev.filter((msg) => msg.offerId !== id));
    // Also clean up deleted conversations for this offer
    setDeletedConversations((prev) => prev.filter((dc) => dc.offerId !== id));
    addToast({ type: "info", message: "Oferta eliminada" });
  };

  const getOfferById = (id: string) => offers.find((o) => o.id === id);

  const getOffersByDay = (day: number, month: number, year: number) => {
    return offers.filter((offer) => {
      const offerDate = new Date(offer.date);
      return (
        offerDate.getDate() === day &&
        offerDate.getMonth() === month &&
        offerDate.getFullYear() === year
      );
    });
  };

  // Check if conversation is deleted for current user
  const isConversationDeleted = (offerId: string, otherUserId: string): boolean => {
    if (!user) return false;
    return deletedConversations.some(
      (dc) => dc.offerId === offerId && dc.otherUserId === otherUserId
    );
  };

  // Private Messages Functions
  const sendPrivateMessage = (offerId: string, receiverId: string, receiverName: string, text: string) => {
    if (!user) return;
    
    // If conversation was deleted, restore it when sending a new message
    const isDeleted = isConversationDeleted(offerId, receiverId);
    if (isDeleted) {
      restoreConversation(offerId, receiverId);
    }
    
    const newMessage: PrivateMessage = {
      id: `pm-${Date.now()}`,
      offerId,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      receiverName,
      text,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setPrivateMessages((prev) => [...prev, newMessage]);
  };

  const canEditMessage = (messageId: string): boolean => {
    if (!user) return false;
    
    const message = privateMessages.find((m) => m.id === messageId);
    if (!message) return false;
    
    // Only sender can edit
    if (message.senderId !== user.id) return false;
    
    // Check time limit (5 minutes)
    const messageTime = new Date(message.createdAt).getTime();
    const now = Date.now();
    return now - messageTime <= EDIT_TIME_LIMIT;
  };

  const editPrivateMessage = (messageId: string, newText: string): boolean => {
    if (!user || !canEditMessage(messageId)) return false;
    
    setPrivateMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              text: newText,
              edited: true,
              editedAt: new Date().toISOString(),
            }
          : msg
      )
    );
    
    addToast({ type: "success", message: "Mensaje editado" });
    return true;
  };

  const getPrivateConversation = (offerId: string, otherUserId: string) => {
    if (!user) return [];
    
    // Check if conversation is deleted for current user
    if (isConversationDeleted(offerId, otherUserId)) {
      return [];
    }
    
    return privateMessages
      .filter(
        (msg) =>
          msg.offerId === offerId &&
          ((msg.senderId === user.id && msg.receiverId === otherUserId) ||
            (msg.senderId === otherUserId && msg.receiverId === user.id)) &&
          // Filter out messages deleted by current user
          !(
            (msg.senderId === user.id && msg.deletedBySender) ||
            (msg.receiverId === user.id && msg.deletedByReceiver)
          )
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const getUserConversations = (): Conversation[] => {
    if (!user) return [];
    
    // Get all unique conversations (offer + other user combinations)
    const conversationMap = new Map<string, Conversation>();
    
    privateMessages.forEach((msg) => {
      if (msg.senderId !== user.id && msg.receiverId !== user.id) return;
      
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      const otherUserName = msg.senderId === user.id ? msg.receiverName : msg.senderName;
      const key = `${msg.offerId}-${otherUserId}`;
      
      // Skip if conversation is deleted for current user
      if (isConversationDeleted(msg.offerId, otherUserId)) return;
      
      // Skip if message is deleted for current user
      if (
        (msg.senderId === user.id && msg.deletedBySender) ||
        (msg.receiverId === user.id && msg.deletedByReceiver)
      ) {
        return;
      }
      
      const offer = offers.find((o) => o.id === msg.offerId);
      if (!offer) return;
      
      const existing = conversationMap.get(key);
      if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
        conversationMap.set(key, {
          offerId: msg.offerId,
          offerTitle: offer.title,
          otherUser: { id: otherUserId, name: otherUserName },
          lastMessage: msg,
          unreadCount: 0,
        });
      }
    });
    
    // Calculate unread counts
    const conversations = Array.from(conversationMap.values()).map((conv) => ({
      ...conv,
      unreadCount: privateMessages.filter(
        (msg) =>
          msg.offerId === conv.offerId &&
          msg.senderId === conv.otherUser.id &&
          msg.receiverId === user.id &&
          !msg.read &&
          !msg.deletedByReceiver
      ).length,
    }));
    
    // Sort by last message date (newest first)
    return conversations.sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );
  };

  const markMessagesAsRead = (offerId: string, senderId: string) => {
    if (!user) return;
    
    setPrivateMessages((prev) =>
      prev.map((msg) =>
        msg.offerId === offerId &&
        msg.senderId === senderId &&
        msg.receiverId === user.id &&
        !msg.read
          ? { ...msg, read: true }
          : msg
      )
    );
  };

  const getUnreadMessageCount = () => {
    if (!user) return 0;
    return privateMessages.filter(
      (msg) =>
        msg.receiverId === user.id &&
        !msg.read &&
        !msg.deletedByReceiver &&
        !isConversationDeleted(msg.offerId, msg.senderId)
    ).length;
  };

  const deleteConversation = (offerId: string, otherUserId: string) => {
    if (!user) return;
    
    // Add to deleted conversations for current user
    setDeletedConversations((prev) => [
      ...prev,
      {
        offerId,
        otherUserId,
        deletedAt: new Date().toISOString(),
      },
    ]);
    
    // Mark all messages in this conversation as deleted for current user
    setPrivateMessages((prev) =>
      prev.map((msg) => {
        if (
          msg.offerId === offerId &&
          ((msg.senderId === user.id && msg.receiverId === otherUserId) ||
            (msg.senderId === otherUserId && msg.receiverId === user.id))
        ) {
          if (msg.senderId === user.id) {
            return { ...msg, deletedBySender: true };
          } else {
            return { ...msg, deletedByReceiver: true };
          }
        }
        return msg;
      })
    );
    
    addToast({ type: "info", message: "Conversación eliminada" });
  };

  const restoreConversation = (offerId: string, otherUserId: string) => {
    if (!user) return;
    
    setDeletedConversations((prev) =>
      prev.filter(
        (dc) => !(dc.offerId === offerId && dc.otherUserId === otherUserId)
      )
    );
    
    // Restore messages (unmark deletion for current user)
    setPrivateMessages((prev) =>
      prev.map((msg) => {
        if (
          msg.offerId === offerId &&
          ((msg.senderId === user.id && msg.receiverId === otherUserId) ||
            (msg.senderId === otherUserId && msg.receiverId === user.id))
        ) {
          if (msg.senderId === user.id) {
            return { ...msg, deletedBySender: false };
          } else {
            return { ...msg, deletedByReceiver: false };
          }
        }
        return msg;
      })
    );
  };

  const getDeletedConversations = (): DeletedConversation[] => {
    return deletedConversations;
  };

  // Legacy functions (keep for compatibility)
  const addMessage = (message: Omit<AppNegotiationMessage, "id" | "createdAt">) => {
    const newMessage: AppNegotiationMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getMessagesByOfferId = (offerId: string) => {
    return messages.filter((msg) => msg.offerId === offerId);
  };

  const updateNotificationPrefs = (prefs: NotificationPreferences) => {
    setNotificationPrefs(prefs);
    addToast({ type: "success", message: "Preferencias actualizadas" });
  };

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const value: AppState = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    companies,
    activeCompany,
    setActiveCompany,
    addCompany,
    joinCompanyByCode,
    searchCompanies,
    departments,
    addDepartment,
    offers,
    addOffer,
    updateOffer,
    deleteOffer,
    getOfferById,
    getOffersByDay,
    privateMessages,
    sendPrivateMessage,
    editPrivateMessage,
    canEditMessage,
    getPrivateConversation,
    getUserConversations,
    markMessagesAsRead,
    getUnreadMessageCount,
    deleteConversation,
    restoreConversation,
    getDeletedConversations,
    messages,
    addMessage,
    getMessagesByOfferId,
    notificationPrefs,
    updateNotificationPrefs,
    isLoading,
    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
