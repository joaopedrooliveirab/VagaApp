import { StyleSheet, View } from 'react-native';

type AvatarProps = {
  size?: number;
};

const FACE_COLOR = '#A0A0A0';

// Avatar padrão: rosto sorridente cinza com borda branca, sem foto.
export function Avatar({ size = 108 }: AvatarProps) {
  const eye = size * 0.14;
  const line = Math.max(2, size * 0.03);
  const smileHeight = size * 0.14;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Foto de perfil padrão"
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <View
        style={[
          styles.eyes,
          { top: size * 0.3, gap: size * 0.2 },
        ]}
      >
        {[0, 1].map((index) => (
          <View
            key={index}
            style={{
              width: eye,
              height: eye,
              borderTopWidth: line,
              borderLeftWidth: line,
              borderColor: FACE_COLOR,
              borderTopLeftRadius: line,
              transform: [{ rotate: '45deg' }],
            }}
          />
        ))}
      </View>

      <View
        style={{
          position: 'absolute',
          top: size * 0.52,
          width: size * 0.3,
          height: smileHeight,
          borderBottomWidth: line,
          borderColor: FACE_COLOR,
          borderBottomLeftRadius: smileHeight,
          borderBottomRightRadius: smileHeight,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#D9D9D9',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  eyes: {
    position: 'absolute',
    flexDirection: 'row',
  },
});
