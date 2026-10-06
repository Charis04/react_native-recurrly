import { AuthBrand, AuthButton, AuthCodeField, AuthField, AuthInlineError, AuthShell, PasswordField } from "@/components/AuthUI";
import { getClerkErrorMessage, validateCode, validateEmail, validatePassword, validatePasswordConfirmation } from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

type ResetStage = "email" | "code" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [stage, setStage] = useState<ResetStage>("email");
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isLoading = fetchStatus === "fetching";

  const sendCode = async () => {
    const emailError = validateEmail(emailAddress);
    setFieldErrors(emailError ? { emailAddress: emailError } : {});
    setFormError(undefined);
    if (emailError) return;

    const { error: createError } = await signIn.create({ identifier: emailAddress.trim().toLowerCase() });
    if (createError) {
      setFormError(getClerkErrorMessage(createError, "We could not find an account with that email."));
      return;
    }
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) {
      setFormError(getClerkErrorMessage(error, "We could not send your reset code."));
      return;
    }
    setStage("code");
  };

  const verifyCode = async () => {
    const codeError = validateCode(code);
    setFieldErrors(codeError ? { code: codeError } : {});
    setFormError(undefined);
    if (codeError) return;
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) {
      setFormError(getClerkErrorMessage(error, "That code is not valid. Check it and try again."));
      return;
    }
    setStage("password");
  };

  const updatePassword = async () => {
    const nextErrors: Record<string, string> = {};
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(password, confirmation);
    if (passwordError) nextErrors.password = passwordError;
    if (confirmationError) nextErrors.confirmation = confirmationError;
    setFieldErrors(nextErrors);
    setFormError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password, signOutOfOtherSessions: true });
    if (error) {
      setFormError(getClerkErrorMessage(error, "We could not update your password."));
      return;
    }
    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({ navigate: () => router.replace("/") });
      if (finalizeError) setFormError(getClerkErrorMessage(finalizeError, "Your password was updated, but we could not finish signing you in."));
    } else {
      setFormError("Your password needs one more step before you can continue.");
    }
  };

  const resendCode = async () => {
    setFormError(undefined);
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) setFormError(getClerkErrorMessage(error, "We could not send a new code."));
  };

  return (
    <AuthShell>
      <AuthBrand
        eyebrow="your money, clearer"
        title={stage === "email" ? "Reset your password" : stage === "code" ? "Check your inbox" : "Choose a new password"}
        subtitle={stage === "email" ? "We will send a secure code to help you get back in." : stage === "code" ? `Enter the 6-digit code sent to ${emailAddress.trim()}.` : "Use a fresh password you will remember and no one else can guess."}
      />
      <View className="auth-card">
        {stage === "email" ? (
          <View className="auth-form">
            <AuthField label="Email address" value={emailAddress} onChangeText={setEmailAddress} placeholder="you@example.com" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" error={fieldErrors.emailAddress || errors.fields.identifier?.message} />
            <AuthInlineError message={formError} />
            <AuthButton label="Send reset code" onPress={sendCode} loading={isLoading} />
          </View>
        ) : stage === "code" ? (
          <View className="auth-form">
            <AuthCodeField value={code} onChangeText={setCode} error={fieldErrors.code || errors.fields.code?.message} />
            <AuthInlineError message={formError} />
            <AuthButton label="Verify code" onPress={verifyCode} loading={isLoading} />
            <AuthButton label="Send a new code" onPress={resendCode} disabled={isLoading} />
          </View>
        ) : (
          <View className="auth-form">
            <PasswordField label="New password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" textContentType="newPassword" visible={showPassword} onToggle={() => setShowPassword((current) => !current)} error={fieldErrors.password || errors.fields.password?.message} />
            <PasswordField label="Confirm password" value={confirmation} onChangeText={setConfirmation} placeholder="Repeat your password" textContentType="newPassword" visible={showConfirmation} onToggle={() => setShowConfirmation((current) => !current)} error={fieldErrors.confirmation} />
            <AuthInlineError message={formError} />
            <AuthButton label="Update password" onPress={updatePassword} loading={isLoading} />
          </View>
        )}
      </View>
      <View className="auth-link-row">
        <Text className="auth-link-copy">Remembered it?</Text>
        <Link href="/(auth)/sign-in" className="auth-link">Back to sign in</Link>
      </View>
    </AuthShell>
  );
}
