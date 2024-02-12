import { Entypo, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native'
export default function ErrorList(props) {
  const { errors } = props;
  const [isOpen, setIsOpen] = useState(false)
  return (
    <View style={{ flexDirection: "column", borderWidth: 1, borderColor: '#BCBCBC', borderRadius: 4, marginTop: 6, backgroundColor: 'white', }} >
      <TouchableOpacity
        onPress={() => setIsOpen(prevIsOpen => !prevIsOpen)}
        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Text style={{ backgroundColor: '#dc3545', color: 'white', borderRadius: 99, width: 20, height: 20, textAlign: 'center' }}>{errors.length}</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '400',
            color: '#111',
          }}>Errors</Text>
        </View>
        {isOpen ?
          <Ionicons name="chevron-up" size={18} />
          :
          <Ionicons name="chevron-down" size={18} />
        }
      </TouchableOpacity>
      {isOpen && (
        <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
          {errors.map((error, i) => {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                <Entypo name="dot-single" size={25} />
                <Text key={i} style={{ color: '#dc3545', textTransform: 'capitalize', width: '90%' }}>
                  {error.stack}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
