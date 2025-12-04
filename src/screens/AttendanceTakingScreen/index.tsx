import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { StudentAttendanceMarked } from "@/src/components/UI/StudentOverviewCard";
import { showToast } from "@/src/components/UI/showToast";
import { IClassBase } from "@/src/contracts/course";
import { MarkAttendance } from "@/src/services/courses";
import {
  ModalProp,
  StackNavigationProps,
  StudentAttendance,
} from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import {
  HeadingsSemibold24,
  SubheadingSemibold18,
} from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import { TextFontType } from "@/src/theme/typography/typography";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";
import NfcAttendanceTakingNotSupported from "./NfcAttendanceTakingNotSupported";
import DeleteClassModal from "./components/DeleteClassModal";
import { CreateNewClass } from "@/src/services/class";
import { extractLastNumber } from "@/src/utils";

const AttendanceTakingScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const [hasNfc, setHasNFC] = useState(false);

  const [studentIds, setStudentIds] = useState<number[] | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  const [isExistingClass, setIsExistingClass] = useState(false);
  const [attendanceWasMarked, setAttendanceWasMarked] = useState(false);

  const [loadingCreateClass, setLoadingCreateClass] = useState(false);

  const [submitAttendanceloading, setSubmitAttendanceloading] = useState(false);

  // const [createdClass, setCreatedClass] = useState<IClassBase | null>(null);
  const [createdClass, setCreatedClass] = useState<IClassBase | null>({
    courseId: 1,
    createdAt: "2024-11-18T21:52:20.540Z",
    day: "Monday",
    endTime: "2024-11-18T23:52:17.748Z",
    id: 3,
    startTime: "2024-11-18T21:52:17.748Z",
    updatedAt: "2024-11-18T21:52:20.540Z",
  });

  const deleteModalRef = useRef<ModalProp>(null);

  useEffect(() => {
    if (route && route.params && route.params.courseId && hasNfc) {
      const routeParams = route.params;

      if (routeParams.courseId && routeParams.classId) {
        setIsExistingClass(true);
        setAttendanceWasMarked(true);
      } else if (routeParams.courseId) {
        handleCreateNewClass(route.params.courseId);
      }
    }
    // console.log(route, "route");
  }, [route, hasNfc]);

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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (createdClass && !attendanceWasMarked) {
          confirmNavigateBack();
          return true;
        } else {
          return false;
        }
      }
    );

    return () => backHandler.remove();
  }, [createdClass, attendanceWasMarked]);

  const confirmNavigateBack = useCallback(() => {
    if (createdClass && !attendanceWasMarked) {
      deleteModalRef.current?.setVisible(true);
    } else {
      navigation.goBack();
    }
  }, [createdClass, attendanceWasMarked]);

  const handleConfirmDeleteClass = () => {
    deleteModalRef.current?.setVisible(false);
    navigation.goBack();
  };

  const handleCreateNewClass = (courseId: number) => {
    const day = moment().format("dddd");
    const startTime = moment().toISOString();
    const endTime = moment().add(2, "h").toISOString();
    const input = { courseId, day, endTime, startTime };

    // console.log(input);

    setLoadingCreateClass(true);
    setTimeout(() => {
      showToast(`A class was created for you ${courseId}`);
      setLoadingCreateClass(false);
    }, 1000);

    // CreateNewClass(input)
    //   .then(({ responseData, responseStatus }) => {
    //     if (responseData.courseId) {
    //       setCreatedClass(responseData);
    //     } else {
    //       showToast("Something went wrong");
    //     }
    //     console.log(responseData, "CreateNewClass");
    //   })
    //   .catch((err) => console.log("err"))
    //   .finally(() => setLoadingCreateClass(false));
  };

  const readTag = async () => {
    await NfcManager.registerTagEvent();
  };

  const disableTagReading = async () => {
    await NfcManager.unregisterTagEvent();
  };

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, handleTagReading);
    // NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, [currentStudentId, studentIds]);

  const handleTagReading = useCallback(
    (tag: any) => {
      try {
        console.log(Ndef.uri.decodePayload(tag.ndefMessage[0].payload), "hi");

        const studentID = extractLastNumber(
          Ndef.uri.decodePayload(tag.ndefMessage[0].payload)
        );

        if (!studentID) return showToast("Invalid Student Card!");

        setCurrentStudentId(studentID);

        if (studentIds && studentIds.includes(studentID)) {
          showToast("User has been registered already!");
        } else {
          const a = [...(studentIds || []), studentID];

          setStudentIds(a);
          setCurrentStudentId(studentID);
          console.log(
            studentID,
            studentIds,
            "tag data in here",
            "studentAttendance"
          );
        }
        // console.log(
        //   Ndef.uri.decodePayload(tag.ndefMessage[0].payload),
        //   "tag found"
        // );
      } catch (error) {
        showToast("Invalid Tag!");
        console.log(error, "error");
      }
    },
    [studentIds, currentStudentId]
  );

  const handleSubmitAttendanceToServer = ({
    classId,
    studentId,
  }: {
    classId: number;
    studentId: number[];
  }) => {
    console.log({ classId, studentId: studentId[0] });

    setSubmitAttendanceloading(true);
    // setTimeout(() => {
    //   showToast(`Attendance Submitted`);
    //   setSubmitAttendanceloading(false);
    // }, 1000);

    // MarkAttendance({ classId, studentId: 4 })
    MarkAttendance({ classId, studentId: studentId[0] })
      .then(({ responseData, responseStatus }) => {
        console.log(
          responseData,
          responseStatus,
          "handleSubmitAttendanceToServe"
        );
        if (responseStatus === 201) {
          showToast("Successful!");
          setStudentIds(null);
          setAttendanceWasMarked(true);
        } else {
          showToast(responseData?.message || "Something went wrong!");
          // navigation.navigate("StudentAttendanceScreen", {
          //   students: studentAttendance,
          // });
        }
      })
      .catch((err) => {
        console.log(err, "handleSubmitAttendanceToServe");
      })
      .finally(() => {
        setSubmitAttendanceloading(false);
      });
  };

  if (!hasNfc) {
    return <NfcAttendanceTakingNotSupported onRetry={checkIsSupported} />;
  }

  if (loadingCreateClass) {
    return (
      <View className="flex-1 bg-white p-3 justify-center">
        <Text className="mb-3">Creating A Class for you, Please Wait...</Text>
        <LoadingComponent />
      </View>
    );
  }

  return createdClass ? (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center ">
          <BackBtn onPress={confirmNavigateBack} />
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
            text={`${moment(createdClass.startTime).format(
              "dddd, Do MMM."
            )} (${moment(createdClass.startTime).format("hha")} - ${moment(
              createdClass.endTime
            ).format("hha")})`}
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
          {!currentStudentId ? (
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
        {currentStudentId && studentIds ? (
          <View className="my-6">
            <StudentAttendanceMarked
              name={`Student #${currentStudentId}`}
              id={`${currentStudentId}`}
            />
            <HeadingsSemibold24
              text="Thank you"
              customClassName="text-center"
            />
            <CustomButton
              title={`Done. Upload to server (${studentIds.length})`}
              onPress={handleSubmitAttendanceToServer.bind(this, {
                classId: createdClass.id,
                studentId: studentIds,
              })}
              customClassName="my-5"
              loading={submitAttendanceloading}
            />
          </View>
        ) : null}
      </View>
      <DeleteClassModal
        deleteModalRef={deleteModalRef}
        handleConfirmBtnPress={handleConfirmDeleteClass}
      />
      <View className="h-24" />
    </ScrollView>
  ) : (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Something went wrong, No class created.</Text>
    </View>
  );
};

export default AttendanceTakingScreen;
