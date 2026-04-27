import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import ClassCardOverview from "../../components/UI/ClassCardOverview";
import PaginationControls from "../../components/UI/PaginationControls";
import NoDataComponent from '../../components/UI/NoData';
import { ISecondaryClassHeader } from "@/src/contracts/course";
import { StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from "react-native";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

import { GetClasses } from "@/src/services/class";
import { asArray } from "@/src/utils";

const AllClassScreen = ({ navigation }: StackNavigationProps) => {
  const [schoolClasses, setSchoolClasses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Pagination Logic ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetClasses();
      if (responseStatus === 200) {
        setSchoolClasses(asArray(responseData));
      }
    } catch (error) {
      console.error("fetchClasses error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!searchQuery) {
      return schoolClasses;
    }
    const lowerCaseQuery = (searchQuery || "").toLowerCase();
    return (schoolClasses || []).filter(
      (cl) =>
        (cl?.name || "").toLowerCase().includes(lowerCaseQuery) ||
        (cl?.classLevel?.name && cl.classLevel.name.toLowerCase().includes(lowerCaseQuery))
    );
  }, [schoolClasses, searchQuery]);

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <ScreenContainer>
      <View className="flex-row items-center px-4 mb-4">
        <BackBtn />
        <Text className="text-lg font-bold text-gray-900 ml-4">All Classes</Text>
      </View>


      <View className="px-4">
        <InputWithFilter
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(1);
          }}
          placeHolder="Search for class"
        />
      </View>

      <View className="flex-1 px-4">
        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchClasses} tintColor="#F97316" colors={["#F97316"]} />}
          >
            {paginatedClasses.length === 0 ? (
              <NoDataComponent />
            ) : (
              paginatedClasses.map((cl: any) => {
                const titlePieces = [cl?.name, cl?.section?.name].filter(Boolean).join(" ");
                const groupName = cl?.classGroup?.name || cl?.classLevel?.name || "";
                const isJunior = /junior|primary|nursery|kg|prep/i.test(groupName);
                const facultyPiece = !isJunior ? cl?.faculty?.name : groupName;
                const subtitlePieces = [groupName, facultyPiece].filter(Boolean).join(" • ");
                return (
                  <ClassCardOverview
                    key={cl.id}
                    title={titlePieces || cl?.name || 'Class'}
                    subTitle={subtitlePieces || 'Class'}
                    variant="light"
                    showChevron={true}
                    showAttendanceAvg={false}
                    showAttendanceStats={false}
                    onPress={() => navigation.navigate("SecondaryClassDetailScreen", { classId: cl.id, className: titlePieces || cl.name })}
                  />
                );
              })
            )}
          </ScrollView>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </View>
    </ScreenContainer>
  );
};

export default AllClassScreen;
