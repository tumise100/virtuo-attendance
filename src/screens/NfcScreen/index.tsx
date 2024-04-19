import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";

const NfcScreen = () => {
  const [hasNfc, setHasNFC] = useState(false);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();

      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }

      console.log(deviceIsSupported);
    };

    checkIsSupported();
  }, []);

  return (
    <View>
      <Text>NfcScreen: {hasNfc}</Text>
    </View>
  );
};

export default NfcScreen;
