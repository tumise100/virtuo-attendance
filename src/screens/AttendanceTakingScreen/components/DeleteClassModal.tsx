import NoDataImg from "@/assets/images/NoDataImg.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import Modal from "@/src/components/UI/Modal";
import { ModalProp } from "@/src/shared";
import React from "react";
import { Image, Text, View } from "react-native";

const DeleteClassModal = ({
  deleteModalRef,
}: {
  deleteModalRef: React.RefObject<ModalProp>;
}) => {
  return (
    <Modal ref={deleteModalRef}>
      <View className="p-7">
        <View className="items-center">
          <View className="w-[100px] h-[100px] mt-2 mb-5">
            <Image source={NoDataImg} className="h-full w-full" />
          </View>
          <Text className="font-medium text-gray3 text-center mb-5">
            No attendance was marked, are you sure you want to delete this
            class?
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <CustomButton
            title="No"
            onPress={() => deleteModalRef.current?.setVisible(false)}
            containerClassName="w-[45%]"
          />
          <CustomButton title="Yes" outline containerClassName="w-[45%]" />
        </View>
      </View>
    </Modal>
  );
};

export default DeleteClassModal;
