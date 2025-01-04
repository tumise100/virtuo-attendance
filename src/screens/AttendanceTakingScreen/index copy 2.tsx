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

const AttendanceTakingScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const [hasNfc, setHasNFC] = useState(false);

  const [studentAttendance, setStudentAttendance] = useState<
    StudentAttendance[] | null
  >(null);
  const [currentStudentAttendance, setCurrentStudentAttendance] =
    useState<StudentAttendance | null>(null);

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
      createNewClass(route.params.courseId);
    }
    // console.log(route, "route");
  }, [route, hasNfc]);

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      // const deviceIsSupported = false;

      console.log(deviceIsSupported, "deviceIsSupported");
      setHasNFC(deviceIsSupported);
      // if (deviceIsSupported) {
      //   await NfcManager.start();
      //   NfcManager.requestTechnology(NfcTech.Ndef);
      // }
      if (deviceIsSupported) {
        readTag();
      }
    };

    checkIsSupported();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (createdClass) {
          confirmNavigateBack();
          return true;
        } else {
          return false;
        }
      }
    );

    return () => backHandler.remove();
  }, [createdClass]);

  const confirmNavigateBack = () => {
    deleteModalRef.current?.setVisible(true);
  };

  const handleConfirmDeleteClass = () => {
    deleteModalRef.current?.setVisible(false);
    navigation.goBack();
  };

  const createNewClass = (courseId: number) => {
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
  }, [currentStudentAttendance, studentAttendance]);

  const handleTagReading = useCallback(
    (tag: any) => {
      try {
        const data = JSON.parse(
          Ndef.uri.decodePayload(tag.ndefMessage[0].payload)
        ) as StudentAttendance;

        setCurrentStudentAttendance(data);
        if (
          studentAttendance &&
          studentAttendance.find((sA) => sA.matric_no === data.matric_no)
        ) {
          showToast("User has been registered already!");
        } else {
          const a = [...(studentAttendance || []), data];

          setStudentAttendance(a);
          setCurrentStudentAttendance(data);
          console.log(
            data,
            studentAttendance,
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
    [studentAttendance, currentStudentAttendance]
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
    //   showToast(`Attendance Sumbitted`);
    //   setSubmitAttendanceloading(false);
    // }, 1000);

    // MarkAttencdance({ classId, studentId: studentId[0] })
    MarkAttendance({ classId, studentId: 4 })
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, "handleSubmitAttendanceToServer");
        if (!responseData.success) {
          showToast(responseData?.message);
        } else {
          console.log(responseData, "handleSubmitAttendanceToServer");
          // navigation.navigate("StudentAttendanceScreen", {
          //   students: studentAttendance,
          // });
        }
      })
      .catch((err) => {
        console.log(err, "handleSubmitAttendanceToServer");
      })
      .finally(() => {
        setSubmitAttendanceloading(false);
      });
  };

  if (!hasNfc) {
    return <NfcAttendanceTakingNotSupported />;
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
        <Text>{JSON.stringify(currentStudentAttendance)}</Text>
        {currentStudentAttendance && studentAttendance ? (
          <View className="my-6">
            <StudentAttendanceMarked
              name={currentStudentAttendance.name}
              matric_no={currentStudentAttendance.matric_no}
              level={currentStudentAttendance.level}
              course={currentStudentAttendance.course}
              id={currentStudentAttendance.id}
            />
            <HeadingsSemibold24
              text="Thank you"
              customClassName="text-center"
            />
            <CustomButton
              title={`Done. Upload to server (${studentAttendance.length})`}
              onPress={handleSubmitAttendanceToServer.bind(this, {
                classId: createdClass.id,
                studentId: studentAttendance.map((sA) => +sA.id),
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
