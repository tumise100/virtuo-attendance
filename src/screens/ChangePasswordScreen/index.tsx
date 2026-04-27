import { View, Text } from "react-native";
import React, { useState } from "react";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { Formik } from "formik";
import CustomPaperTextInput from "@/src/components/UI/Inputs/CustomPaperTextInput";
import { PrimaryButton } from "@/src/components/UI/Buttons/PrimaryButton";
import { ChangePassword } from "@/src/services/auth";
import { showToast } from "@/src/components/UI/showToast";
import { StackNavigationProps } from "@/src/shared";

const ChangePasswordScreen = ({ navigation, route }: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <ScreenContainer>
      <View className="flex-row items-center px-4 mb-6">
        <BackBtn />
        <SubheadingSemibold18 text="Change Password" customClassName="ml-5 text-gray-900" />
      </View>

      <View className="mt-4 flex-1 px-4">


        <View className="mt-10 flex-1">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            onSubmit={(values, form) => {
              setLoading(true);
              ChangePassword({
                newPassword: values.newPassword,
                currentPassword: values.oldPassword,
              })
                .then(({ responseData, responseStatus }) => {
                  if (responseData.success || responseStatus == 200) {
                    showToast(responseData.message);
                    form.resetForm();
                    navigation.navigate("HomeScreen");
                  } else {
                    showToast(responseData.message);
                  }
                })
                .catch((err) => {
                  console.log(err, "change password");
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            validate={(values) => {
              const errors: {
                oldPassword?: string;
                newPassword?: string;
                confirmNewPassword?: string;
              } = {};
              if (!values.oldPassword.trim().length) {
                errors.oldPassword = "Old Password is required";
              }
              if (values.oldPassword.trim() === values.newPassword.trim()) {
                errors.oldPassword = "Old Password should not match New password";
              }

              if (values.oldPassword.trim().length <= 5) {
                errors.oldPassword =
                  "Old Password should at least be 6 characters";
              }

              if (!values.newPassword.trim().length) {
                errors.newPassword = "Password is required";
              }
              if (values.newPassword.trim().length <= 5) {
                errors.newPassword = "Password should at least be 6 characters";
              }
              if (
                values.newPassword.trim() !== values.confirmNewPassword.trim()
              ) {
                errors.confirmNewPassword = "Passwords should match";
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
                  label="Old Password"
                  onChangeText={handleChange("oldPassword")}
                  onBlur={handleBlur("oldPassword")}
                  value={values.oldPassword}
                  error={errors.oldPassword}
                />
                <CustomPaperTextInput
                  label="New Password"
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  error={errors.newPassword}
                />
                <CustomPaperTextInput
                  label="Repeat Password"
                  onChangeText={handleChange("confirmNewPassword")}
                  onBlur={handleBlur("confirmNewPassword")}
                  value={values.confirmNewPassword}
                  error={
                    errors.confirmNewPassword
                    //   touched.confirmNewPassword
                    //     ? errors.confirmNewPassword
                    //     : undefined
                  }
                />
                <View className="mt-20">
                  <PrimaryButton
                    text="Apply"
                    onPress={() => handleSubmit()}
                    isLoading={loading}
                    disabled={!!Object.values(errors).length}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default ChangePasswordScreen;
