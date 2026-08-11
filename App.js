// App.js

// Importa as bibliotecas necessárias
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ContactListScreen from './src/screens/ContactListScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';
import ImagePickerComponent from './src/components/ImagePickerComponent';
import ContactsComponent from './src/components/ContactsComponent';

// Cria o navegador de pilha
const Stack = createNativeStackNavigator();

// Tela 3 - Central de recursos do dispositivo
const DeviceResourcesScreen = ({ navigation }) => {
  const resources = [
    {
      title: 'Galeria de Fotos',
      description: 'Adicione imagens da galeria e gerencie-as de forma persistente.',
      screen: 'ImageGallery',
    },
    {
      title: 'Compartilhar Contatos',
      description: 'Busque um contato pelo nome e compartilhe telefones e emails.',
      screen: 'ContactTools',
    },
  ];

  return (
    <View style={styles.resourcesContainer}>
      {resources.map((resource) => (
        <TouchableOpacity
          key={resource.screen}
          style={styles.resourceItem}
          onPress={() => navigation.navigate(resource.screen)}
        >
          <Text style={styles.resourceTitle}>{resource.title}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Define o componente principal do aplicativo
const App = () => {
  return (
    // SafeAreaProvider é necessário para o SafeAreaView funcionar
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ContactList">
          {/* Tela 1 - Lista de contatos */}
          <Stack.Screen
            name="ContactList"
            component={ContactListScreen}
            options={{ title: 'Contatos' }}
          />

          {/* Tela 2 - Detalhes do contato */}
          <Stack.Screen
            name="ContactDetail"
            component={ContactDetailScreen}
            options={{ title: 'Detalhes do Contato' }}
          />

          {/* Tela 3 - Central de recursos do dispositivo */}
          <Stack.Screen
            name="DeviceResources"
            component={DeviceResourcesScreen}
            options={{ title: 'Recursos do Dispositivo' }}
          />

          {/* Tela 4 - Galeria pessoal (ImagePickerComponent) */}
          <Stack.Screen
            name="ImageGallery"
            component={ImagePickerComponent}
            options={{ title: 'Galeria de Fotos' }}
          />

          {/* Tela 5 - Compartilhar contatos (ContactsComponent) */}
          <Stack.Screen
            name="ContactTools"
            component={ContactsComponent}
            options={{ title: 'Compartilhar Contatos' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  resourcesContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  resourceItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default App;
