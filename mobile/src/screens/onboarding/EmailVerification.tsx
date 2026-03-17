import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

interface EmailVerificationScreenProps {
  email: string;
  onVerified: () => void;
}

export function EmailVerificationScreen({
  email,
  onVerified,
}: EmailVerificationScreenProps) {
  const { checkVerification, resendVerification } = useAuth();

  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState(
    "Check your email to verify your account."
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const verify = async () => {
        try {
          const verified = await checkVerification(email);

          if (verified && checking) {
            clearInterval(interval);
            setChecking(false);
            setMessage("Email verified! Redirecting...");
            onVerified();
          }
        } catch (err) {
          console.error("Verification check failed:", err);
        }
      };

      verify();
    }, 4000);

    return () => clearInterval(interval);
  }, [checkVerification, email, onVerified]);

  const handleResend = async () => {
    try {
      await resendVerification(email);
      setMessage("Verification email resent. Check your inbox.");
    } catch {
      setMessage("Failed to resend email. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>

      {checking && <ActivityIndicator size="large" color="#fff" />}

      <TouchableOpacity style={styles.button} onPress={handleResend}>
        <Text style={styles.buttonText}>Resend Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    padding: 12,
  },
  buttonText: {
    color: "#4da6ff",
    fontSize: 16,
  },
});