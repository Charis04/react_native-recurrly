import {
    AuthBrand,
    AuthButton,
    AuthCodeField,
    AuthField,
    AuthInlineError,
    AuthShell,
    PasswordField,
} from "@/components/AuthUI";
import {
    getClerkErrorMessage,
    validateCode,
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
} from "@/lib/auth";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

/** Handles account creation, email verification, and activation of the new session. */
export default function SignUp() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isLoading = fetchStatus === "fetching" || isFinalizing;


  const handleSignUp = async () => {
    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(emailAddress);
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(password, confirmation);
    if (emailError) nextErrors.emailAddress = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmationError) nextErrors.confirmation = confirmationError;
    setFieldErrors(nextErrors);
    setFormError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signUp.password({ emailAddress: emailAddress.trim().toLowerCase(), password });
    if (error) {
      setFormError(getClerkErrorMessage(error, "We could not create your account. Check your details and try again."));
      return;
    }

    const { error: verificationError } = await signUp.verifications.sendEmailCode();
    if (verificationError) {
      setFormError(getClerkErrorMessage(verificationError, "We could not send your verification code."));
      return;
    }
    setIsVerifying(true);
  };

  
const handleVerify = async () => {
  const codeError = validateCode(code);
  setFieldErrors(codeError ? { code: codeError } : {});
  setFormError(undefined);

  if (codeError) return;

  // Verify only if this sign-up hasn't already completed verification.
  if (signUp.status !== "complete") {
    const { error } =
      await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

    // A previous verification may already have succeeded.
    // Continue if the sign-up is now complete.
    if (error && signUp.status !== "complete") {
      setFormError(
        getClerkErrorMessage(
          error,
          "That code is not valid. Check it and try again."
        )
      );
      return;
    }
  }

  if (signUp.status !== "complete") {
  console.log("Clerk sign-up status:", signUp.status);
  console.log("Missing fields:", signUp.missingFields);
  console.log("Unverified fields:", signUp.unverifiedFields);
  console.log("Required fields:", signUp.requiredFields);

  setFormError(
    `Email verified, but sign-up status is ${signUp.status}. ` +
      `Missing: ${signUp.missingFields.join(", ") || "none"}`
  );

  return;
}

  // Finalize the sign-up and activate the session.
  setIsFinalizing(true);

  const { error: finalizeError } = await signUp.finalize({
    navigate: ({ decorateUrl }) =>
      router.replace(decorateUrl("/")),
  });

  if (finalizeError) {
    setIsFinalizing(false);
    setFormError(
      getClerkErrorMessage(
        finalizeError,
        "Your email was verified, but we could not finish setting up your account."
      )
    );
  }
};


  const resendCode = async () => {
    setFormError(undefined);
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) setFormError(getClerkErrorMessage(error, "We could not send a new code."));
  };

  return (
    <AuthShell>
      <AuthBrand
        eyebrow="your money, clearer"
        title={isVerifying ? "Check your inbox" : "Make subscriptions feel simple"}
        subtitle={isVerifying ? `We sent a 6-digit code to ${emailAddress.trim()}.` : "Create your account and take control of every recurring payment."}
      />
      <View className="auth-card">
        {isVerifying ? (
          <View className="auth-form">
            <AuthCodeField value={code} onChangeText={setCode} error={fieldErrors.code} />
            <AuthInlineError message={formError} />
            <AuthButton label="Verify email" onPress={handleVerify} loading={isLoading} />
            <Text className="auth-helper">The code expires shortly. Check your spam folder if it is missing.</Text>
            <AuthButton label="Send a new code" onPress={resendCode} disabled={isLoading} />
          </View>
        ) : (
          <View className="auth-form">
            <AuthField label="Email address" value={emailAddress} onChangeText={setEmailAddress} placeholder="you@example.com" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" error={fieldErrors.emailAddress || errors.fields.emailAddress?.message} />
            <PasswordField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" textContentType="newPassword" visible={showPassword} onToggle={() => setShowPassword((current) => !current)} error={fieldErrors.password || errors.fields.password?.message} />
            <PasswordField label="Confirm password" value={confirmation} onChangeText={setConfirmation} placeholder="Repeat your password" textContentType="newPassword" visible={showConfirmation} onToggle={() => setShowConfirmation((current) => !current)} error={fieldErrors.confirmation} />
            <AuthInlineError message={formError} />
            <AuthButton label="Create account" onPress={handleSignUp} loading={isLoading} />
            <Text className="auth-helper">By continuing, you agree to keep your account details accurate and secure.</Text>
          </View>
        )}
      </View>
      <View className="auth-link-row">
        <Text className="auth-link-copy">Already have an account?</Text>
        <Link href="/(auth)/sign-in" className="auth-link">Sign in</Link>
      </View>
    </AuthShell>
  );
}
