import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

type Props = {
  title: string;
  img: string;
};

export const Book = (props: Props) => (
  <View>
    <Image style={style.book} source={{ uri: props.img }} />
    <Text>{props.title}</Text>
  </View>
);

const style = StyleSheet.create({
  book: {
    width: 128,
    height: 182,
  },
});
