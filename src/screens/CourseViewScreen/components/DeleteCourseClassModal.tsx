import { View, Text, Dimensions, Image } from "react-native";
import React from "react";
import Modal from "@/src/components/UI/Modal";
import { ModalProp } from "@/src/shared";
import NoDataImg from "@/assets/images/NoDataImg.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import { COLORS } from "@/src/theme/colors";

const DeleteCourseClassModal = ({
  deleteClassModalRef,
  handleConfirmBtnPress,
  onCancel,
  deletingCourseClass,
}: {
  deleteClassModalRef: React.RefObject<ModalProp>;
  handleConfirmBtnPress?: () => void;
  onCancel?: () => void;
  deletingCourseClass: boolean;
}) => {
  return (
    <Modal
      ref={deleteClassModalRef}
      onCancel={onCancel}
      // customStyle={{ height: Dimensions.get("screen").height * 0.4 }}
    >
      <View className="p-7">
        <View className="items-center">
          <View className="w-[100px] h-[100px] mt-2 mb-5">
            <Image source={NoDataImg} className="h-full w-full" />
          </View>
          <Text className="font-medium text-gray3 text-center mb-5">
            Are you sure you want to delete this class?
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <CustomButton
            title="No"
            disabled={deletingCourseClass}
            onPress={() => deleteClassModalRef.current?.setVisible(false)}
            containerClassName="w-[45%]"
          />
          <CustomButton
            loading={deletingCourseClass}
            title="Yes"
            onPress={handleConfirmBtnPress}
            outline
            containerClassName="w-[45%]"
            loadingColor={COLORS.primary[500]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DeleteCourseClassModal;
