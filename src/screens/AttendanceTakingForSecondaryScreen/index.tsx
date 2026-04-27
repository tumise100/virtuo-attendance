import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { CustomButton } from "../../components/UI/Buttons";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import { TextFontType } from "@/src/theme/typography/typography";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { StackNavigationProps } from "@/src/shared";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import {
  MarkSecondaryStudentAttedance,
  MarkSecondaryTeacherAttedance,
} from "@/src/services/attendance";
import { GetMyStudents } from "@/src/services/student";
import { GetStaff } from "@/src/services/teacher";
import { showToast } from "@/src/components/UI/showToast";

type ScreenState = 'SCANNING' | 'SUCCESS' | 'ERROR';

import { extractDataFromTag } from "@/src/utils/nfc";


const AttendanceTakingForSecondaryScreen = ({ navigation }: StackNavigationProps) => {
  const [screenState, setScreenState] = useState<ScreenState>('SCANNING');
  // scannedStudent holds either the matched student or staff record, along
  // with an added `entity: 'STUDENT' | 'STAFF'` marker so the success card
  // can render the right copy (Welcome/Goodbye + role subtitle).
  const [scannedStudent, setScannedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    startNfcDiscovery();
    return () => {
      isMounted.current = false;
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    };
  }, []);

  const startNfcDiscovery = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      
      if (tag && isMounted.current) {
        handleTagScanned(extractDataFromTag(tag));
      }
    } catch (ex: any) {
      if (ex !== 'user cancel') {
        console.warn("NFC Error:", ex);
        showToast("NFC scanning failed. Please try again.");
      }
    } finally {
      if (isMounted.current) {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
      }
    }
  };

  const handleTagScanned = async (nfcCode: string) => {
    if (!nfcCode) return;

    setLoading(true);
    try {
      // 1) Try STUDENT first. The backend stores 8-char hex on student.nfcCode
      //    (students) and staff.linkId (staff). If the card belongs to a
      //    student we get a record back; if not, we fall through to staff.
      const studentRes = await MarkSecondaryStudentAttedance(undefined, {
        nfcCode,
        status: "PRESENT",
      });
      const studentResult = Array.isArray(studentRes?.responseData)
        ? studentRes.responseData[0]
        : studentRes?.responseData;
      const studentMatched =
        studentRes?.responseStatus === 201 || studentRes?.responseStatus === 200;
      const studentNotFound =
        !studentMatched ||
        (studentResult?.error &&
          /not found|No Student ID|card ID/i.test(String(studentResult.error)));

      if (studentMatched && !studentResult?.error) {
        const studentObj =
          studentResult?.student ||
          studentResult?.record?.student ||
          studentResult?.data?.student ||
          null;

        if (studentObj) {
          const fullName = [studentObj.firstName, studentObj.middleName, studentObj.lastName]
            .filter(Boolean)
            .join(" ");
          setScannedStudent({ ...studentObj, entity: "STUDENT", fullName: fullName || "Student" });
          setScreenState('SUCCESS');
          return;
        }

        // Safety net: request went through but no student payload came
        // back — look them up so we never fall back to displaying the hex.
        try {
          const lookup = await GetMyStudents({ page: 1, limit: 1, nfcCode });
          const fetched = lookup?.responseData?.data?.[0];
          if (fetched) {
            const fullName = [fetched.firstName, fetched.middleName, fetched.lastName]
              .filter(Boolean)
              .join(" ");
            setScannedStudent({ ...fetched, entity: "STUDENT", fullName: fullName || "Student" });
            setScreenState('SUCCESS');
            return;
          }
        } catch (err) {
          console.warn("NFC student lookup fallback failed", err);
        }
      }

      // 2) Not a student card — try STAFF. Backend matches staff.linkId to
      //    the card hex and responds with the staff record or a not-found
      //    error just like the student path.
      if (studentNotFound) {
        const staffRes = await MarkSecondaryTeacherAttedance(undefined, {
          linkId: nfcCode,
          status: "PRESENT",
        });
        const staffResult = Array.isArray(staffRes?.responseData)
          ? staffRes.responseData[0]
          : staffRes?.responseData;

        if ((staffRes?.responseStatus === 201 || staffRes?.responseStatus === 200) && !staffResult?.error) {
          const staffObj =
            staffResult?.staff ||
            staffResult?.record?.staff ||
            staffResult?.data?.staff ||
            null;

          if (staffObj) {
            const fullName = [staffObj.firstName, staffObj.middleName, staffObj.lastName]
              .filter(Boolean)
              .join(" ");
            setScannedStudent({ ...staffObj, entity: "STAFF", fullName: fullName || "Staff" });
            setScreenState('SUCCESS');
            return;
          }

          // Same safety net as students — look up staff by linkId so the
          // success screen always shows a real name.
          try {
            const lookup = await GetStaff({ page: 1, limit: 1, search: nfcCode });
            const fetched = lookup?.responseData?.data?.find(
              (s: any) => String(s?.linkId || "").toUpperCase() === nfcCode.toUpperCase(),
            ) || lookup?.responseData?.data?.[0];
            if (fetched) {
              const fullName = [fetched.firstName, fetched.middleName, fetched.lastName]
                .filter(Boolean)
                .join(" ");
              setScannedStudent({ ...fetched, entity: "STAFF", fullName: fullName || "Staff" });
              setScreenState('SUCCESS');
              return;
            }
          } catch (err) {
            console.warn("NFC staff lookup fallback failed", err);
          }
        }

        const errorMsg =
          staffResult?.error ||
          staffRes?.responseData?.message ||
          studentResult?.error ||
          "No student or staff record matches this card";
        showToast(errorMsg);
        setScreenState('SCANNING');
        startNfcDiscovery();
        return;
      }

      // Student endpoint returned an error that wasn't "not found" — surface
      // it instead of silently retrying as staff.
      showToast(studentResult?.error || studentRes?.responseData?.message || "Attendance marking failed");
      setScreenState('SCANNING');
      startNfcDiscovery();
      return;
    } catch (error) {
      console.error("Attendance Error:", error);
      showToast("An error occurred. Please try again.");
      startNfcDiscovery();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-7 mb-4">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      {/* Header */}
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Mark Attendance" customClassName="ml-5 text-gray-900" />
      </View>

      <BodyRegular
        text="Tap your NFC identity card to mark attendance"
        type={TextFontType.Regular}
        customClassName="my-3 text-gray3"
      />

      {/* Event Info Card */}
      <View className="bg-white border border-gray-100 rounded-2xl p-4 my-2 flex-row items-center shadow-sm">
        <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3">
          <Ionicons name="trophy" size={18} color="#F59E0B" />
        </View>
        <View>
          <Text className="text-base font-bold text-gray-900">{moment().format('dddd, Do MMMM, YYYY')}</Text>
          <Text className="text-sm text-gray-500">{moment().hours() >= 12 ? 'Afternoon' : 'Morning'} Attendance</Text>
        </View>
      </View>

      <View className="flex-1 justify-center items-center">
        {/* Phone Illustration */}
        <View className="w-[208px] h-[287px] my-4">
          <Image
            source={PhoneWithCardImg}
            resizeMode="contain"
            className="h-full w-full"
          />
        </View>

        {screenState === 'SCANNING' && (
          <>
            <H5Text
              text={loading ? "Verifying Card..." : "Hold your card against back of your phone"}
              type={TextFontType.Bold}
              customClassName="w-[85%] text-center text-gray-900"
            />
            {loading ? (
              <ActivityIndicator color="#F97316" size="large" className="mt-4" />
            ) : (
              <BodyRegular
                text="Hold your NFC card against the back of your phone, near the NFC chip location. Ensure that the NFC card's chip aligns with your phone's NFC area to establish a connection."
                type={TextFontType.Regular}
                customClassName="text-gray3 w-[99%] text-center mt-4"
              />
            )}
          </>
        )}
      </View>

      {/* Success Bottom Sheet */}
      {screenState === 'SUCCESS' && scannedStudent && (
        <View className="mt-auto">
          <View className="flex-row items-center justify-between border border-gray-200 rounded-2xl p-3 mb-4 bg-white shadow-sm">
            <View className="flex-row items-center flex-1">
              <CustomAvatar 
                name={scannedStudent.fullName} 
                size={40} 
              />
              <View className="ml-3">
                <Text className="text-base font-bold text-gray-900">{scannedStudent.fullName}</Text>
                <Text className="text-xs text-gray-400">
                  {scannedStudent.entity === 'STAFF'
                    ? moment().format('h:mm A')
                    : `${scannedStudent.currentClass?.name || 'Student'} • ${moment().format('h:mm A')}`}
                </Text>
              </View>
            </View>
            <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
          </View>

          {moment().hours() >= 12 ? (
            <View className="bg-orange-50 self-center px-4 py-2 rounded-full mb-6">
              <Text className="text-orange-600 font-bold">Goodbye {scannedStudent.fullName}</Text>
            </View>
          ) : (
            <View className="bg-green-50 self-center px-4 py-2 rounded-full mb-6">
              <Text className="text-green-600 font-bold">
                Welcome {scannedStudent.entity === 'STAFF' ? scannedStudent.fullName : 'to School'}
              </Text>
            </View>
          )}

          <CustomButton
            title="Scan Another"
            onPress={() => {
              setScreenState('SCANNING');
              setScannedStudent(null);
              startNfcDiscovery();
            }}
          />
        </View>
      )}
    </View>
  );
};

export default AttendanceTakingForSecondaryScreen;
