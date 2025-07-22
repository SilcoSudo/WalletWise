import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ isDarkMode = false }) => {
  const { i18n } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
      <TouchableOpacity onPress={() => i18n.changeLanguage('vi')}>
        <Text style={{ color: i18n.language === 'vi' ? '#2563eb' : (isDarkMode ? '#a5b4fc' : '#6b7280'), fontWeight: 'bold', marginRight: 8 }}>VI</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => i18n.changeLanguage('en')}>
        <Text style={{ color: i18n.language === 'en' ? '#2563eb' : (isDarkMode ? '#a5b4fc' : '#6b7280'), fontWeight: 'bold' }}>EN</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LanguageSwitcher; 