import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E23C2E',
  coral: '#E8655A',
  lightCoral: '#F3AFA9',
  veryLight: '#F9D6D3',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#374151',
  muted: '#64748B',
  border: '#CBD5E1',
  error: '#B42318',
};

export const sharedStyles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },

  form: {
    gap: 18,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },

  error: {
    color: colors.error,
    backgroundColor: '#FFF1F0',
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  footer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 26,
  },

  muted: {
    color: colors.muted,
    fontSize: 15,
  },

  link: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    textAlign: 'center',
  },
});