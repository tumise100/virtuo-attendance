import { Modal, Text, TouchableOpacity, View, Pressable } from "react-native";
import React, { forwardRef, useImperativeHandle, useState, useMemo, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { ModalProp } from "../../../shared";
import { useDragToClose } from "../useDragToClose";

type Props = {
  mode?: "single" | "range";
  selectedDate?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  onApply?: (filters: { date: string | null; fromDate: string | null; toDate: string | null }) => void;
};

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const CalendarFilterModal = forwardRef<ModalProp, Props>(
  (
    { mode = "range", selectedDate = null, fromDate = null, toDate = null, onApply },
    ref,
  ) => {
    const [visible, setVisible] = useState(false);
    const [cursor, setCursor] = useState<moment.Moment>(moment().startOf("month"));
    const [internalMode, setInternalMode] = useState<"single" | "range">(mode);
    const [singleDate, setSingleDate] = useState<string | null>(selectedDate);
    const [from, setFrom] = useState<string | null>(fromDate);
    const [to, setTo] = useState<string | null>(toDate);

    useEffect(() => {
      setInternalMode(mode);
      setSingleDate(selectedDate);
      setFrom(fromDate);
      setTo(toDate);
    }, [mode, selectedDate, fromDate, toDate, visible]);

    useImperativeHandle(ref, () => ({ setVisible: (val: boolean) => setVisible(val) }));

    const closeModal = () => setVisible(false);
    const dragHandlers = useDragToClose(closeModal);

    const goPrev = () => setCursor((c) => c.clone().subtract(1, "month"));
    const goNext = () => setCursor((c) => c.clone().add(1, "month"));

    const weeks = useMemo(() => {
      const start = cursor.clone().startOf("month").startOf("isoWeek");
      const end = cursor.clone().endOf("month").endOf("isoWeek");
      const rows: moment.Moment[][] = [];
      let cur = start.clone();
      while (cur.isSameOrBefore(end, "day")) {
        const week: moment.Moment[] = [];
        for (let i = 0; i < 7; i++) {
          week.push(cur.clone());
          cur.add(1, "day");
        }
        rows.push(week);
      }
      return rows;
    }, [cursor]);

    const handleDayPress = (day: moment.Moment) => {
      const iso = day.format("YYYY-MM-DD");
      if (internalMode === "single") {
        setSingleDate(iso);
        setFrom(null);
        setTo(null);
        return;
      }
      if (!from || (from && to)) {
        setFrom(iso);
        setTo(null);
      } else if (from && !to) {
        if (moment(iso).isBefore(from)) {
          setTo(from);
          setFrom(iso);
        } else {
          setTo(iso);
        }
      }
    };

    const isInRange = (day: moment.Moment) => {
      if (internalMode !== "range" || !from || !to) return false;
      const iso = day.format("YYYY-MM-DD");
      return iso >= from && iso <= to;
    };

    const isEdge = (day: moment.Moment) => {
      const iso = day.format("YYYY-MM-DD");
      return iso === from || iso === to || iso === singleDate;
    };

    const apply = () => {
      onApply?.({
        date: internalMode === "single" ? singleDate : null,
        fromDate: internalMode === "range" ? from : null,
        toDate: internalMode === "range" ? to : null,
      });
      closeModal();
    };

    const reset = () => {
      setSingleDate(null);
      setFrom(null);
      setTo(null);
      onApply?.({ date: null, fromDate: null, toDate: null });
      closeModal();
    };

    return (
      <Modal transparent visible={visible} animationType="slide" onRequestClose={closeModal}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={closeModal}>
          <Pressable className="bg-white rounded-t-3xl p-6 pb-8" onPress={(e) => e.stopPropagation()}>
            <View {...dragHandlers} className="items-center mb-4 py-2">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-black">Filter by Date</Text>
              <View className="flex-row bg-gray-100 rounded-full p-1">
                <TouchableOpacity
                  onPress={() => setInternalMode("single")}
                  className={`px-3 py-1 rounded-full ${internalMode === 'single' ? 'bg-orange-500' : ''}`}
                >
                  <Text className={`text-xs font-semibold ${internalMode === 'single' ? 'text-white' : 'text-gray-600'}`}>Date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setInternalMode("range")}
                  className={`px-3 py-1 rounded-full ${internalMode === 'range' ? 'bg-orange-500' : ''}`}
                >
                  <Text className={`text-xs font-semibold ${internalMode === 'range' ? 'text-white' : 'text-gray-600'}`}>Range</Text>
                </TouchableOpacity>
              </View>
            </View>

            {internalMode === "range" && (
              <View className="flex-row mb-4">
                <View className="flex-1 border border-gray-200 rounded-xl p-2 mr-2">
                  <Text className="text-[10px] text-gray-500">From</Text>
                  <Text className="text-sm font-semibold text-gray-900">{from ? moment(from).format("MMM D, YYYY") : "Select"}</Text>
                </View>
                <View className="flex-1 border border-gray-200 rounded-xl p-2 ml-2">
                  <Text className="text-[10px] text-gray-500">To</Text>
                  <Text className="text-sm font-semibold text-gray-900">{to ? moment(to).format("MMM D, YYYY") : "Select"}</Text>
                </View>
              </View>
            )}

            {internalMode === "single" && singleDate && (
              <View className="border border-gray-200 rounded-xl p-2 mb-4">
                <Text className="text-[10px] text-gray-500">Selected</Text>
                <Text className="text-sm font-semibold text-gray-900">{moment(singleDate).format("MMM D, YYYY")}</Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-4 px-2">
              <TouchableOpacity className="border border-gray-200 rounded-lg p-2" onPress={goPrev}>
                <Ionicons name="chevron-back" size={20} color="black" />
              </TouchableOpacity>
              <Text className="text-base font-bold text-gray-900">{cursor.format("MMMM, YYYY")}</Text>
              <TouchableOpacity className="border border-gray-200 rounded-lg p-2" onPress={goNext}>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-2">
              {WEEK_DAYS.map((d) => (
                <Text key={d} className="text-gray-400 font-medium w-10 text-center text-xs">{d}</Text>
              ))}
            </View>

            {weeks.map((week, wi) => (
              <View key={wi} className="flex-row justify-between mb-1">
                {week.map((day, di) => {
                  const inMonth = day.month() === cursor.month();
                  const edge = isEdge(day);
                  const inRange = isInRange(day) && !edge;
                  const isToday = day.isSame(moment(), "day");
                  return (
                    <TouchableOpacity
                      key={di}
                      onPress={() => handleDayPress(day)}
                      className="w-10 h-10 items-center justify-center"
                    >
                      <View
                        className={`w-9 h-9 items-center justify-center rounded-lg ${
                          edge ? 'bg-orange-500' : inRange ? 'bg-orange-100' : isToday ? 'border border-orange-400' : ''
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            edge ? 'text-white font-bold' :
                            !inMonth ? 'text-gray-300' :
                            inRange ? 'text-orange-700' :
                            'text-gray-900'
                          }`}
                        >
                          {day.date()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <View className="flex-row mt-5">
              <TouchableOpacity onPress={reset} className="flex-1 border border-gray-200 rounded-xl py-3 items-center mr-2">
                <Text className="text-gray-700 font-semibold">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={apply} className="flex-1 bg-orange-500 rounded-xl py-3 items-center ml-2">
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  },
);

export default CalendarFilterModal;
