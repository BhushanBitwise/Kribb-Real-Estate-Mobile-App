import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';

export default function profile() {
  const router =useRouter();
  const {signOut}=useAuth();
  const handleSignOut=async()=>{
    try{
      await signOut();
      router.replace("/sign-in");
    }catch(err){}
  }
  return (
    <View className="mt-10 ml-20">
      <TouchableOpacity onPress={handleSignOut}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  )
}