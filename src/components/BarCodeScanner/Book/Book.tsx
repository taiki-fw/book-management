import React from "react";
import { Text, View, StyleSheet, Image, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

type ContainerProps = {
  title: string;
  img: string;
};

type Props = {
  storeBook: () => Promise<void>;
} & ContainerProps;

const Component = (props: Props) => (
  <View>
    <Image style={style.book} source={{ uri: props.img }} />
    <Text>{props.title}</Text>
    <Button title="保存" onPress={props.storeBook} />
  </View>
);

const style = StyleSheet.create({
  book: {
    width: 128,
    height: 182,
  },
});

export const Book = (props: ContainerProps) => {
  const storeBook = async (book: { title: string; img: string }) => {
    try {
      await AsyncStorage.setItem(book.title, JSON.stringify(book));
    } catch (e) {
      console.error(e);
    }
  };

  return <Component {...props} storeBook={() => storeBook(props)} />;
};
