import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { ReactNode } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView
        className="auth-scroll"
        contentContainerClassName="auth-content"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function AuthBrand({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">R</Text>
        </View>
        <View>
          <Text className="auth-wordmark">recurrly</Text>
          <Text className="auth-wordmark-sub">{eyebrow}</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      <Text className="auth-subtitle">{subtitle}</Text>
    </View>
  );
}

export function AuthField({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        {...props}
        className={`auth-input ${error ? "auth-input-error" : ""}`}
        placeholderTextColor="rgba(8, 17, 38, 0.42)"
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

export function PasswordField({ label, error, visible, onToggle, ...props }: TextInputProps & { label: string; error?: string; visible: boolean; onToggle: () => void }) {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <View className={`auth-input-wrap ${error ? "auth-input-error" : ""}`}>
        <TextInput
          {...props}
          className="auth-input auth-input-grow"
          secureTextEntry={!visible}
          placeholderTextColor="rgba(8, 17, 38, 0.42)"
        />
        <Pressable className="auth-visibility" onPress={onToggle} accessibilityLabel={visible ? "Hide password" : "Show password"}>
          <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} color={colors.mutedForeground} />
        </Pressable>
      </View>
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}

export function AuthButton({ label, onPress, loading, disabled }: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <Pressable
      className={`auth-button ${disabled || loading ? "auth-button-disabled" : ""}`}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : <Text className="auth-button-text">{label}</Text>}
    </Pressable>
  );
}

export function AuthInlineError({ message }: { message?: string }) {
  return message ? <Text className="auth-form-error">{message}</Text> : null;
}

export function AuthCodeField({ value, onChangeText, error }: { value: string; onChangeText: (value: string) => void; error?: string }) {
  return (
    <AuthField
      label="Verification code"
      value={value}
      onChangeText={(nextValue) => onChangeText(nextValue.replace(/\D/g, "").slice(0, 6))}
      placeholder="000000"
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      maxLength={6}
      autoFocus
      error={error}
    />
  );
}
