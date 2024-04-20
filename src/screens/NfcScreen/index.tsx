import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import NfcManager, { NfcEvents } from "react-native-nfc-manager";

const NfcScreen = () => {
  const [hasNfc, setHasNFC] = useState(true);

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

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag:any) => {
      console.log(tag, "tag found");
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  return (
    <View className="flex-1 justify-center items-center bg-green-700">
      <Text>NfcScreen: Yes/no {hasNfc}</Text>
    </View>
  );
};

export default NfcScreen;
