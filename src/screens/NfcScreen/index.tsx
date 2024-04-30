import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";

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
    NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagReading);

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const handleTagReading = (tag: any) => {
    console.log(
      Ndef.uri.decodePayload(tag.ndefMessage[0].payload),
      "tag found"
    );

    /**
     * Odebisi Idowu Solomon Soji
     * Sci/18/19/0623
     * Computer Science
     * 400
     *
     */

    // console.log(tag, "tag found");
  };

  useEffect(() => {
    readTag();
  }, []);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  const writeNFC = async () => {
    let result = false;

    const data = {
      name: "Odebisi Idowu Solomon Soji",
      matric_no: "Sci/18/19/0623",
      course: "Computer Science",
      level: "400",
    };

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.uriRecord(`${JSON.stringify(data)}`),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  };

  return (
    <View className="flex-1 justify-center items-center bg-green-700">
      <Text>NfcScreen: {`${hasNfc}`}</Text>
      <Text onPress={() => readTag()}>Read tag</Text>
      <Text onPress={() => writeNFC()}>Write tag</Text>
    </View>
  );
};

export default NfcScreen;
