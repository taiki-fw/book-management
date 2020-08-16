import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Book } from "./Book/Book";

type Props = {
  bookData: any;
  setBookData: React.Dispatch<React.SetStateAction<undefined>>;
  scanned: boolean;
  setScanned: React.Dispatch<React.SetStateAction<boolean>>;
  handleBarCodeScanned: ({ data }: { data: string }) => void;
};

const Component = (props: Props) => (
  <View>
    {props.bookData == undefined ? (
      <>
        <Text>上段のバーコードをかざしてください</Text>
        <BarCodeScanner
          style={{ width: 200, height: 100 }}
          onBarCodeScanned={
            props.scanned ? () => {} : props.handleBarCodeScanned
          }
        />
      </>
    ) : (
      <Book
        img={props.bookData.volumeInfo.imageLinks.thumbnail}
        title={props.bookData.volumeInfo.title}
      />
    )}
    {props.scanned && (
      <Button
        title={"Tap to Scan Again"}
        onPress={() => {
          props.setBookData(undefined);
          props.setScanned(false);
        }}
      />
    )}
  </View>
);

export const BarCodeScannerContainer = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookData, setBookData] = useState(undefined);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${data}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.totalItems) {
          return;
        }
        setBookData(json.items[0]);
        setScanned(true);
      })
      .catch((error) => console.error(error));
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Component
      bookData={bookData}
      setBookData={setBookData}
      scanned={scanned}
      setScanned={setScanned}
      handleBarCodeScanned={handleBarCodeScanned}
    />
  );
};
