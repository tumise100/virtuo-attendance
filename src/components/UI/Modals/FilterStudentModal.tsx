import { Modal, Text, TouchableOpacity, View, Pressable, ScrollView } from "react-native";
import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ModalProp } from "@/src/shared";
import { getClassDisplayName } from "@/src/utils";
import { useDragToClose } from "@/src/components/UI/useDragToClose";

type Props = {
  classes?: any[];
  selectedClassId?: number | null;
  selectedStatus?: "PRESENT" | "ABSENT" | null;
  onApply?: (filters: { classId: number | null; status: "PRESENT" | "ABSENT" | null }) => void;
};

const FilterStudentModal = forwardRef<ModalProp, Props>(
  ({ classes = [], selectedClassId = null, selectedStatus = null, onApply }, ref) => {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState<"PRESENT" | "ABSENT" | null>(selectedStatus);
    const [classId, setClassId] = useState<number | null>(selectedClassId);
    const [showClasses, setShowClasses] = useState(false);

    useEffect(() => {
      setStatus(selectedStatus);
      setClassId(selectedClassId);
    }, [selectedStatus, selectedClassId, visible]);

    useImperativeHandle(ref, () => ({
      setVisible: (val: boolean) => setVisible(val),
    }));

    const closeModal = () => setVisible(false);
    const dragHandlers = useDragToClose(closeModal);

    const apply = () => {
      onApply?.({ classId, status });
      closeModal();
    };

    const reset = () => {
      setStatus(null);
      setClassId(null);
      onApply?.({ classId: null, status: null });
      closeModal();
    };

    const selectedClass = classes.find((c: any) => c.id === classId);
    const selectedClassName = selectedClass ? getClassDisplayName(selectedClass) : "Any class";

    return (
      <Modal transparent visible={visible} animationType="slide" onRequestClose={closeModal}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={closeModal}>
          <Pressable className="bg-white rounded-t-3xl p-6 pb-10 max-h-[85%]" onPress={(e) => e.stopPropagation()}>
            <View {...dragHandlers} className="items-center mb-6 py-2">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <Text className="text-lg font-bold mb-4 text-black">Filter Students by</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                className="flex-row items-center justify-between mb-5"
                onPress={() => setStatus(status === "PRESENT" ? null : "PRESENT")}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                    <Text className="text-green-600 font-bold">P</Text>
                  </View>
                  <Text className="text-base text-gray-800">Present today</Text>
                </View>
                <View className={`w-6 h-6 rounded-full border items-center justify-center ${status === 'PRESENT' ? 'border-orange-500' : 'border-gray-400'}`}>
                  {status === "PRESENT" && <View className="w-3 h-3 rounded-full bg-orange-500" />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between mb-5"
                onPress={() => setStatus(status === "ABSENT" ? null : "ABSENT")}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                    <Text className="text-red-600 font-bold">A</Text>
                  </View>
                  <Text className="text-base text-gray-800">Absent today</Text>
                </View>
                <View className={`w-6 h-6 rounded-full border items-center justify-center ${status === 'ABSENT' ? 'border-orange-500' : 'border-gray-400'}`}>
                  {status === "ABSENT" && <View className="w-3 h-3 rounded-full bg-orange-500" />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between mb-3 py-2"
                onPress={() => setShowClasses((s) => !s)}
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons name="business-outline" size={22} color="#374151" style={{ marginRight: 12 }} />
                  <Text className="text-base text-gray-800 flex-1">Class</Text>
                  <Text className="text-sm text-gray-500 mr-2" numberOfLines={1}>{selectedClassName}</Text>
                </View>
                <Ionicons name={showClasses ? "chevron-down" : "chevron-forward"} size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {showClasses && (
                <View className="border border-gray-100 rounded-xl mb-4 max-h-60">
                  <ScrollView nestedScrollEnabled>
                    <TouchableOpacity
                      onPress={() => setClassId(null)}
                      className={`px-4 py-3 border-b border-gray-50 ${classId === null ? 'bg-orange-50' : ''}`}
                    >
                      <Text className="text-gray-700">Any class</Text>
                    </TouchableOpacity>
                    {classes.map((c: any) => (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => setClassId(c.id)}
                        className={`px-4 py-3 border-b border-gray-50 ${classId === c.id ? 'bg-orange-50' : ''}`}
                      >
                        <Text className="text-gray-700">{getClassDisplayName(c)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </ScrollView>

            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={reset}
                className="flex-1 border border-gray-200 rounded-xl py-3 items-center mr-2"
              >
                <Text className="text-gray-700 font-semibold">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={apply}
                className="flex-1 bg-orange-500 rounded-xl py-3 items-center ml-2"
              >
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
);

export default FilterStudentModal;
