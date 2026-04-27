import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
// import { combineStore } from "@/src/store";
import { GenericDropdown } from '@/src/components/UI/Dropdown';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/src/components/UI/ScreenContainer';
import { PrimaryButton } from '@/src/components/UI/Buttons/PrimaryButton';
import { COLORS } from '@/src/theme/colors';
import { combineStore } from '@/src/store';
import { ChangeStaffPassword, GetSchoolSettings, GetStaffProfile, UpdateSchoolSettings, UpdateStaffProfile } from '@/src/services/settings';
import { ChangePassword } from '@/src/services/auth';
import { showToast } from '@/src/components/UI/showToast';

const GENDER_OPTIONS = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
];

const QUALIFICATION_OPTIONS = [
    { value: "B.Sc", label: "B.Sc" },
    { value: "B.A", label: "B.A" },
    { value: "M.Sc", label: "M.Sc" },
    { value: "Ph.D", label: "Ph.D" },
    { value: "HND", label: "HND" },
    { value: "NCE", label: "NCE" },
];

// Internal Input Component to avoid re-creation
const SettingsInput = ({ label, value, onChange, placeholder, secure = false }: { label: string, value: string, onChange: (t: string) => void, placeholder: string, secure?: boolean }) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            secureTextEntry={secure}
            className="border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
            placeholderTextColor="#9CA3AF"
        />
    </View>
);

