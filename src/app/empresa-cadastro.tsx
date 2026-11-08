import { useState } from 'react';
import { router } from 'expo-router';
import { Keyboard, Text, View } from 'react-native';

import { BackControl } from '../components/BackControl';
import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { Title } from '../components/Title';
import { sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function CompanyRegistrationScreen() {
  const { requestCompany } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleRequest() {
    if (submitted) return;
    Keyboard.dismiss();
    const result = requestCompany({ companyName, responsibleName, email, password, confirmPassword });
    setError(result.ok ? '' : result.message);
    if (result.ok) {
      setPassword('');
      setConfirmPassword('');
      setSubmitted(true);
    }
  }

  return (
    <Screen>
      <BackControl label="Voltar ao Login" href="/empresa-login" />
      <Brand />
      {submitted ? (
        <View style={sharedStyles.form}>
          <Title>Cadastro solicitado!</Title>
          <Text style={sharedStyles.body} accessibilityRole="alert" accessibilityLiveRegion="polite">
            Seu acesso está aguardando aprovação do TEIA.
          </Text>
          <Button title="Voltar ao Login" onPress={() => router.replace('/empresa-login')} />
        </View>
      ) : (
        <>
          <Title>Solicitar cadastro</Title>
          <Text style={sharedStyles.subtitle}>Preencha os dados da empresa para solicitar acesso ao TEIA.</Text>
          <View style={sharedStyles.form}>
            <Input label="Nome da empresa" value={companyName}
              onChangeText={(value) => { setCompanyName(value); setError(''); }} autoCapitalize="words" />
            <Input label="Nome do responsável" value={responsibleName}
              onChangeText={(value) => { setResponsibleName(value); setError(''); }}
              autoCapitalize="words" autoComplete="name" />
            <Input label="E-mail" value={email}
              onChangeText={(value) => { setEmail(value); setError(''); }}
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
            <Input label="Senha" placeholder="Pelo menos 6 caracteres" value={password}
              onChangeText={(value) => { setPassword(value); setError(''); }}
              secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="new-password" />
            <Input label="Confirmação de senha" value={confirmPassword}
              onChangeText={(value) => { setConfirmPassword(value); setError(''); }}
              secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="new-password"
              returnKeyType="go" onSubmitEditing={handleRequest} />
            {!!error && <Text style={sharedStyles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}
            <Button title="Solicitar cadastro" onPress={handleRequest} />
          </View>
        </>
      )}
    </Screen>
  );
}
