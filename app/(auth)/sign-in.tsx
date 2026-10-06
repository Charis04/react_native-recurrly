import { AuthBrand, AuthButton, AuthCodeField, AuthField, AuthInlineError, AuthShell, PasswordField } from "@/components/AuthUI";
import { getClerkErrorMessage, validateCode, validateEmail, validatePassword } from "@/lib/auth";
import { useClerk, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type VerificationMode = "device" | "mfa";

export default function SignIn() {
  const router = useRouter();
  const { setActive } = useClerk();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verificationMode, setVerificationMode] = useState<VerificationMode>();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const isLoading = fetchStatus === "fetching" || isFinalizing;

  useEffect(() => {
    if (!verificationComplete || isFinalizing || signIn.status !== "complete" || !signIn.createdSessionId) return;

    setIsFinalizing(true);
    void setActive({ session: signIn.createdSessionId })
      .then(() => router.replace("/"))
      .catch((error: unknown) => {
        setIsFinalizing(false);
        setFormError(getClerkErrorMessage(error, "We could not finish signing you in."));
      });
  }, [isFinalizing, router, setActive, signIn, signIn.createdSessionId, signIn.status, verificationComplete]);

  const sendEmailVerification = async (mode: VerificationMode) => {
    setVerificationComplete(false);
    setFormError(undefined);
    const hasEmailFactor = signIn.supportedSecondFactors.some((factor) => factor.strategy === "email_code");
    if (!hasEmailFactor) {
      setFormError("This account uses a verification method that is not enabled in this app.");
      return;
    }
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setFormError(getClerkErrorMessage(error, "We could not send your verification code."));
      return;
    }
    setVerificationMode(mode);
  };

  const handleSignIn = async () => {
    const nextErrors: Record<string, string> = {};
    const emailError = validateEmail(emailAddress);
    const passwordError = validatePassword(password);
    if (emailError) nextErrors.emailAddress = emailError;
    if (passwordError) nextErrors.password = passwordError;
    setFieldErrors(nextErrors);
    setFormError(undefined);
    setVerificationComplete(false);
    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await signIn.password({ emailAddress: emailAddress.trim().toLowerCase(), password });
    if (error) {
      setFormError(getClerkErrorMessage(error, "Those details did not work. Check them and try again."));
      return;
    }
    if (signIn.status === "complete") {
      setVerificationComplete(true);
      return;
    }
    if (signIn.status === "needs_client_trust") {
      await sendEmailVerification("device");
      return;
    }
    if (signIn.status === "needs_second_factor") {
      await sendEmailVerification("mfa");
      return;
    }
    setFormError("Your account needs one more step before you can continue.");
  };

  const handleVerify = async () => {
    const codeError = validateCode(code);
    setFieldErrors(codeError ? { code: codeError } : {});
    setFormError(undefined);
    if (codeError) return;
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) {
      setFormError(getClerkErrorMessage(error, "That code is not valid. Check it and try again."));
      return;
    }
    setVerificationComplete(true);
  };

  const resendCode = async () => {
    setFormError(undefined);
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) setFormError(getClerkErrorMessage(error, "We could not send a new code."));
  };

  const resetSignIn = async () => {
    await signIn.reset();
    setVerificationMode(undefined);
    setVerificationComplete(false);
    setIsFinalizing(false);
    setCode("");
    setFormError(undefined);
    setFieldErrors({});
  };

  const isVerifying = Boolean(verificationMode);
  return (
    <AuthShell>
      <AuthBrand eyebrow="your money, clearer" title={isVerifying ? "One more quick check" : "Welcome back"} subtitle={isVerifying ? "Confirm it is really you, then we will take you straight to your subscriptions." : "See every recurring payment clearly, all in one place."} />
      <View className="auth-card">
        {isVerifying ? (
          <View className="auth-form">
            <AuthCodeField value={code} onChangeText={setCode} error={fieldErrors.code} />
            <AuthInlineError message={formError} />
            <AuthButton label="Verify and continue" onPress={handleVerify} loading={isLoading} />
            <AuthButton label="Send a new code" onPress={resendCode} disabled={isLoading} />
            <AuthButton label="Use different details" onPress={resetSignIn} disabled={isLoading} />
          </View>
        ) : (
          <View className="auth-form">
            <AuthField label="Email address" value={emailAddress} onChangeText={setEmailAddress} placeholder="you@example.com" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" error={fieldErrors.emailAddress || errors.fields.identifier?.message} />
            <PasswordField label="Password" value={password} onChangeText={setPassword} placeholder="Your password" textContentType="password" visible={showPassword} onToggle={() => setShowPassword((current) => !current)} error={fieldErrors.password || errors.fields.password?.message} />
            <View className="auth-forgot-row"><Link href="/(auth)/forgot-password" className="auth-link">Forgot password?</Link></View>
            <AuthInlineError message={formError} />
            <AuthButton label="Sign in" onPress={handleSignIn} loading={isLoading} />
          </View>
        )}
      </View>
      <View className="auth-link-row">
        <Text className="auth-link-copy">New to recurrly?</Text>
        <Link href="/(auth)/sign-up" className="auth-link">Create an account</Link>
      </View>
    </AuthShell>
  );
}