const SettingsScreen = () => {
    const { user, updateUserToken } = combineStore();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const account = user?.accounts?.[0] as any;
    const isSchool = account?.type === "SCHOOL";
    const staffId = account?.staff?.id;

    // Form State - Personal (filled from API; do not prefill with dummy values)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        qualification: "",
        address: "",
        schoolName: "",
        schoolType: "",
        image: null as string | null,
    });

    // Form State - Security
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchProfile();
    }, [isSchool, staffId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            if (isSchool) {
                const { responseData, responseStatus } = await GetSchoolSettings();
                if (responseStatus === 200 && responseData) {
                    const ownerName = (responseData.ownerName || "").split(/\s+/);
                    setFormData((prev) => ({
                        ...prev,
                        firstName: responseData.ownerFirstName || ownerName[0] || prev.firstName,
                        lastName: responseData.ownerLastName || ownerName.slice(1).join(" ") || prev.lastName,
                        email: responseData.email || prev.email,
                        phone: responseData.phoneNumber || responseData.phone || prev.phone,
                        address: responseData.address || prev.address,
                        schoolName: responseData.name || prev.schoolName,
                        schoolType: responseData.schoolType || prev.schoolType,
                        image: responseData.logo || prev.image,
                    }));
                }
            } else if (staffId) {
                const { responseData, responseStatus } = await GetStaffProfile(staffId);
                if (responseStatus === 200 && responseData) {
                    setFormData((prev) => ({
                        ...prev,
                        firstName: responseData.firstName || prev.firstName,
                        lastName: responseData.lastName || prev.lastName,
                        email: responseData.email || prev.email,
                        phone: responseData.phone || prev.phone,
                        gender: responseData.gender || prev.gender,
                        qualification: responseData.qualification || prev.qualification,
                        address: responseData.address || prev.address,
                        image: responseData.image || prev.image,
                    }));
                }
            }
        } catch (error) {
            console.error("fetchProfile error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setFormData({ ...formData, image: result.assets[0].uri });
        }
    };

    const handleSavePersonal = async () => {
        setSaving(true);
        try {
            if (isSchool) {
                const { responseData, responseStatus } = await UpdateSchoolSettings({
                    name: formData.schoolName,
                    ownerFirstName: formData.firstName,
                    ownerLastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    address: formData.address,
                });
                if (responseStatus === 200) showToast(responseData?.message || "Profile updated");
            } else if (staffId) {
                const { responseData, responseStatus } = await UpdateStaffProfile(staffId, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender?.toUpperCase(),
                    qualification: formData.qualification,
                    address: formData.address,
                    image: formData.image,
                });
                if (responseStatus === 200) showToast(responseData?.message || "Profile updated");
            }
        } catch (error) {
            console.error("handleSavePersonal error:", error);
            showToast("Unable to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        setSaving(true);
        try {
            const { responseData, responseStatus } = await (
                isSchool
                    ? ChangePassword({
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword,
                    })
                    : ChangeStaffPassword({
                        currentPassword: passwordData.currentPassword,
                        newPassword: passwordData.newPassword,
                    })
            );
            if (responseStatus === 200 || responseStatus === 201) {
                showToast(responseData?.message || "Password updated successfully");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            console.error("handleUpdatePassword error:", error);
            showToast("Unable to update password");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => updateUserToken("")
                }
            ]
        );
    };

    const renderTab = (tab: 'personal' | 'security', label: string, icon: any) => (
        <TouchableOpacity
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center justify-center border-b-2 py-3 ${activeTab === tab ? 'border-orange-500' : 'border-transparent'}`}
        >
            <View className="flex-row items-center gap-2">
                <Feather name={icon} size={16} color={activeTab === tab ? '#F97316' : '#6B7280'} />
                <Text className={`font-semibold ${activeTab === tab ? 'text-orange-500' : 'text-gray-500'}`}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer backgroundColor={COLORS.white} paddingTop={0}>
            {/* Header - Custom padding handled by wrapper or manual view if special header needed. 
                 Using manual padding here to match design of "sticky" header feeling if needed, 
                 or just rely on ScreenContainer's default if we remove the pt-12 below.
                 For now, let's stick to the safe area logic but keep the visual header distinct.
             */}
            <View className="bg-white px-4 py-4 pt-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackBtn />
                        <Text className="text-xl font-bold text-gray-900 ml-4">Settings</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout}>
                        <Feather name="log-out" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row border-b border-gray-100 mb-1 bg-white">
                {renderTab('personal', 'Personal Info', 'user')}
                {renderTab('security', 'Security', 'shield')}
            </View>

            <ScrollView className="flex-1 px-4 py-6 bg-gray-50" showsVerticalScrollIndicator={false}>
                {/* Personal Info Content */}
                <View className={`mb-20 ${activeTab === 'personal' ? 'flex' : 'hidden'}`}>
                    {/* Profile Image */}
                    <View className="flex-row items-center gap-4 mb-8">
                        <View className="w-24 h-24 rounded-2xl bg-orange-50 border border-orange-100 items-center justify-center overflow-hidden">
                            {formData.image ? (
                                <Image source={{ uri: formData.image }} className="w-full h-full" />
                            ) : (
                                <Feather name="camera" size={32} color="#FDBA74" />
                            )}
                        </View>
                        <View>
                            <Text className="text-base font-semibold text-gray-900 mb-2">Profile Photo</Text>
                            <TouchableOpacity
                                onPress={handlePickImage}
                                className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
                            >
                                <Text className="text-sm font-medium text-gray-700">Change Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    {isSchool ? (
                        <>
                            <SettingsInput label="School Name" value={formData.schoolName} onChange={(t) => setFormData({ ...formData, schoolName: t })} placeholder="Enter school name" />
                            <SettingsInput label="Owner First Name" value={formData.firstName} onChange={(t) => setFormData({ ...formData, firstName: t })} placeholder="Enter first name" />
                            <SettingsInput label="Owner Last Name" value={formData.lastName} onChange={(t) => setFormData({ ...formData, lastName: t })} placeholder="Enter last name" />
                            <SettingsInput label="Phone Number" value={formData.phone} onChange={(t) => setFormData({ ...formData, phone: t })} placeholder="Enter phone number" />
                            <SettingsInput label="Email Address" value={formData.email} onChange={(t) => setFormData({ ...formData, email: t })} placeholder="Enter email address" />
                            <SettingsInput label="School Address" value={formData.address} onChange={(t) => setFormData({ ...formData, address: t })} placeholder="Enter address" />
                        </>
                    ) : (
                        <>
                            <SettingsInput label="First Name" value={formData.firstName} onChange={(t) => setFormData({ ...formData, firstName: t })} placeholder="Enter first name" />
                            <SettingsInput label="Last Name" value={formData.lastName} onChange={(t) => setFormData({ ...formData, lastName: t })} placeholder="Enter last name" />
                            <SettingsInput label="Phone Number" value={formData.phone} onChange={(t) => setFormData({ ...formData, phone: t })} placeholder="Enter phone number" />
                            <SettingsInput label="Email Address" value={formData.email} onChange={(t) => setFormData({ ...formData, email: t })} placeholder="Enter email address" />

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Gender</Text>
                                <GenericDropdown
                                    data={GENDER_OPTIONS}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select gender"
                                    value={formData.gender}
                                    onChange={item => setFormData({ ...formData, gender: item.value })}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Qualification</Text>
                                <GenericDropdown
                                    data={QUALIFICATION_OPTIONS}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select qualification"
                                    value={formData.qualification}
                                    onChange={item => setFormData({ ...formData, qualification: item.value })}
                                />
                            </View>

                            <SettingsInput label="Residential Address" value={formData.address} onChange={(t) => setFormData({ ...formData, address: t })} placeholder="Enter address" />
                        </>
                    )}

                    <PrimaryButton
                        text="Save Profile"
                        onPress={handleSavePersonal}
                        isLoading={saving}
                        disabled={loading || saving}
                        className="mt-4"
                    />
                </View>

                {/* Security Content */}
                <View className={`mb-20 ${activeTab === 'security' ? 'flex' : 'hidden'}`}>
                    {/* Security Info */}
                    <View className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex-row gap-3">
                        <View className="bg-white p-2 rounded-lg items-center justify-center shadow-sm h-9 w-9">
                            <Feather name="lock" size={16} color="#F97316" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-bold text-gray-900 mb-1">Password Requirements</Text>
                            <Text className="text-xs text-gray-600">• Minimum 6 characters long</Text>
                            <Text className="text-xs text-gray-600">• Must match confirmation</Text>
                        </View>
                    </View>

                    <SettingsInput label="Current Password" value={passwordData.currentPassword} onChange={(t) => setPasswordData({ ...passwordData, currentPassword: t })} placeholder="••••••••" secure={true} />
                    <SettingsInput label="New Password" value={passwordData.newPassword} onChange={(t) => setPasswordData({ ...passwordData, newPassword: t })} placeholder="••••••••" secure={true} />
                    <SettingsInput label="Confirm New Password" value={passwordData.confirmPassword} onChange={(t) => setPasswordData({ ...passwordData, confirmPassword: t })} placeholder="••••••••" secure={true} />

                    <PrimaryButton
                        text="Update Password"
                        onPress={handleUpdatePassword}
                        isLoading={saving}
                        disabled={saving}
                        className="mt-4"
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

export default SettingsScreen;
