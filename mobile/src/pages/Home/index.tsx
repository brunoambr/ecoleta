import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Image, Text, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { AppLoading } from 'expo';
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Feather as Icon } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

interface SelectPicker {
  key: string;
  label: string;
  value: string;
}

const Home = () => {

  const [ufs, setUfs] = useState<SelectPicker[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [cities, setCities] = useState<SelectPicker[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  // const [uf, setUf] = useState('');
  // const [city, setCity] = useState('');

  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  useEffect(() => {

    // Limpando as escolhas
    handleSelectionUf('');
    handleSelectionCity('');

    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {

        const ufsPicker = response.data.map(uf => {
          return {
            key: uf.sigla,
            label: uf.sigla,
            value: uf.sigla
          }
        });

        ufsPicker.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });

        setUfs(ufsPicker);

      });
  }, []);

  useEffect(() => {
    // Carregar as cidades sempre que a UF mudar
    if (selectedUf === '') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const citiesPicker = response.data.map(city => {
          return {
            key: city.nome,
            label: city.nome,
            value: city.nome
          }
        });

        citiesPicker.sort((a, b) => {
          return a.label < b.label ? -1 : 1;
        });

        setCities(citiesPicker);
      });

  }, [selectedUf]);

  function handleSelectionUf(value: string) {
    setSelectedUf(value);
  }

  function handleSelectionCity(value: string) {
    setSelectedCity(value);
  }

  function handleNavigateToPoints() {

    if (!selectedUf || !selectedCity) {
      Alert.alert('Oooops...', 'Para prosseguir, você deve informar a UF e a cidade desejada');
      return;
    }

    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    });
  }

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ height: 368, width: 274 }}>
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            placeholder={{
              label: 'Selecione a UF',
              value: '',
              color: '#9EA0A4',
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 20,
                right: 16,
              },
            }}
            onValueChange={(value) => { handleSelectionUf(value) }}
            items={ufs}
            Icon={() => {
              return <Icon name="chevron-down" size={20} color="gray" />;
            }}
            useNativeAndroidPickerStyle={false}
          />

          <RNPickerSelect
            placeholder={{
              label: 'Selecione a cidade',
              value: '',
              color: '#9EA0A4',
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 20,
                right: 16,
              },
            }}
            onValueChange={(value) => { handleSelectionCity(value) }}
            items={cities}
            Icon={() => {
              return <Icon name="chevron-down" size={20} color="gray" />;
            }}
            useNativeAndroidPickerStyle={false}
            disabled={!selectedUf}
          />

          {/* <TextInput style={styles.input} value={uf} maxLength={2} autoCapitalize="characters" autoCorrect={false} onChangeText={text => setUf(text)} placeholder="Digite a UF" /> */}

          {/* <TextInput style={styles.input} value={city} autoCorrect={false} onChangeText={text => setCity(text)} placeholder="Digite a cidade" /> */}

          <RectButton style={styles.button} onPress={handleNavigateToPoints} >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 60,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 60,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 8,
  },
});

export default Home;