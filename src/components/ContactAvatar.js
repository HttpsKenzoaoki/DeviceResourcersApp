// src/components/ContactAvatar.js
// Exibe a foto do contato ou, na ausência dela, um círculo com as iniciais.

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

// Gera as iniciais a partir do nome completo (ex: "João Silva" -> "JS")
export const getInitials = (name) => {
  if (!name) return '?';

  const words = name.trim().split(/\s+/);
  const first = words[0] ? words[0][0] : '';
  const second = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + second).toUpperCase();
};

const ContactAvatar = ({ size = 56, name, photoUri }) => {
  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={[styles.photo, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.initialsCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.36 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  photo: {
    backgroundColor: '#ddd',
  },
  initialsCircle: {
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactAvatar;
