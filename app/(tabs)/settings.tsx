import { useClerk } from '@clerk/expo';
import { styled } from "nativewind";
import React from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
      <Pressable className="auth-button mt-8" onPress={() => signOut()}>
        <Text className="auth-button-text">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings
