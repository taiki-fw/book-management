import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Book } from "./Book/Book";

export function BarCodeScannerContainer() {
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
    <View>
      {bookData == undefined ? (
        <>
          <Text>上段のバーコードをかざしてください</Text>
          <BarCodeScanner
            style={{ width: 200, height: 100 }}
            onBarCodeScanned={scanned ? () => {} : handleBarCodeScanned}
          />
        </>
      ) : (
        <Book
          img={bookData.volumeInfo.imageLinks.thumbnail}
          title={bookData.volumeInfo.title}
        />
      )}
      {scanned && (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => {
            setBookData(undefined);
            setScanned(false);
          }}
        />
      )}
    </View>
  );
}
