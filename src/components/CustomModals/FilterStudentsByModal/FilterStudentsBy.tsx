import { View, Text } from "react-native";
import React, { useContext } from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import {
  FilterContentMoreItem,
  FilterContentRadioItem,
} from "@/src/components/UI/FilterContentItem/FilterContentItem";
import { AttendanceStatusType, ModalProp } from "@/src/shared";
import Modal from "../../UI/Modal";
import { FilterModalContext } from "@/src/contexts/modals.context";

const FilterStudentsByModal = () => {
  const {
    filterStudentsByLevelModalRef,
    filterStudentsByModalRef,
    filterStudentsByPercentageModalRef,
  } = useContext(FilterModalContext);

  return (
    <Modal
      ref={filterStudentsByModalRef}
      onCancel={() => filterStudentsByModalRef.current?.setVisible(false)}
    >
      <FilterStudentsBy
        onPercentagePress={() => {
          filterStudentsByPercentageModalRef.current?.setVisible(true);
          filterStudentsByModalRef.current?.setVisible(false);
        }}
        onLevelPress={() => {
          filterStudentsByLevelModalRef.current?.setVisible(true);
          filterStudentsByModalRef.current?.setVisible(false);
        }}
      />
    </Modal>
  );
};

const FilterStudentsBy = ({
  onPercentagePress,
  onLevelPress,
  onDepartmentPress,
  onCoursesPress,
}: {
  onPercentagePress?: () => void;
  onLevelPress?: () => void;
  onDepartmentPress?: () => void;
  onCoursesPress?: () => void;
}) => {
  return (
    <View className="p-4">
      <BodyText text="Filter Students by" type={TextFontType.Medium} />
      <View>
        <FilterContentRadioItem attendanceType={AttendanceStatusType.PRESENT} />
        <FilterContentRadioItem attendanceType={AttendanceStatusType.ABSENT} />
        <FilterContentMoreItem label="Percentage" onPress={onPercentagePress} />
        <FilterContentMoreItem label="Level" onPress={onLevelPress} />
        <FilterContentMoreItem label="Department" />
        <FilterContentMoreItem label="Courses" />
      </View>
    </View>
  );
};

export default FilterStudentsByModal;
