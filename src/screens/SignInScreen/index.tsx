import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import { PrimaryButton } from "@/src/components/UI/Buttons/PrimaryButton";
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
    <ScreenContainer>
      <View className="px-4 mb-4">
        <BackBtn />
      </View>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>

        <View className="my-6">
          <HeadingsSemibold24 text="Login to Virtuo App" />
          <TextMedium14
            text="Login with your email and password"
            customClassName="text-gray3 font-normal"
          />
          <View className="mt-10">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={(values, form) => {
                setLoading(true);
                setError("");
                Login(values)
                  .then(({ responseData, responseStatus }) => {
                    console.log(responseData, responseStatus, "login response");
                    if (responseStatus !== 201 && responseStatus !== 200) {
                      showToast(responseData.message || "Invalid credentials");
                    } else {
                      if (responseData.token) {
                        const user = responseData.user;
                        const accounts = user.accounts || [];

                        // Mobile app access: school admins (SCHOOL) and staff only
                        const staffAccount = accounts.find((acc: any) => acc.type === "STAFF");
                        const schoolAccount = accounts.find((acc: any) => acc.type === "SCHOOL");

                        if (!staffAccount && !schoolAccount) {
                          showToast(
                            "Only school admins and staff can use the mobile app."
                          );
                          setLoading(false);
                          return;
                        }

                        // Populate firstName and lastName for the UI if missing
                        if (!user.firstName || !user.lastName) {
                          if (staffAccount?.staff) {
                            user.firstName = staffAccount.staff.firstName || "";
                            user.lastName = staffAccount.staff.lastName || "";
                          } else if (schoolAccount?.school) {
                            user.firstName = schoolAccount.school.ownerName || schoolAccount.school.name || "School";
                            user.lastName = "Owner";
                          }
                        }

                        combinedStore.updateUserToken(responseData.token);
                        combinedStore.updateUser(user);
                        showToast("Log In Successful");
                        form.resetForm();
                      } else {
                        showToast("Login failed: No token received");
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err, err.message, "err");
                    showToast(err.message || "An error occurred during login");
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
                    <PrimaryButton
                      text="Login"
                      onPress={() => handleSubmit()}
                      isLoading={loading}
                      disabled={!!Object.values(errors).length}
                    />
                    {/* <Text className="text-center">
                    Don't have an account?{" "}
                    <Text onPress={() => navigation.navigate("SignUpScreen")}>
                      Signup
                    </Text>
                  </Text> */}
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default SignInScreen;
