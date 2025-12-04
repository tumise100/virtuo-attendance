import { View, Text, ScrollView, StatusBar } from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Formik } from "formik";
import CustomPaperTextInput from "@/src/components/UI/Inputs/CustomPaperTextInput";
import { CustomButton } from "@/src/components/UI/Buttons";
import { showToast } from "@/src/components/UI/showToast";
import NfcManager, { Ndef, NfcEvents, NfcTech } from "react-native-nfc-manager";
import { RegisterStudentCard } from "@/src/services/student";

const WriteStudentInfoTagScreen = () => {
  const [readyToWrite, setReadyToWrite] = useState(false);

  return (
    <ScrollView className="flex-1 px-4 pt-7 bg-white">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18
          text="Write Student Info Into Tag"
          customClassName="ml-5"
        />
      </View>
      <View className="mt-10">
        <Formik
          initialValues={{
            url: "https://v1.virtuobusiness.com/access",
            email: "",
            student_id: "",
          }}
          onSubmit={async (values) => {
            let result = false;
            setReadyToWrite(true);

            const userLink = `${values.url}/${values.student_id}`;

            try {
              await NfcManager.requestTechnology(NfcTech.Ndef);

              const tag = await NfcManager.getTag();
              const cardUid = tag?.id;

              if (!cardUid) {
                showToast("Unable to read card UID. Please try again.");
                return result;
              }

              const registrationResponse = await RegisterStudentCard({
                email: values.email,
                cardUID: cardUid,
              });

              if (registrationResponse.responseStatus >= 400) {
                showToast(
                  registrationResponse.responseData?.message ||
                    "Failed to register card UID."
                );
                return result;
              }

              const bytes = Ndef.encodeMessage([
                // Ndef.uriRecord(`${JSON.stringify(values)}`),
                Ndef.uriRecord(`${userLink}`),
              ]);

              if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                result = true;
                showToast("Student Tag Created!");
              }
            } catch (ex) {
              console.warn(JSON.stringify(ex));
              showToast("Failed to create student tag. Please try again.");
            } finally {
              setReadyToWrite(false);
              await NfcManager.cancelTechnologyRequest();
            }

            return result;
          }}
          validate={(values) => {
            const errors: {
              url?: string;
              email?: string;
              student_id?: string;
            } = {};
            if (!values.url.trim().length) {
              errors.url = "Website Url required";
            }
            if (!values.email.trim().length) {
              errors.email = "Student email is required";
            }
            if (!values.student_id.trim().length) {
              errors.student_id = "Student ID is required";
            }

            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <CustomPaperTextInput
                label="Website Url"
                onChangeText={handleChange("url")}
                onBlur={handleBlur("url")}
                value={values.url}
                placeholder="https://v1.https://v1.virtuobusiness.com"
                error={touched.url ? errors.url : undefined}
              />
              <CustomPaperTextInput
                label="Student Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="student@example.com"
                error={touched.email ? errors.email : undefined}
              />
              <CustomPaperTextInput
                label="Student ID"
                onChangeText={handleChange("student_id")}
                onBlur={handleBlur("student_id")}
                value={values.student_id}
                placeholder="Sci/18/19/0623"
                error={touched.student_id ? errors.student_id : undefined}
              />
              <View className="mt-20">
                <CustomButton
                  title={`${
                    readyToWrite
                      ? "Place tag close to your phone"
                      : "Write/Create Student Tag"
                  }`}
                  loadingWithText={readyToWrite}
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default WriteStudentInfoTagScreen;
