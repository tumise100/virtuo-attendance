import { View, Text, StatusBar, Image, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import {
  HeadingsSemibold24,
  SubheadingSemibold18,
} from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps, StudentAttendance } from "@/src/shared";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";
import { StudentAttendanceMarked } from "@/src/components/UI/StudentOverviewCard";
import { showToast } from "@/src/components/UI/showToast";

const AttendanceTakingScreen = ({ navigation }: StackNavigationProps) => {
  const [hasNfc, setHasNFC] = useState(true);

  const [studentAttendance, setStudentAttendance] = useState<
    StudentAttendance[] | null
  >(null);
  const [currentStudentAttendance, setCurrentStudentAttendance] =
    useState<StudentAttendance | null>(null);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();

      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
      }
    };

    checkIsSupported();
  }, []);

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagReading);

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, [currentStudentAttendance, studentAttendance]);

  const handleTagReading = useCallback(
    (tag: any) => {
      setCurrentStudentAttendance(null);
      const data = JSON.parse(
        Ndef.uri.decodePayload(tag.ndefMessage[0].payload)
      ) as StudentAttendance;
      // console.log(data, "data");

      console.log(studentAttendance);

      if (
        studentAttendance &&
        studentAttendance.find((sA) => sA.matric_no === data.matric_no)
      ) {
        showToast("User has been registered already!");
      } else {
        const a = [...(studentAttendance || []), data];

        setStudentAttendance(a);
        setCurrentStudentAttendance(data);
      }
      // console.log(
      //   Ndef.uri.decodePayload(tag.ndefMessage[0].payload),
      //   "tag found"
      // );
    },
    [studentAttendance, currentStudentAttendance]
  );

  if (!hasNfc) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Your Device does not support Nfc</Text>
      </View>
    );
  }

  useEffect(() => {
    readTag();
  }, []);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

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
          {!currentStudentAttendance ? (
            <>
              <H5Text
                text="Hold your card against back of your phone"
                type={TextFontType.Bold}
                customClassName="w-[85%] text-center"
              />
              <BodyRegular
                text="Hold your NFC card against the back of your phone, near the NFC chip location. Ensure that the NFC card's chip aligns with your phone's NFC area to establish a connection."
                type={TextFontType.Regular}
                customClassName="text-gray3 w-[99%] text-center mt-4"
              />
            </>
          ) : null}
        </View>
        {currentStudentAttendance ? (
          <View className="my-6">
            <StudentAttendanceMarked
              name={currentStudentAttendance.name}
              matric_no={currentStudentAttendance.matric_no}
              level={currentStudentAttendance.level}
              course={currentStudentAttendance.course}
            />
            <HeadingsSemibold24
              text="Thank you"
              customClassName="text-center"
            />
            <CustomButton
              title="Done"
              onPress={() => navigation.navigate("StudentAttendanceScreen")}
              customClassName="my-5"
            />
          </View>
        ) : null}
      </View>
      <View className="h-24" />
    </ScrollView>
  );
};

export default AttendanceTakingScreen;
