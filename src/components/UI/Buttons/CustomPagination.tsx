import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { generatePaginationArray } from "@/src/utils/generatePaginationArray";

const CustomPagination = ({
  numberOfPage,
  currentPage,
  onPressItem,
  onPrevPress,
  onNextPress,
  customClass,
  absolute = true,
  itemClassName,
  itemContainerClassName,
  elevation = true,
}: {
  numberOfPage: number;
  currentPage: number;
  onPressItem: (val: number | string) => void;
  onPrevPress: () => void;
  onNextPress: () => void;
  customClass?: string;
  absolute?: boolean;
  itemContainerClassName?: string;
  itemClassName?: string;
  elevation?: boolean;
}) => {
  return (
    <View
      className={`${
        absolute && "absolute bottom-4 right-0 left-0"
      } bg-white mx-2 p-4 px-3 rounded-md flex-row items-center justify-between ${customClass}`}
      style={{ elevation: elevation ? (absolute ? 10 : 7) : 0 }}
    >
      <TouchableOpacity className="justify-center" onPress={onPrevPress}>
        {currentPage !== 1 ? (
          <AntDesign
            name="arrowleft"
            size={24}
            accessibilityLabel="Go to the previous pagination item"
            color={COLORS.gray3}
          />
        ) : (
          <View className="w-[24px]" />
        )}
      </TouchableOpacity>

      {generatePaginationArray(currentPage, numberOfPage).map((i, _) => (
        <CustomPaginationItem
          key={_}
          value={i}
          isActive={currentPage === i}
          onPressItem={onPressItem}
          itemClassName={itemClassName}
          itemContainerClassName={itemContainerClassName}
        />
      ))}
      <TouchableOpacity className="justify-center" onPress={onNextPress}>
        {currentPage !== numberOfPage ? (
          <AntDesign
            accessibilityLabel="Go to the next pagination item"
            name="arrowright"
            size={24}
            color={COLORS.gray3}
          />
        ) : (
          <View className="w-[24px]" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomPagination;

const CustomPaginationItem = ({
  value,
  isActive,
  onPressItem,
  itemClassName,
  itemContainerClassName,
}: {
  value: number | string;
  isActive: boolean;
  onPressItem: (val: number | string) => void;
  itemContainerClassName?: string;
  itemClassName?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPressItem.bind(null, value)}
      accessible
      accessibilityLabel={
        String(value).trim() === "..."
          ? "Pagination Ellipses"
          : `Pagination Item ${value}`
      }
      accessibilityHint={isActive ? "Currently Selected" : ""}
      className={`h-10 w-10 items-center justify-center rounded-full ${
        isActive && "bg-primary-500"
      } ${itemContainerClassName}`}
    >
      <Text
        className={`font-medium text-[13px] ${
          isActive && "text-white"
        } ${itemClassName}`}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
};

export const handlePaginationItemPress = (
  val: number | string,
  numberOfPages: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  console.log(typeof val, "val");

  const totalItems = numberOfPages;
  if (totalItems) {
    if (val === "... ") {
      setCurrentPage(numberOfPages);
    } else if (val === " ...") {
      setCurrentPage(1);
    } else {
      if (typeof val === "number") {
        console.log(val);

        setCurrentPage(val);
      }
    }
  }
};

export const handlePaginationNextPress = (
  currentPage: number,
  dataObjTotalItems: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  if (dataObjTotalItems) {
    if (currentPage + 1 > dataObjTotalItems) return;

    setCurrentPage(currentPage + 1);
  }
};

export const handlePaginationPrevPress = (
  currentPage: number,
  dataObjTotalItems: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  if (dataObjTotalItems) {
    if (currentPage - 1 < 1) return;

    setCurrentPage(currentPage - 1);
  }
};
