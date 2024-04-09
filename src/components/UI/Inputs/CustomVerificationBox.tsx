import { COLORS } from "@/src/theme/colors";
import { Text, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

export const CustomVerificationBox = ({
  customClassName,
}: {
  customClassName?: string;
}) => {
  return (
    <View className={`mt-10 ${customClassName}`}>
      <OtpInput
        numberOfDigits={5}
        onTextChange={(text) => console.log(text)}
        theme={{
          containerStyle: {
            marginTop: 10,
          },
          pinCodeContainerStyle: {
            width: "18%",
          },
          focusedPinCodeContainerStyle: {
            borderColor: COLORS.textColor,
          },
        }}
      />

      <Text className="text-gray3 text-center mt-5">
        Didn't get a code?
        <Text className="text-textColor"> Resend</Text>
      </Text>
    </View>
  );
};
