import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useState } from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import {
  HeadingsSemibold24,
  InputAssistive,
  TextMedium14,
} from "@/src/theme/typography";
import CustomPaperTextInput from "@/src/components/UI/Inputs/CustomPaperTextInput";
import { CustomButton } from "@/src/components/UI/Buttons";
import { COLORS } from "@/src/theme/colors";
import { StackNavigationProps } from "@/src/shared";
import { Formik } from "formik";
import { Login } from "@/src/services/auth";
import { showToast } from "@/src/components/UI/showToast";
import { combineStore } from "@/src/store";

const SignInScreen = ({ navigation }: StackNavigationProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const combinedStore = combineStore();

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <BackBtn />
      <View className="my-6">
        <HeadingsSemibold24 text="Login to Virtuo Attendance" />
        <TextMedium14
          text="Login with your email and password"
          customClassName="text-gray3 font-normal"
        />
        <View className="mt-10">
          <Formik
            initialValues={{
              // email: "james.doe@example.com",
              // email: "samuel.williams@example.com",
              email: "access4019@gmail.com",
              password: "password",
              // email: "",
              // password: "",
            }}
            onSubmit={(values, form) => {
              // if (1) {
              //   navigation.navigate("BaseNavigator");
              // }

              // return;

              setLoading(true);
              setError("");
              Login(values)
                .then(({ responseData, responseStatus }) => {
                  console.log(responseData, responseStatus, "ee");
                  if (responseStatus !== 201) {
                    // console.log(responseData, "responseData");
                    showToast(responseData.message);
                  } else {
                    if (responseData.accessToken) {
                      // console.log(responseData, "some data");
                      combinedStore.updateUserToken(responseData.accessToken);
                      showToast("Log In Successful");
                      form.resetForm();
                      navigation.navigate("BaseNavigator");
                    }
                  }
                })
                .catch((err) => {
                  showToast("Wrong Credentials!");
                  console.log(err, "err");
                })
                .finally(() => setLoading(false));
            }}
            validate={(values) => {
              const errors: {
                email?: string;
                password?: string;
              } = {};
              if (!values.email.trim().length) {
                errors.email = "Email is required";
              }
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password.trim().length) {
                errors.password = "Password is required";
              } else if (values.password.trim().length <= 5) {
                errors.password = "Password should at least be 6 characters";
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
                  label="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  error={touched.email ? errors.email : undefined}
                />
                <CustomPaperTextInput
                  label="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  error={touched.password ? errors.password : undefined}
                />
                <InputAssistive
                  text="Forgot Password?"
                  customClassName="p-0 text-right"
                />
                <View className="mt-20">
                  <CustomButton
                    title="Login"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!!Object.values(errors).length}
                  />
                  <Text className="text-center">
                    Don't have an account?{" "}
                    <Text onPress={() => navigation.navigate("SignUpScreen")}>
                      Signup
                    </Text>
                  </Text>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInScreen;
