import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Entypo } from "@expo/vector-icons/";
import { COLORS } from "@/src/theme/colors";
import { DropdownData } from "@/src/shared";

const _data: DropdownData[] = [
  { name: "Senior Lecturer", id: "1" },
  { name: "Junior Lecturer", id: "2" },
  { name: "Graduate Assistant", id: "3" },
];

const CustomDropdown = ({
  placeholder,
  data = _data,
}: {
  placeholder?: string;
  data?: DropdownData[];
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: COLORS.primary[500] }]}
      placeholderStyle={[styles.placeholderStyle, { color: COLORS.neutral[400] }]}
      selectedTextStyle={styles.placeholderStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data}
      labelField="name"
      valueField="id"
      placeholder={placeholder}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.id);
        setIsFocus(false);
      }}
      renderRightIcon={(props) => (
        <Entypo
          name="chevron-down"
          size={18}
          color={COLORS.neutral[500]}
          style={{ marginRight: 10 }}
        />
      )}
      renderItem={(item) => (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.name}</Text>
        </View>
      )}
    />
  );
};

// Also export a version that accepts generic props for broader usage
interface GenericDropdownProps {
  data: any[];
  labelField: string;
  valueField: string;
  placeholder?: string;
  value?: any;
  onChange: (item: any) => void;
  style?: any;
}

export const GenericDropdown = ({ data, labelField, valueField, placeholder, value, onChange, style }: GenericDropdownProps) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Dropdown
      style={[styles.dropdown, style, isFocus && { borderColor: COLORS.primary[500] }]}
      placeholderStyle={[styles.placeholderStyle, { color: COLORS.neutral[400] }]}
      selectedTextStyle={[styles.placeholderStyle, { color: COLORS.textColor }]}
      data={data}
      labelField={labelField}
      valueField={valueField}
      placeholder={placeholder}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        onChange(item);
        setIsFocus(false);
      }}
      renderRightIcon={() => (
        <Entypo
          name="chevron-down"
          size={18}
          color={COLORS.neutral[500]}
          style={{ marginRight: 10 }}
        />
      )}
    />
  )
}

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 14,
    marginLeft: 0,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 20,
    fontSize: 16,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textColor
  },
});
