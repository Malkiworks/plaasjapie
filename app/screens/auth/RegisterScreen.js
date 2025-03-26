import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp, authError } = useAuth();

  const handleRegister = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', translate('errors.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', translate('auth.passwordMismatch'));
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'You must agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    try {
      const success = await signUp(email, password, displayName);
      if (success) {
        // Navigation will be handled by the auth state listener
      } else {
        Alert.alert('Error', authError || translate('errors.somethingWentWrong'));
      }
    } catch (error) {
      Alert.alert('Error', error.message || translate('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{translate('auth.createAccount')}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translate('onboarding.firstName')}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translate('auth.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translate('auth.password')}
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons
                  name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translate('auth.confirmPassword')}
                secureTextEntry={hideConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                <Ionicons
                  name={hideConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms ? (
                  <Ionicons name="checkbox" size={24} color="#E63946" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="#666" />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>{translate('auth.agreeToTerms')}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, !agreeToTerms && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading || !agreeToTerms}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>{translate('auth.signUp')}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>{translate('auth.alreadyHaveAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>{translate('auth.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  button: {
    backgroundColor: '#E63946',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#E6394680',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E63946',
    marginLeft: 4,
  },
});

export default RegisterScreen; 