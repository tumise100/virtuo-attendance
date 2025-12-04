import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { showToast } from "@/src/components/UI/showToast";
import {
  MarkSecondaryStudentAttedance,
  MarkSecondaryTeacherAttedance,
} from "@/src/services/attendance";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import { TextFontType } from "@/src/theme/typography/typography";
import { extractStudentId } from "@/src/utils";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import NfcManager, { Ndef, NfcEvents } from "react-native-nfc-manager";
import NfcAttendanceTakingNotSupported from "../AttendanceTakingScreen/NfcAttendanceTakingNotSupported";
import { StudentAttendanceMarked } from "@/src/components/UI/StudentOverviewCard";

const AttendanceTakingForInstructorScreen = () => {
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);
  const [userJustMarkedInfo, setUserJustMarkedInfo] = useState<any>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const [disableTagReading, setDisableTagReading] = useState(false);

  const [hasNfc, setHasNFC] = useState(false);

  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";
  const isSchool = user?.accounts[0].school?.accountId;

  const checkIsSupported = useCallback(async () => {
    const deviceIsSupported = await NfcManager.isSupported();

    if (!deviceIsSupported) {
      setHasNFC(false);
      return;
    }

    await NfcManager.start();
    const nfcEnabled = await NfcManager.isEnabled();

    if (!nfcEnabled) {
      showToast("Please enable NFC in your device settings to continue");
      NfcManager.goToNfcSetting?.();
    }

    setHasNFC(nfcEnabled);

    if (nfcEnabled) {
      readTag();
    }
  }, []);

  useEffect(() => {
    checkIsSupported();
  }, [checkIsSupported]);

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

  useEffect(() => {
    handleMarkSecondaryAttendance();
  }, [userId]);

  const handleTagReading = (tag: any) => {
    console.log(
      Ndef.uri.decodePayload(tag.ndefMessage[0].payload),
      "handleTagReading"
    );

    try {
      const payload = tag.ndefMessage[0].payload;
      const decodedPayload = Ndef.uri.decodePayload(payload);

      if (!decodedPayload) return null;

      const userId = extractStudentId(decodedPayload);

      console.log(userId, "userId");

      if (!userId) {
        throw new Error("Bad ID");
      }

      setUserId(`${userId}`);

      console.log(decodedPayload, userId, "decoded");
    } catch (error) {
      showToast("Invalid Tag!");
      console.log(error, "error");
    }
  };

  const handleMarkSecondaryAttendance = useCallback(() => {
    if (userId) {
      console.log(userId, "handleMarkSecondaryAttendance");
      setDisableTagReading(true);
      setLoadingMarkingAttendance(true);
      setUserJustMarkedInfo(null);

      //   (isSchool
      //     ? MarkSecondaryTeacherAttedance(userId)
      //     : MarkSecondaryStudentAttedance(userId)
      // )
      MarkSecondaryTeacherAttedance(userId)
        .then(({ responseData, responseStatus }) => {
          console.log(responseData);
          if (responseData.accountId) {
            showToast("Attendance marked");
            // setUserJustMarkedInfo({ name: "JohnSon" });
          } else if (!responseData.success) {
            showToast(responseData.message);
          }
        })
        .catch((err) => {
          console.log(err, "mark instructor student");
        })
        .finally(() => {
          setUserId(null);
          setLoadingMarkingAttendance(false);
          setDisableTagReading(false);
          // setUserJustMarkedInfo(null);
        });
    }
  }, [userId]);

  if (!hasNfc) {
    return <NfcAttendanceTakingNotSupported onRetry={checkIsSupported} />;
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
          <SubheadingSemibold18
            text={
              isSchool
                ? user.accounts[0].school?.name || "School name"
                : "School Name"
            }
            customClassName="text-center text-base"
          />
          <DescriptionText
            text={`${moment().format("dddd, Do MMM.")} (${moment().format(
              "hh:mma"
            )} - ${moment().add(2, "h").format("hh:mma")})`}
            type={TextFontType.Medium}
            customClassName="my-2 text-sm"
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
          {userJustMarkedInfo && (
            <StudentAttendanceMarked
              name={userJustMarkedInfo.name}
              matric_no={"Sci/12/23"}
            />
          )}
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

export default AttendanceTakingForInstructorScreen;
