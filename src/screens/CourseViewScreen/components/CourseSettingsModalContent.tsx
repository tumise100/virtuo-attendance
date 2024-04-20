import { View, Text } from "react-native";
import React from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import CustomDropdown from "@/src/components/UI/Dropdown";
import { CustomButton } from "@/src/components/UI/Buttons";
import { DropdownData, ModalProp } from "@/src/shared";

const holdingDayData: DropdownData[] = [
  { id: "1", name: "Monday" },
  { id: "2", name: "Tuesday" },
  { id: "3", name: "Wednesday" },
  { id: "4", name: "Thursday" },
  { id: "5", name: "Friday" },
];

const holdingTimeData: DropdownData[] = [
  { id: "1", name: "8AM - 10AM" },
  { id: "2", name: "10AM - 11AM" },
  { id: "3", name: "11AM - 12AM" },
  { id: "4", name: "12PM - 2PM" },
  { id: "5", name: "2PM - 4PM" },
];

const CourseSettingsModalContent = ({
  modalRef,
}: {
  modalRef: React.RefObject<ModalProp>;
}) => {
  return (
    <View className="px-4 py-6">
      <BodyText text="Course Settings" type={TextFontType.Medium} />
      <View>
        <CustomDropdown placeholder="Holding day" data={holdingDayData} />
        <CustomDropdown placeholder="Holding time" data={holdingTimeData} />
        <CustomButton
          title="Save"
          onPress={() => modalRef.current?.setVisible(false)}
        />
      </View>
    </View>
  );
};

export default CourseSettingsModalContent;
