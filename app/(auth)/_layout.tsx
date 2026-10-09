import "@/global.css";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

/** Waits for auth to load, then redirects signed-in users or renders the auth stack. */
export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
