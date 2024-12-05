import { View, Text } from "react-native";
import React, { useContext } from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import {
  FilterContentCheckboxItem,
  FilterContentMoreItem,
  FilterContentRadioItem,
} from "@/src/components/UI/FilterContentItem/FilterContentItem";
import { AttendanceStatusType, ModalProp } from "@/src/shared";
import Modal from "../../UI/Modal";
import { FilterModalContext } from "@/src/contexts/modals.context";

const FilterStudentsByPercentageModal = () => {
  const { filterStudentsByPercentageModalRef } = useContext(FilterModalContext);

  return (
    <Modal
      ref={filterStudentsByPercentageModalRef}
      onCancel={() => {
        filterStudentsByPercentageModalRef.current?.setVisible(false);
      }}
    >
      <FilterStudentsByPercentage />
    </Modal>
  );
};

const FilterStudentsByPercentage = () => {
  return (
    <View className="p-4">
      <BodyText
        text="Filter Students by Percentage"
        type={TextFontType.Medium}
      />
      <View>
        <FilterContentCheckboxItem
          title="> 70%"
          attendanceType={AttendanceStatusType.PRESENT}
        />
        <FilterContentCheckboxItem
          title="< 70%"
          attendanceType={AttendanceStatusType.ABSENT}
        />
      </View>
    </View>
  );
};

export default FilterStudentsByPercentageModal;
