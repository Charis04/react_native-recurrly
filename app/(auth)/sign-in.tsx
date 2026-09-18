import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>Sign In</Text>
      <Link href="/(auth)/sign-up" >Don't have an account? Sign Up</Link>
      <Link href="/">Go Home</Link>
    </View>
  )
}

export default SignIn