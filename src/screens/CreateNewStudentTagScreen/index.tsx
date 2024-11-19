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

const CreateNewStudentTagScreen = () => {
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
          text="Create New Student Tag"
          customClassName="ml-5"
        />
      </View>
      <View className="mt-10">
        <Formik
          initialValues={{
            // name: "",
            // matric_no: "",
            // course: "",
            // level: "",
            // id: "",

            name: "Odebisi Idowu Solomon Soji",
            matric_no: "Sci/18/19/0623",
            course: "Computer Science",
            level: "400",
            id: "10",
          }}
          onSubmit={async (values) => {
            let result = false;
            setReadyToWrite(true);

            // const data = {
            //   name: "Odebisi Idowu Solomon Soji",
            //   matric_no: "Sci/18/19/0623",
            //   course: "Computer Science",
            //   level: "400",
            //   id: "",
            // };

            try {
              await NfcManager.requestTechnology(NfcTech.Ndef);

              const bytes = Ndef.encodeMessage([
                Ndef.uriRecord(`${JSON.stringify(values)}`),
              ]);

              if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                result = true;
                showToast("Student Tag Created!");
              }
            } catch (ex) {
              console.warn(JSON.stringify(ex));
            } finally {
              setReadyToWrite(false);
              NfcManager.cancelTechnologyRequest();
            }

            return result;
          }}
          validate={(values) => {
            const errors: {
              name?: string;
              matric_no?: string;
              course?: string;
              level?: string;
              id?: string;
            } = {};
            if (!values.name.trim().length) {
              errors.name = "Full Name is required";
            }
            if (!values.matric_no.trim().length) {
              errors.matric_no = "Matric No is required";
            }
            if (!values.course.trim().length) {
              errors.course = "Student Course is Required";
            }
            if (!values.level.trim().length) {
              errors.level = "Level is Required";
            }
            if (!values.id.trim().length) {
              errors.id = "Level is Required";
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
                label="Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="Odebisi Idowu Solomon Soji"
                error={touched.name ? errors.name : undefined}
              />
              <CustomPaperTextInput
                label="Matric_no"
                onChangeText={handleChange("matric_no")}
                onBlur={handleBlur("matric_no")}
                value={values.matric_no}
                placeholder="Sci/18/19/0623"
                error={touched.matric_no ? errors.matric_no : undefined}
              />
              <CustomPaperTextInput
                label="Course"
                onChangeText={handleChange("course")}
                onBlur={handleBlur("course")}
                value={values.course}
                placeholder="Computer Science"
                error={touched.course ? errors.course : undefined}
              />
              <CustomPaperTextInput
                label="Level"
                onChangeText={handleChange("level")}
                onBlur={handleBlur("level")}
                value={values.level}
                placeholder="400"
                error={touched.level ? errors.level : undefined}
              />
              <CustomPaperTextInput
                label="Student ID"
                onChangeText={handleChange("id")}
                onBlur={handleBlur("id")}
                value={values.id}
                placeholder="10"
                error={touched.id ? errors.id : undefined}
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

export default CreateNewStudentTagScreen;
