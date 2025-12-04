import {
  View,
  ScrollView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import {
  BarcodeScanningResult,
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { showToast } from "@/src/components/UI/showToast";
import NfcManager from "react-native-nfc-manager";

type NfcAttendanceTakingNotSupportedProps = {
  onRetry?: () => void;
};

const NfcAttendanceTakingNotSupported = ({
  onRetry,
}: NfcAttendanceTakingNotSupportedProps) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState<BarcodeScanningResult>();
  const [showCamera, setShowCamera] = useState<boolean>(false);

  function toggleCameraFacing() {
    console.log("clicked");

    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const permissionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    console.log(cameraPermission);
  };

  if (showCamera) {
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
    if (!permission.granted) {
      // Camera permissions are not granted yet.

      return (
        <View className="flex-1 bg-white justify-center items-center">
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <CustomButton
            onPress={requestPermission}
            title="Grant permission"
            customClassName="mt-10"
          />
        </View>
      );
    }
    return (
      <View className="flex-1 justify-center">
        <CameraView
          className="flex-1"
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(sR) => {
            setScanResult(sR);
            if (sR.data) {
              showToast("Qr Code Scanned!");
              setShowCamera(false);
            }
          }}
        >
          <View className="flex-1 flex-row bg-transparent m-[64px]">
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Text>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18 text="Attendance" customClassName="ml-5" />
        </View>
      </View>
      <BodyRegular
        text="Tap your NFC identity card to mark attendance"
        type={TextFontType.Regular}
        customClassName="my-3 text-gray3"
      />
      <View className="justify-center">
        <View className="justify-center items-center">
          <SubheadingSemibold18 text="Intro to Computer Sci." />
          <DescriptionText
            text="Monday, 15th Mar. (9AM - 12PM)"
            type={TextFontType.Medium}
            customClassName="my-2"
          />
          <View className="w-[208px] h-[287px] my-12">
            <Image
              source={PhoneWithCardImg}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>
          <H5Text
            text="NFC is unavailable. Enable NFC in your phone settings to continue"
            type={TextFontType.Bold}
            customClassName="w-[85%] text-center"
          />
          <H5Text
            text={JSON.stringify(scanResult?.data)}
            type={TextFontType.Regular}
            customClassName="w-[85%] text-sm text-center"
          />
          <BodyRegular
            text="You can also mark attendance by scanning the QR CODE on your student’s card"
            type={TextFontType.Regular}
            customClassName="text-gray3 w-[99%] text-center mt-4"
          />
        </View>
        <CustomButton
          title="Open NFC settings"
          onPress={() => NfcManager.goToNfcSetting?.()}
          customClassName="mt-7"
        />
        {onRetry ? (
          <CustomButton
            title="Retry NFC check"
            onPress={onRetry}
            customClassName="mt-3"
          />
        ) : null}
        <CustomButton
          title="SCAN QR CODE"
          onPress={() => setShowCamera(true)}
          customClassName="mt-3"
        />
      </View>
      <View className="h-24" />
    </ScrollView>
  );
};

export default NfcAttendanceTakingNotSupported;
