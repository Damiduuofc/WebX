"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface PassengerUser {
  name: string;
  email: string;
  photo?: string;
  loggedIn: boolean;
  registeredAt?: string;
}

export type RoutePreference = "fastest" | "eco" | "accessible" | "cost" | "walking";

export interface JourneySessionState {
  origin: string;
  destination: string;
  preference: RoutePreference;
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  transfersCount: number;
  walkingMins: number;
  distanceKm: number;
  fareLkr: number;
  rating?: number;
  feedback?: string;
}

export const DEFAULT_JOURNEY_SESSION: JourneySessionState = {
  origin: "KDU, Ratmalana",
  destination: "Bandaranaike International Airport (BIA)",
  preference: "fastest",
  departureTime: "08:30 AM",
  arrivalTime: "09:08 AM",
  durationMins: 38,
  transfersCount: 2,
  walkingMins: 6,
  distanceKm: 18.4,
  fareLkr: 320,
};

interface AuthContextType {
  user: PassengerUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, photo?: string) => Promise<boolean>;
  demoLogin: () => void;
  logout: () => void;
  journey: JourneySessionState;
  updateJourney: (partial: Partial<JourneySessionState>) => void;
  resetJourney: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "univa_user";
const JOURNEY_STORAGE_KEY = "univa_journey_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PassengerUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const [journey, setJourney] = useState<JourneySessionState>(() => {
    if (typeof window === "undefined") return DEFAULT_JOURNEY_SESSION;
    try {
      const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_JOURNEY_SESSION;
    } catch {
      return DEFAULT_JOURNEY_SESSION;
    }
  });

  // Listen to window storage events across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("univa_auth_change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("univa_auth_change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveUser = useCallback((newUser: PassengerUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    window.dispatchEvent(new Event("univa_auth_change"));
  }, []);

  const login = useCallback(
    async (email: string, _pass: string) => {
      const name = email.includes("@") ? email.split("@")[0] : "Transit Passenger";
      const userData: PassengerUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        loggedIn: true,
      };
      saveUser(userData);
      return true;
    },
    [saveUser]
  );

  const register = useCallback(
    async (name: string, email: string, _pass: string, photo?: string) => {
      const userData: PassengerUser = {
        name: name.trim() || "Passenger",
        email: email.trim(),
        photo,
        loggedIn: true,
        registeredAt: new Date().toISOString(),
      };
      saveUser(userData);
      return true;
    },
    [saveUser]
  );

  const demoLogin = useCallback(() => {
    const demoUser: PassengerUser = {
      name: "Kasun Perera",
      email: "kasun.p@kdu.ac.lk",
      loggedIn: true,
      photo: "KP",
      registeredAt: new Date().toISOString(),
    };
    saveUser(demoUser);
  }, [saveUser]);

  const logout = useCallback(() => {
    saveUser(null);
  }, [saveUser]);

  const updateJourney = useCallback((partial: Partial<JourneySessionState>) => {
    setJourney((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }, []);

  const resetJourney = useCallback(() => {
    setJourney(DEFAULT_JOURNEY_SESSION);
    try {
      localStorage.removeItem(JOURNEY_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user?.loggedIn,
        login,
        register,
        demoLogin,
        logout,
        journey,
        updateJourney,
        resetJourney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * High-reliability AuthGuard that prevents unauthenticated passengers
 * from accessing protected journey-planning and live transit pages.
 */
export function AuthGuard({
  children,
  message = "Please create an account or log in to plan and track journeys with Univa.",
}: {
  children: ReactNode;
  message?: string;
}) {
  const { isAuthenticated, isLoading, demoLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `/signup?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#192841]/20 border-t-[#192841] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#64748B]">Verifying passenger credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-lg text-center space-y-5">
          <div className="flex justify-center pb-1">
            <Image
              src="/logo.png"
              alt="Univa Logo"
              width={120}
              height={38}
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#192841]/10 text-[#192841] flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0F172A]">Passenger Account Required</h2>
            <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{message}</p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={`/signup?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3.5 px-6 rounded-xl bg-[#192841] hover:bg-[#111C2E] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Create Account</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-[#192841] border border-[#E2E8F0] font-semibold text-xs transition-colors block"
            >
              Already have an account? Log in
            </Link>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  demoLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} className="text-emerald-600" />
                <span>1-Click Demo Passenger Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
