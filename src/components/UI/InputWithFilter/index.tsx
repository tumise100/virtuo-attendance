import { TouchableOpacity, View } from "react-native";
import React from "react";
import CustomPaperTextInputWithIcons from "../Inputs/CustomPaperTextInputWithIcons";
import { TextInput } from "react-native-paper";
import { COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { ModalProp } from "@/src/shared";

const InputWithFilter = ({
  placeHolder,
  filterModalRef,
  value,
  onChangeText,
}: {
  placeHolder?: string;
  filterModalRef?: React.RefObject<ModalProp | null>;
  value?: string;
  onChangeText?: (text: string) => void;
}) => {
  return (
    <View className="my-5 flex-row items-center">
      <CustomPaperTextInputWithIcons
        outerStyle={`bg-white border border-borderColor ${filterModalRef ? 'flex-[.9]' : 'flex-1'}`}
        innerStyle="bg-white text-sm text-black"
        inputStyle={{ height: 50 }}
        containerStyle={{ height: 48 }}
        rightComponent={
          <TextInput.Icon
            icon={() => (
              <Ionicons name="search-outline" color={COLORS.black} size={22} />
            )}
          />
        }
        placeholder={placeHolder || "Search for student"}
        value={value}
        onChangeText={onChangeText}
      />
      {filterModalRef && (
        <TouchableOpacity
          onPress={() => filterModalRef?.current?.setVisible(true)}
          className="flex-[.1] ml-3 border border-borderColor self-stretch px-2 items-center justify-center rounded-md"
        >
          <Ionicons name="filter-outline" size={26} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputWithFilter;
