import {
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import {
  HeadingsSemibold24,
  SubheadingSemibold18,
} from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import moment from "moment";
import { H5Text } from "@/src/theme/typography/HeaderText";
import { CustomButton } from "@/src/components/UI/Buttons";
import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import NfcAttendanceTakingNotSupported from "../AttendanceTakingScreen/NfcAttendanceTakingNotSupported";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";
import { MarkSecondaryStudentAttedance } from "@/src/services/attendance";
import { showToast } from "@/src/components/UI/showToast";
import { extractStudentId } from "@/src/utils";

const SecondaryAttendanceTakingScreen = () => {
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);

  const [studentId, setStudentId] = useState<string | null>(null);

  const [disableTagReading, setDisableTagReading] = useState(false);

  const [hasNfc, setHasNFC] = useState(false);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      // const deviceIsSupported = false;

      console.log(deviceIsSupported, "deviceIsSupported");
      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        readTag();
      }
    };

    checkIsSupported();
  }, []);

  useEffect(() => {
    if (!disableTagReading) {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagReading);
    } else {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, [disableTagReading]);

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  //   const disableTagReading = async () => {
  //     await NfcManager.unregisterTagEvent();
  //   };

  useEffect(() => {
    handleMarkSecondaryAttendance();
  }, [studentId]);

  const handleTagReading = (tag: any) => {
    console.log(
      Ndef.uri.decodePayload(tag.ndefMessage[0].payload),
      "handleTagReading"
    );

    try {
      const payload = tag.ndefMessage[0].payload;
      const decodedPayload = Ndef.uri.decodePayload(payload);

      if (!decodedPayload) return null;

      const studentId = extractStudentId(decodedPayload);

      console.log(studentId, "studentId");

      if (!studentId) {
        throw new Error("Bad ID");
      }

      setStudentId(`${studentId}`);

      console.log(decodedPayload, studentId, "decoded");
    } catch (error) {
      showToast("Invalid Tag!");
      console.log(error, "error");
    }
  };

  const handleMarkSecondaryAttendance = useCallback(() => {
    if (studentId) {
      console.log(studentId, "handleMarkSecondaryAttendance");
      setDisableTagReading(true);
      setLoadingMarkingAttendance(true);
      MarkSecondaryStudentAttedance(studentId)
        .then(({ responseData, responseStatus }) => {
          console.log(responseData);
          if (responseData.data) {
          } else {
            showToast(responseData.message);
          }
        })
        .catch((err) => {
          console.log(err, "mark secondary student");
        })
        .finally(() => {
          setStudentId(null);
          setLoadingMarkingAttendance(false);
          setDisableTagReading(false);
        });
    }
  }, [studentId]);

  if (!hasNfc) {
    return <NfcAttendanceTakingNotSupported />;
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Mark Attendance" customClassName="ml-5" />
      </View>
      <BodyRegular
        text="Tap your NFC identity card to mark attendance"
        type={TextFontType.Regular}
        customClassName="my-3 text-gray3"
      />

      <View className="justify-center">
        <View className="justify-center items-center">
          <SubheadingSemibold18 text="School Name" />
          <DescriptionText
            text={`${moment().format("dddd, Do MMM.")} (${moment().format(
              "hh:mma"
            )} - ${moment().add(2, "h").format("hh:mma")})`}
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
          {
            <>
              {loadingMarkingAttendance && <ActivityIndicator size={"large"} />}
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
          }
        </View>
        <View className="my-6">
          {/* <StudentAttendanceMarked
              name={currentStudentAttendance.name}
              matric_no={currentStudentAttendance.matric_no}
              level={currentStudentAttendance.level}
              course={currentStudentAttendance.course}
              id={currentStudentAttendance.id}
            /> */}
          {/* <HeadingsSemibold24 text="Thank you" customClassName="text-center" /> */}
          {/* <CustomButton
            title={`Done. Upload to server`}
            customClassName="my-5"
          /> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default SecondaryAttendanceTakingScreen;
