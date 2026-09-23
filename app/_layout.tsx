import "@/global.css";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding

export default function RootLayout() {
  	const [fontsLoaded] = useFonts({
		"sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
		"sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
		"sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
		"sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
		"sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
		"sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  	})

	useEffect(() => {
		if (!fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

 	return <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />;
}
