// App.js

// Importa as bibliotecas necessárias
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ContactListScreen from './src/screens/ContactListScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';

// Cria o navegador de pilha
const Stack = createNativeStackNavigator();

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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// Exporta o componente principal
export default App;
