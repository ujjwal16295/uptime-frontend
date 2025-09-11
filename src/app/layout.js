"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import StoreProvider from "@/store/StoreProvider";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../lib/supabase";
import { setPlan } from "@/store/PlanSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }) {
  const dispatch = useDispatch();

  const fetchUserPlan = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${email}/plan`);
      
      if (response.ok) {
        const data = await response.json();
        dispatch(setPlan(data.data.plan));
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  useEffect(() => {
    const getUserAndPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          await fetchUserPlan(user.email);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUserAndPlan();

    // Listen for auth changes and fetch plan when user signs in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        await fetchUserPlan(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <>
      {children}
      <Footer />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </StoreProvider>
      </body>
    </html>
  );
}